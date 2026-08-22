/**
 * Plantillas de correo en texto plano JS (los Workers no tienen sistema de
 * archivos en runtime, así que no se pueden leer .html sueltos — se bundean
 * como strings). Los estilos van inline porque muchos clientes de correo
 * (Gmail, Outlook) ignoran <style> en el <head>.
 */

function escapeHtml(str) {
  return String(str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

const CHAPTER_LABELS = {
  cap1: "Capítulo 1 — Introducción a los sistemas multiagente",
  cap2: "Capítulo 2 — Presupuesto y economía de tokens",
  cap3: "Capítulo 3 — Resiliencia y circuit breakers",
};

function chapterEmailHtml({ name, chapterKey, downloadUrl }) {
  const safeName = escapeHtml(name) || "";
  const chapterLabel = CHAPTER_LABELS[chapterKey] || CHAPTER_LABELS.cap1;
  const greeting = safeName ? `Hola ${safeName},` : "Hola,";

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Código Sintético — ${escapeHtml(chapterLabel)}</title>
</head>
<body style="margin:0; padding:0; background-color:#0d0d12; font-family:Arial, Helvetica, sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#0d0d12; padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width:560px; background-color:#15151d; border:1px solid #2a2a35; border-radius:14px; overflow:hidden;">

          <tr>
            <td style="padding:32px 32px 8px; text-align:center;">
              <div style="font-family:Arial, sans-serif; font-size:22px; font-weight:800; letter-spacing:1px; color:#ffffff;">
                C&Oacute;DIGO <span style="color:#e8a33d;">SINT&Eacute;TICO</span>
              </div>
              <div style="height:1px; background-color:#e8a33d; margin:20px auto; width:64px;"></div>
            </td>
          </tr>

          <tr>
            <td style="padding:0 32px 8px; color:#e8e8ec; font-size:16px; line-height:1.6;">
              <p style="margin:0 0 16px;">${greeting}</p>
              <p style="margin:0 0 16px;">
                Gracias por suscribirte. Aquí tienes tu enlace de descarga para
                <strong style="color:#ffffff;">${escapeHtml(chapterLabel)}</strong>,
                directo de <em>Código Sintético: El arte de orquestar agentes de IA</em>.
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:8px 32px 24px; text-align:center;">
              <a href="${escapeHtml(downloadUrl)}"
                 style="display:inline-block; background-color:#e8a33d; color:#15151d; text-decoration:none;
                        font-weight:700; font-size:15px; padding:14px 28px; border-radius:8px;">
                Descargar capítulo
              </a>
              <p style="margin:14px 0 0; font-size:12px; color:#8a8a96;">
                El enlace expira en 7 días por seguridad.
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:0 32px 24px; color:#c5c5cf; font-size:14px; line-height:1.6;">
              <p style="margin:0 0 12px;">
                Si quieres ver el código real detrás de los patrones del libro funcionando en vivo,
                el repositorio de referencia es público:
              </p>
              <p style="margin:0;">
                <a href="https://github.com/sergioide007/synthetic-code" style="color:#e8a33d; text-decoration:none;">
                  github.com/sergioide007/synthetic-code
                </a>
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:20px 32px; border-top:1px solid #2a2a35; text-align:center;">
              <p style="margin:0 0 6px; font-size:13px; color:#8a8a96;">Sergio Perez Ruiz — SpecSolid Press</p>
              <p style="margin:0; font-size:12px; color:#65656f;">
                Recibiste este correo porque te suscribiste en codigosintetico-specsolid.com.
                <a href="{{unsubscribeUrl}}" style="color:#8a8a96;">Darme de baja</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export { chapterEmailHtml, CHAPTER_LABELS };
