import { chapterEmailHtml, day3FollowUpHtml, day7FollowUpHtml, CHAPTER_LABELS } from "./templates.js";

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

// El bucket R2 es privado (sin acceso público) — el PDF nunca se expone en
// una URL suelta. En su lugar, el Worker genera un enlace propio
// (/download?...) firmado con HMAC y con una fecha de expiración embebida.
// Solo alguien con la firma correcta (generada aquí, tras pasar Turnstile)
// puede descargar, y el enlace deja de servir pasado ese tiempo.
const CHAPTER_OBJECT_KEYS = {
  cap1: "capitulo-1.pdf",
  cap2: "capitulo-2.pdf",
  cap3: "capitulo-3.pdf",
};

const DOWNLOAD_TTL_SECONDS = 7 * 24 * 60 * 60; // 7 días, como promete el email

async function buildDownloadUrl(request, env, chapterKey, email) {
  const exp = Math.floor(Date.now() / 1000) + DOWNLOAD_TTL_SECONDS;
  const sig = await hmacHex(env.DOWNLOAD_SECRET, `${chapterKey}:${email}:${exp}`);
  const params = new URLSearchParams({ chapter: chapterKey, email, exp: String(exp), sig });
  return `${new URL(request.url).origin}/download?${params.toString()}`;
}

async function handleDownload(request, env) {
  const url = new URL(request.url);
  const chapterKey = url.searchParams.get("chapter") || "";
  const email = url.searchParams.get("email") || "";
  const expStr = url.searchParams.get("exp") || "";
  const sig = url.searchParams.get("sig") || "";

  const objectKey = CHAPTER_OBJECT_KEYS[chapterKey];
  if (!objectKey || !email || !expStr || !sig) {
    return new Response("Enlace inválido.", { status: 400 });
  }

  const exp = parseInt(expStr, 10);
  if (!Number.isFinite(exp) || Date.now() / 1000 > exp) {
    return new Response(
      "Este enlace de descarga expiró (los enlaces duran 7 días). Vuelve a suscribirte para recibir uno nuevo.",
      { status: 410, headers: { "Content-Type": "text/plain; charset=utf-8" } }
    );
  }

  const expected = await hmacHex(env.DOWNLOAD_SECRET, `${chapterKey}:${email}:${exp}`);
  if (expected !== sig) {
    return new Response("Enlace inválido o alterado.", { status: 403 });
  }

  const object = await env.CHAPTERS_BUCKET.get(objectKey);
  if (!object) {
    return new Response("El archivo no está disponible por ahora. Contacta a soporte.", { status: 404 });
  }

  return new Response(object.body, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${objectKey}"`,
      "Cache-Control": "private, no-store",
    },
  });
}

