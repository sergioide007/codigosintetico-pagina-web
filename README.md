# Código Sintético — sitio y suscripción de capítulos

Sitio de **Código Sintético: El arte de orquestar agentes de IA** (SpecSolid
Press), alojado en `codigosintetico.specsolid.com`. El repo contiene el
sitio estático y el backend (Cloudflare Worker) que gestiona la suscripción
por correo y la entrega de capítulos en PDF.

## Arquitectura

![Arquitectura del sistema](architecture.jpeg)

El PDF **nunca** se sirve desde una URL pública fija. El bucket R2 se queda
privado; el único lector es el propio Worker, a través de un *binding*
directo (`env.CHAPTERS_BUCKET`). El enlace que recibe el suscriptor apunta
al Worker, no al bucket, y deja de funcionar a los 7 días.

## Componentes

| Archivo | Rol |
|---|---|
| `index.html` / `style.css` / `app.js` | Sitio estático: hero, capítulos, formulario de suscripción. |
| `worker/src/index.js` | Todas las rutas del Worker: `/subscribe`, `/download`, `/unsubscribe`. |
| `worker/src/templates.js` | HTML del correo que recibe cada suscriptor. |
| `worker/schema.sql` | Esquema de la tabla `subscribers` en D1. |
| `wrangler.toml` | Configuración del Worker: variables, binding a D1, binding a R2. |
| `CNAME` | Dominio custom para GitHub Pages (`codigosintetico.specsolid.com`). |

## Rutas del Worker

| Ruta | Método | Qué hace |
|---|---|---|
| `/subscribe` | `POST` | Verifica Turnstile, guarda/actualiza el suscriptor en D1, genera el enlace de descarga firmado y envía el correo por Brevo. |
| `/download` | `GET` | Valida la firma HMAC y la expiración (7 días) del enlace, y si son correctas transmite el PDF desde R2. |
| `/unsubscribe` | `GET` | Valida la firma HMAC del enlace de baja y marca al suscriptor como `unsubscribed`. |

## Variables y bindings (`wrangler.toml`)

| Nombre | Tipo | Para qué |
|---|---|---|
| `ALLOWED_ORIGIN` | var | Dominio(s) permitido(s) para CORS al llamar `/subscribe` desde el navegador. |
| `SENDER_NAME` / `SENDER_EMAIL` | var | Remitente que ve el suscriptor en el correo. |
| `DB` | binding D1 | Tabla `subscribers` (email, nombre, capítulo elegido, estado). |
| `CHAPTERS_BUCKET` | binding R2 | Bucket privado con los PDFs de los capítulos. |
| `BREVO_API_KEY` | secret | Autenticación con la API de Brevo para enviar los correos. |
| `TURNSTILE_SECRET_KEY` | secret | Verifica en servidor el token de Turnstile que manda el formulario. |
| `UNSUB_SECRET` | secret | Firma los enlaces de baja (`/unsubscribe`). |
| `DOWNLOAD_SECRET` | secret | Firma los enlaces de descarga (`/download`) — distinto de `UNSUB_SECRET`. |

Los cuatro *secrets* nunca van en `wrangler.toml` ni en git — se configuran
con `wrangler secret put <NOMBRE>`, que los guarda cifrados del lado de
Cloudflare.

## Seguridad

- **Turnstile** (captcha invisible de Cloudflare) descarta bots antes de
  tocar la base de datos.
- **Honeypot**: un campo oculto (`website`) que ningún humano llena; si
  llega con contenido, la petición se descarta en silencio.
- **Enlaces firmados con HMAC-SHA256** tanto para descarga como para baja,
  con expiración embebida en el caso de descarga (7 días) — nadie puede
  fabricar o alterar un enlace sin conocer el secreto del servidor.
- **Bucket R2 100% privado**: el binding le da al Worker acceso directo sin
  necesidad de exponer el bucket como público.

## Desarrollo local

```bash
npm install
cp .dev.vars.example .dev.vars   # y complétalo con tus claves de prueba
npm run db:schema:local
npm run dev
```

## Despliegue

```bash
npm run deploy                   # publica el Worker
npm run db:schema:remote         # aplica el esquema a la D1 de producción
```

El sitio estático (`index.html`, `style.css`, `app.js`, `CNAME`) se publica
por separado (GitHub Pages u otro hosting estático) — el Worker y el sitio
son dos despliegues independientes.

## Roadmap

- **Iteración 2** — secuencia de seguimiento por correo (día 3, día 7) vía
  Cron Trigger del Worker.
- **Iteración 3** — panel de solo lectura para ver altas/bajas de
  suscriptores, sin exponer un admin completo.
