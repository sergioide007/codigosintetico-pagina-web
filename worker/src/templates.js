/**
 * Plantillas de correo en texto plano JS (los Workers no tienen sistema de
 * archivos en runtime, así que no se pueden leer .html sueltos — se bundean
 * como strings). Los estilos van inline porque muchos clientes de correo
 * (Gmail, Outlook) ignoran <style> en el <head>.
 *
 * Dos idiomas: "es" (Código Sintético) y "en" (Synthetic Code, la edición en
 * inglés). Cada suscriptor recibe toda la secuencia en el idioma que eligió.
 */

function escapeHtml(str) {
  return String(str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

const LANGS = ["es", "en"];
const normLang = (lang) => (LANGS.includes(lang) ? lang : "es");

const CHAPTER_LABELS = {
  cap1: "Capítulo 1 — El despertar agéntico",
  cap2: "Capítulo 2 — El AI Engineer",
  cap3: "Capítulo 3 — Platform Engineering en la era agéntica",
};

const CHAPTER_LABELS_EN = {
  cap1: "Chapter 1 — The Agentic Awakening",
  cap2: "Chapter 2 — The AI Engineer",
  cap3: "Chapter 3 — Platform Engineering in the Agentic Era",
};

function chapterLabel(chapterKey, lang) {
  const labels = normLang(lang) === "en" ? CHAPTER_LABELS_EN : CHAPTER_LABELS;
  return labels[chapterKey] || labels.cap1;
}

const SUBJECTS = {
  es: {
    chapter: "Tu capítulo de Código Sintético está listo",
    day3: "¿Qué te pareció el capítulo? — Código Sintético",
    day7: "Código Sintético ya está disponible",
  },
  en: {
    chapter: "Your Synthetic Code chapter is ready",
    day3: "How was the chapter? — Synthetic Code",
    day7: "Synthetic Code is out now",
  },
};

function subjectFor(kind, lang) {
  return SUBJECTS[normLang(lang)][kind];
}

const COMMON = {
  es: {
    brand: "C&Oacute;DIGO <span style=\"color:#e8a33d;\">SINT&Eacute;TICO</span>",
    hello: (n) => (n ? `Hola ${n},` : "Hola,"),
    why: "Recibiste este correo porque te suscribiste en codigosintetico.specsolid.com.",
    unsub: "Darme de baja",
  },
  en: {
    brand: "SYNTHETIC <span style=\"color:#e8a33d;\">CODE</span>",
    hello: (n) => (n ? `Hi ${n},` : "Hi,"),
    why: "You received this email because you subscribed at codigosintetico.specsolid.com.",
    unsub: "Unsubscribe",
  },
};

const A = "color:#e8a33d; text-decoration:none;";
const BTN = `display:inline-block; background-color:#e8a33d; color:#15151d; text-decoration:none;
                    font-weight:700; font-size:15px; padding:14px 28px; border-radius:8px;`;
const REPO = `<a href="https://github.com/sergioide007/synthetic-code" style="${A}">github.com/sergioide007/synthetic-code</a>`;

// Marco común de los tres correos: cabecera con la marca, cuerpo y pie con la baja.
function layout({ lang, title, body, unsubscribeUrl }) {
  const c = COMMON[lang];
  return `<!DOCTYPE html>
<html lang="${lang}">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${title}</title></head>
<body style="margin:0; padding:0; background-color:#0d0d12; font-family:Arial, Helvetica, sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#0d0d12; padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="100%" style="max-width:560px; background-color:#15151d; border:1px solid #2a2a35; border-radius:14px; overflow:hidden;">
        <tr><td style="padding:32px 32px 8px; text-align:center;">
          <div style="font-family:Arial, sans-serif; font-size:22px; font-weight:800; letter-spacing:1px; color:#ffffff;">
            ${c.brand}
          </div>
          <div style="height:1px; background-color:#e8a33d; margin:20px auto; width:64px;"></div>
        </td></tr>
${body}
        <tr><td style="padding:20px 32px; border-top:1px solid #2a2a35; text-align:center;">
          <p style="margin:0 0 6px; font-size:13px; color:#8a8a96;">Sergio Perez Ruiz — SpecSolid Press</p>
          <p style="margin:0; font-size:12px; color:#65656f;">
            ${c.why}
            <a href="${unsubscribeUrl}" style="color:#8a8a96;">${c.unsub}</a>
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

const textRow = (inner) => `        <tr><td style="padding:0 32px 8px; color:#e8e8ec; font-size:16px; line-height:1.6;">
${inner}
        </td></tr>`;
const buttonRow = (href, label, note) => `        <tr><td style="padding:8px 32px 24px; text-align:center;">
          <a href="${escapeHtml(href)}" style="${BTN}">${label}</a>${note ? `
          <p style="margin:14px 0 0; font-size:12px; color:#8a8a96;">${note}</p>` : ""}
        </td></tr>`;
const smallRow = (inner) => `        <tr><td style="padding:0 32px 24px; color:#c5c5cf; font-size:14px; line-height:1.6;">
${inner}
        </td></tr>`;

// Correo de bienvenida con el enlace de descarga. El enlace de baja se deja como
// {{unsubscribeUrl}} y lo reemplaza handleSubscribe.
function chapterEmailHtml({ name, chapterKey, downloadUrl, lang }) {
  lang = normLang(lang);
  const greeting = COMMON[lang].hello(escapeHtml(name));
  const label = escapeHtml(chapterLabel(chapterKey, lang));
  const t = lang === "en"
    ? {
        intro: `Thanks for subscribing. Here is your download link for
            <strong style="color:#ffffff;">${label}</strong>,
            straight from <em>Synthetic Code: The Art of Orchestrating AI Agents</em>.`,
        btn: "Download the chapter",
        note: "For security, the link expires in 7 days.",
        repo: "Want to see the real code behind the book's patterns running live? The reference repository is public:",
      }
    : {
        intro: `Gracias por suscribirte. Aquí tienes tu enlace de descarga para
            <strong style="color:#ffffff;">${label}</strong>,
            directo de <em>Código Sintético: El arte de orquestar agentes de IA</em>.`,
        btn: "Descargar capítulo",
        note: "El enlace expira en 7 días por seguridad.",
        repo: "Si quieres ver el código real detrás de los patrones del libro funcionando en vivo, el repositorio de referencia es público:",
      };

  const body = [
    textRow(`          <p style="margin:0 0 16px;">${greeting}</p>
          <p style="margin:0 0 16px;">
            ${t.intro}
          </p>`),
    buttonRow(downloadUrl, t.btn, t.note),
    smallRow(`          <p style="margin:0 0 12px;">${t.repo}</p>
          <p style="margin:0;">${REPO}</p>`),
  ].join("\n");

  const title = lang === "en" ? `Synthetic Code — ${label}` : `Código Sintético — ${label}`;
  return layout({ lang, title, body, unsubscribeUrl: "{{unsubscribeUrl}}" });
}

function day3FollowUpHtml({ name, chapterKey, unsubscribeUrl, lang }) {
  lang = normLang(lang);
  const greeting = COMMON[lang].hello(escapeHtml(name));
  const label = escapeHtml(chapterLabel(chapterKey, lang));
  const t = lang === "en"
    ? {
        title: "Synthetic Code — how was it?",
        p1: `A few days ago you received <strong style="color:#ffffff;">${label}</strong>.
            If you've read it, here's what comes next in the book:`,
        p2: `<strong style="color:#e8a33d;">29 chapters</strong> that run from the agentic
            awakening to security in multi-agent systems, real cost optimization, and
            geopolitics as an architectural constraint — with runnable reference code for
            every core pattern.`,
        href: "https://info-codigo-sintetico.specsolid.com/en/#read",
        btn: "Read a sample and see all chapters",
        repo: `And if you want to see the real code behind the patterns running live: ${REPO}`,
      }
    : {
        title: "Código Sintético — ¿qué te pareció?",
        p1: `Hace unos días te llegó <strong style="color:#ffffff;">${label}</strong>.
            Si ya lo leíste, esto es lo que sigue en el libro:`,
        p2: `<strong style="color:#e8a33d;">21 capítulos</strong> que van desde el despertar
            agéntico hasta la seguridad en sistemas multiagente, la optimización real de
            costos y la geopolítica como restricción arquitectónica — con código de
            referencia ejecutable para cada patrón central.`,
        href: "https://codigosintetico.specsolid.com/#capitulos",
        btn: "Ver el índice completo",
        repo: `Y si quieres ver el código real detrás de los patrones funcionando en vivo: ${REPO}`,
      };

  const body = [
    textRow(`          <p style="margin:0 0 16px;">${greeting}</p>
          <p style="margin:0 0 16px;">
            ${t.p1}
          </p>
          <p style="margin:0 0 8px; color:#c5c5cf;">
            ${t.p2}
          </p>`),
    buttonRow(t.href, t.btn),
    smallRow(`          <p style="margin:0;">
            ${t.repo}
          </p>`),
  ].join("\n");

  return layout({ lang, title: t.title, body, unsubscribeUrl: escapeHtml(unsubscribeUrl) });
}

function day7FollowUpHtml({ name, unsubscribeUrl, lang }) {
  lang = normLang(lang);
  const greeting = COMMON[lang].hello(escapeHtml(name));
  const t = lang === "en"
    ? {
        title: "Synthetic Code — before it slips by",
        p1: `"Software engineering doesn't disappear with agents. It evolves."
            — that's the premise of <em>Synthetic Code</em>, and the reason you subscribed.`,
        p2: `As promised, you hear it first: the complete edition is available on Amazon as a
            <a href="https://www.amazon.com/dp/B0HRMZ15PV" style="${A}">Kindle eBook</a>,
            <a href="https://www.amazon.com/dp/B0HRNT2QLQ" style="${A}">paperback</a>, and
            <a href="https://www.amazon.com/dp/B0HRP4TT9D" style="${A}">hardcover</a>,
            updated with the November 2026 models.`,
        p3: `Prefer Spanish? The original edition, <em>Código Sintético</em>, is available too:
            <a href="https://codigosintetico.specsolid.com/#comprar" style="${A}">see the stores</a>.`,
        href: "https://www.amazon.com/dp/B0HRMZ15PV",
        btn: "Get Synthetic Code on Amazon",
        note: "Kindle $9.99 · paperback $24.99 · hardcover $34.99 (USD)",
      }
    : {
        title: "Código Sintético — antes de que se te pase",
        p1: `"La ingeniería de software no desaparece con los agentes. Evoluciona."
            — es la premisa de <em>Código Sintético</em>, y la razón por la que te
            suscribiste.`,
        p2: `Te lo prometimos: lo sabes primero. La edición completa ya está disponible en
            Amazon en <a href="https://www.amazon.com/dp/B0HG96Y1LN" style="${A}">Kindle</a>,
            <a href="https://www.amazon.com/dp/B0HGFD1Y6G" style="${A}">tapa blanda</a> y
            <a href="https://www.amazon.com/dp/B0HGGH9P77" style="${A}">tapa dura</a>.`,
        p3: `¿Lees en inglés? También está la edición en inglés, <em>Synthetic Code</em>,
            actualizada con los modelos de noviembre de 2026:
            <a href="https://www.amazon.com/dp/B0HRMZ15PV" style="${A}">verla en Amazon</a>.`,
        href: "https://codigosintetico.specsolid.com/#comprar",
        btn: "Ver todas las tiendas",
        note: "Amazon, Lulu, Apple Books, Kobo, Gumroad (PDF) y más.",
      };

  const body = [
    textRow(`          <p style="margin:0 0 16px;">${greeting}</p>
          <p style="margin:0 0 16px;">
            ${t.p1}
          </p>
          <p style="margin:0 0 16px; color:#c5c5cf;">
            ${t.p2}
          </p>
          <p style="margin:0 0 16px; color:#c5c5cf;">
            ${t.p3}
          </p>`),
    buttonRow(t.href, t.btn, t.note),
  ].join("\n");

  return layout({ lang, title: t.title, body, unsubscribeUrl: escapeHtml(unsubscribeUrl) });
}

export { chapterEmailHtml, day3FollowUpHtml, day7FollowUpHtml, subjectFor, normLang, CHAPTER_LABELS };
