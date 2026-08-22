import { chapterEmailHtml, CHAPTER_LABELS } from "./templates.js";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function corsHeaders(origin, allowedOrigin) {
  const allowed = allowedOrigin.split(",").map((s) => s.trim());
  const acao = allowed.includes(origin) ? origin : allowed[0];
  return {
    "Access-Control-Allow-Origin": acao,
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Vary": "Origin",
  };
}

function json(data, status, extraHeaders) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", ...extraHeaders },
  });
}

async function verifyTurnstile(token, secret, ip) {
  if (!token) return false;
  const body = new URLSearchParams();
  body.set("secret", secret);
  body.set("response", token);
  if (ip) body.set("remoteip", ip);

  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  const data = await res.json();
  return data.success === true;
}

async function hmacHex(secret, message) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(message));
  return [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function sendBrevoEmail(env, { toEmail, toName, subject, html }) {
  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "api-key": env.BREVO_API_KEY,
    },
    body: JSON.stringify({
      sender: { name: env.SENDER_NAME, email: env.SENDER_EMAIL },
      to: [{ email: toEmail, name: toName || undefined }],
      subject,
      htmlContent: html,
    }),
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Brevo respondió ${res.status}: ${errText}`);
  }
}

async function handleSubscribe(request, env) {
  const origin = request.headers.get("Origin") || "";
  const cors = corsHeaders(origin, env.ALLOWED_ORIGIN);

  let payload;
  try {
    payload = await request.json();
  } catch {
    return json({ ok: false, error: "JSON inválido." }, 400, cors);
  }

  const { name, email, chapter, turnstileToken, website } = payload;

  // Honeypot: campo "website" debe llegar vacío. Si un bot lo rellena, lo
  // dejamos "aceptar" en apariencia (para no delatar el honeypot) pero no
  // hacemos nada.
  if (website) {
    return json({ ok: true }, 200, cors);
  }

  if (!email || !EMAIL_RE.test(email)) {
    return json({ ok: false, error: "Correo inválido." }, 400, cors);
  }

  const chapterKey = CHAPTER_LABELS[chapter] ? chapter : "cap1";

  const ip = request.headers.get("CF-Connecting-IP");
  const turnstileOk = await verifyTurnstile(turnstileToken, env.TURNSTILE_SECRET_KEY, ip);
  if (!turnstileOk) {
    return json({ ok: false, error: "Verificación anti-spam fallida." }, 403, cors);
  }

  // Upsert del suscriptor. Si ya existe y sigue activo, no reenviamos correo
  // (evita que alguien reciba el mismo capítulo repetidamente).
  const existing = await env.DB
    .prepare("SELECT id, status FROM subscribers WHERE email = ?")
    .bind(email)
    .first();

  if (existing && existing.status === "active") {
    return json({ ok: true, alreadySubscribed: true }, 200, cors);
  }

  if (existing) {
    await env.DB
      .prepare("UPDATE subscribers SET status = 'active', name = ?, chapter_selected = ? WHERE email = ?")
      .bind(name || null, chapterKey, email)
      .run();
  } else {
    await env.DB
      .prepare(
        "INSERT INTO subscribers (email, name, chapter_selected, status) VALUES (?, ?, ?, 'active')"
      )
      .bind(email, name || null, chapterKey)
      .run();
  }

  // Enlace de descarga: apunta a un recurso privado con expiración propia
  // (ver README, sección "Entrega del PDF"). Por ahora usamos la URL fija
  // configurada en el Worker; en la Iteración 2 se firma con expiración real.
  const downloadUrl = env[`DOWNLOAD_URL_${chapterKey.toUpperCase()}`] || env.DOWNLOAD_URL_CAP1;

  const unsubSig = await hmacHex(env.UNSUB_SECRET, email);
  const unsubscribeUrl = `${new URL(request.url).origin}/unsubscribe?email=${encodeURIComponent(email)}&sig=${unsubSig}`;

  const html = chapterEmailHtml({ name, chapterKey, downloadUrl }).replace(
    "{{unsubscribeUrl}}",
    unsubscribeUrl
  );

  try {
    await sendBrevoEmail(env, {
      toEmail: email,
      toName: name,
      subject: `Tu capítulo de Código Sintético está listo`,
      html,
    });
  } catch (err) {
    // El registro en D1 ya quedó guardado; devolvemos error para que el
    // front-end pueda avisar, pero no perdemos al suscriptor.
    return json({ ok: false, error: "No se pudo enviar el correo. Intenta de nuevo en unos minutos." }, 502, cors);
  }

  await env.DB
    .prepare("UPDATE subscribers SET last_sent_at = datetime('now') WHERE email = ?")
    .bind(email)
    .run();

  return json({ ok: true }, 200, cors);
}

async function handleUnsubscribe(request, env) {
  const url = new URL(request.url);
  const email = url.searchParams.get("email") || "";
  const sig = url.searchParams.get("sig") || "";

  if (!email || !sig) {
    return new Response("Enlace inválido.", { status: 400 });
  }

  const expected = await hmacHex(env.UNSUB_SECRET, email);
  if (expected !== sig) {
    return new Response("Enlace inválido o alterado.", { status: 403 });
  }

  await env.DB
    .prepare("UPDATE subscribers SET status = 'unsubscribed' WHERE email = ?")
    .bind(email)
    .run();

  return new Response(
    "Listo, te dimos de baja. Puedes cerrar esta pestaña.",
    { status: 200, headers: { "Content-Type": "text/plain; charset=utf-8" } }
  );
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const origin = request.headers.get("Origin") || "";

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders(origin, env.ALLOWED_ORIGIN) });
    }

    if (url.pathname === "/subscribe" && request.method === "POST") {
      return handleSubscribe(request, env);
    }

    if (url.pathname === "/unsubscribe" && request.method === "GET") {
      return handleUnsubscribe(request, env);
    }

    return new Response("Not found", { status: 404 });
  },
};