// ── Iteración 3: panel de solo lectura ──────────────────────────────────
// Protegido por un header simple (X-Admin-Key) comparado contra el secret
// ADMIN_KEY. No expone la lista de correos, solo conteos agregados.
async function handleAdminStats(request, env) {
  const key = request.headers.get("X-Admin-Key") || "";
  if (!env.ADMIN_KEY || key !== env.ADMIN_KEY) {
    return json({ ok: false, error: "No autorizado." }, 401, {
      "Access-Control-Allow-Origin": "*",
    });
  }

  const cors = { "Access-Control-Allow-Origin": "*" };

  const totals = await env.DB
    .prepare(
      `SELECT
         COUNT(*) FILTER (WHERE status = 'active') AS active,
         COUNT(*) FILTER (WHERE status = 'unsubscribed') AS unsubscribed,
         COUNT(*) AS total
       FROM subscribers`
    )
    .first();

  const byChapter = await env.DB
    .prepare(
      `SELECT chapter_selected AS chapter, COUNT(*) AS count
       FROM subscribers
       WHERE status = 'active'
       GROUP BY chapter_selected`
    )
    .all();

  const last7d = await env.DB
    .prepare(
      `SELECT COUNT(*) AS count FROM subscribers
       WHERE created_at >= datetime('now', '-7 days')`
    )
    .first();

  const last30d = await env.DB
    .prepare(
      `SELECT COUNT(*) AS count FROM subscribers
       WHERE created_at >= datetime('now', '-30 days')`
    )
    .first();

  const recentSignups = await env.DB
    .prepare(
      `SELECT date(created_at) AS day, COUNT(*) AS count
       FROM subscribers
       WHERE created_at >= datetime('now', '-14 days')
       GROUP BY day
       ORDER BY day DESC`
    )
    .all();

  return json(
    {
      ok: true,
      totals: {
        active: totals?.active || 0,
        unsubscribed: totals?.unsubscribed || 0,
        total: totals?.total || 0,
      },
      byChapter: byChapter?.results || [],
      last7Days: last7d?.count || 0,
      last30Days: last30d?.count || 0,
      signupsByDay: recentSignups?.results || [],
    },
    200,
    cors
  );
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

// ── Iteración 2: secuencia de seguimiento (día 3 / día 7) ───────────────
// Se dispara desde el Cron Trigger configurado en wrangler.toml. Cada
// corrida busca suscriptores activos a los que ya les toca el correo de
// día 3 o día 7 (según `created_at`) y que todavía no lo recibieron, y
// marca la columna correspondiente para no duplicar envíos.
async function runFollowUpSequence(env) {
  const results = { day3Sent: 0, day7Sent: 0, errors: [] };

  const day3Due = await env.DB
    .prepare(
      `SELECT id, email, name, chapter_selected FROM subscribers
       WHERE status = 'active'
         AND day3_sent_at IS NULL
         AND created_at <= datetime('now', '-3 days')`
    )
    .all();

  for (const sub of day3Due?.results || []) {
    try {
      const unsubSig = await hmacHex(env.UNSUB_SECRET, sub.email);
      const workerOrigin = env.WORKER_ORIGIN || "";
      const unsubUrl = `${workerOrigin}/unsubscribe?email=${encodeURIComponent(sub.email)}&sig=${unsubSig}`;

      const html = day3FollowUpHtml({
        name: sub.name,
        chapterKey: sub.chapter_selected,
        unsubscribeUrl: unsubUrl,
      });

      await sendBrevoEmail(env, {
        toEmail: sub.email,
        toName: sub.name,
        subject: "¿Qué te pareció el capítulo? — Código Sintético",
        html,
      });

      await env.DB
        .prepare("UPDATE subscribers SET day3_sent_at = datetime('now') WHERE id = ?")
        .bind(sub.id)
        .run();
      results.day3Sent++;
    } catch (err) {
      results.errors.push(`day3:${sub.email}:${err.message || err}`);
    }
  }

  const day7Due = await env.DB
    .prepare(
      `SELECT id, email, name FROM subscribers
       WHERE status = 'active'
         AND day7_sent_at IS NULL
         AND created_at <= datetime('now', '-7 days')`
    )
    .all();

  for (const sub of day7Due?.results || []) {
    try {
      const unsubSig = await hmacHex(env.UNSUB_SECRET, sub.email);
      const workerOrigin = env.WORKER_ORIGIN || "";
      const unsubUrl = `${workerOrigin}/unsubscribe?email=${encodeURIComponent(sub.email)}&sig=${unsubSig}`;

      const html = day7FollowUpHtml({ name: sub.name, unsubscribeUrl: unsubUrl });

      await sendBrevoEmail(env, {
        toEmail: sub.email,
        toName: sub.name,
        subject: "Antes de que se te pase — Código Sintético",
        html,
      });

      await env.DB
        .prepare("UPDATE subscribers SET day7_sent_at = datetime('now') WHERE id = ?")
        .bind(sub.id)
        .run();
      results.day7Sent++;
    } catch (err) {
      results.errors.push(`day7:${sub.email}:${err.message || err}`);
    }
  }

  return results;
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

  // Enlace de descarga: apunta al propio Worker (/download), firmado con
  // HMAC y con expiración de 7 días embebida — el PDF real vive en un
  // bucket R2 privado, nunca se expone directamente.
  const downloadUrl = await buildDownloadUrl(request, env, chapterKey, email);

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

// Variables/secrets que el Worker necesita para funcionar. Si falta
// cualquiera de estas, antes se traducía en una excepción sin manejar
// (el navegador la veía como "error de CORS" porque la respuesta de error
// no traía ningún header). Ahora se valida explícitamente y se devuelve un
// mensaje claro que dice exactamente qué falta configurar.
const REQUIRED_ENV_VARS = [
  "ALLOWED_ORIGIN",
  "BREVO_API_KEY",
  "TURNSTILE_SECRET_KEY",
  "UNSUB_SECRET",
  "DOWNLOAD_SECRET",
  "SENDER_EMAIL",
  "SENDER_NAME",
];

function missingEnvVars(env) {
  return REQUIRED_ENV_VARS.filter((key) => !env[key]);
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const origin = request.headers.get("Origin") || "";
    const cors = corsHeaders(origin, env.ALLOWED_ORIGIN || "*");

    try {
      if (request.method === "OPTIONS") {
        return new Response(null, { headers: cors });
      }

      // Estas 2 rutas necesitan las variables/secrets configurados para
      // funcionar (firman enlaces y envían correo). Si falta alguna,
      // devolvemos un error claro en vez de dejar que truene sin avisar.
      if (
        (url.pathname === "/subscribe" && request.method === "POST") ||
        (url.pathname === "/download" && request.method === "GET")
      ) {
        const missing = missingEnvVars(env);
        if (missing.length > 0) {
          return json(
            {
              ok: false,
              error: `Falta configurar en el Worker: ${missing.join(", ")}. Ve a Settings → Variables and Secrets.`,
            },
            500,
            cors
          );
        }
      }

      if (url.pathname === "/subscribe" && request.method === "POST") {
        return await handleSubscribe(request, env);
      }

      if (url.pathname === "/download" && request.method === "GET") {
        return await handleDownload(request, env);
      }

      if (url.pathname === "/admin/stats" && request.method === "GET") {
        return await handleAdminStats(request, env);
      }

      if (url.pathname === "/unsubscribe" && request.method === "GET") {
        return await handleUnsubscribe(request, env);
      }

      return new Response("Not found", { status: 404, headers: cors });
    } catch (err) {
      // Red de seguridad: cualquier excepción no prevista, de cualquier
      // ruta, SIEMPRE devuelve una respuesta con headers CORS y el mensaje
      // real del error — nunca más una respuesta "en blanco" que el
      // navegador reporte como fallo de CORS.
      return json(
        { ok: false, error: `Error interno: ${err.message || String(err)}` },
        500,
        cors
      );
    }
  },

  // Cron Trigger (ver [triggers] en wrangler.toml) — corre la secuencia de
  // seguimiento de día 3 / día 7. No hace nada si no hay suscriptores que
  // les toque un correo todavía.
  async scheduled(controller, env, ctx) {
    ctx.waitUntil(runFollowUpSequence(env));
  },
};
