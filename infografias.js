const INFOGRAFIAS = [
  { slug: `chatbot-vs-agente`, badge: `Concepto clave`, title: `Chatbot vs. Agente de IA`, blurb: `La diferencia que decide si tu sistema solo responde, o si realmente actúa.`, shareText: `Tu chatbot responde. Un agente de IA percibe, razona, actúa y aprende. Esta infografía de Código Sintético explica la diferencia en 20 segundos.` },
  { slug: `resumen-arquitectura-gobernanza`, badge: `Guía visual completa`, title: `Arquitectura y Gobernanza Agéntica`, blurb: `El mapa completo del libro en un solo póster: de la arquitectura a la gobernanza.`, shareText: `21 capítulos, un solo mapa: así se ve la arquitectura completa de un sistema multiagente en producción. De Código Sintético, de Sergio Perez Ruiz.` },
  { slug: `ai-gateway-riesgo`, badge: `Arquitectura`, title: `AI Gateways y Enrutamiento de Riesgo`, blurb: `No todas las tareas de un agente merecen el modelo más caro. Así se decide en milisegundos.`, shareText: `El Risk & Cost Router: cómo un AI Gateway decide, en milisegundos, si una tarea va por el carril exprés, el worker asíncrono o el carril con humano en el bucle. De Código Sintético.` },
  { slug: `arnes-guardrails`, badge: `Arquitectura`, title: `Arnés Defensivo y Guardrails`, blurb: `Circuit breakers, presupuesto de tokens y salidas estructuradas: la defensa en profundidad de un agente en producción.`, shareText: `Cortocircuitos, presupuesto de tokens y salidas estructuradas — el arnés defensivo que evita que un agente de IA se vuelva impredecible (y caro) en producción. De Código Sintético.` },
  { slug: `solid-agentes`, badge: `Capítulo 8`, title: `SOLID para Agentes`, blurb: `SOLID tiene 20 años. Sigue siendo la mejor defensa contra un enjambre de agentes inmantenible.`, shareText: `SOLID aplicado a agentes de IA: un rol por agente, extensión sin romper el arnés, modelos intercambiables, herramientas atómicas, orquestación sobre abstracciones. Capítulo 8 de Código Sintético.` },
  { slug: `kafka-eventos`, badge: `Capítulo 10`, title: `Kafka y Eventos Agénticos`, blurb: `Si tus agentes se llaman por HTTP síncrono, no tienes un sistema multiagente — tienes fallos esperando ocurrir.`, shareText: `DDD + Kafka como sistema nervioso de un enjambre de agentes: trazabilidad, orquestación vs. coreografía y sincronización a gran escala. Capítulo 10 de Código Sintético.` },
  { slug: `spec-driven-7-pasos`, badge: `Metodología`, title: `El Flujo de Trabajo de 7 Pasos`, blurb: `La alternativa real al vibe-coding: especificación rigurosa en cada paso, del problema al despliegue.`, shareText: `Spec-Driven Development en 7 pasos: de la definición del problema al despliegue con observabilidad total. La alternativa al vibe-coding, explicada en Código Sintético.` },
  { slug: `orquestacion-multiagente`, badge: `Arquitectura`, title: `Patrones de Orquestación Multiagente`, blurb: `Jerárquica, peer-to-peer o swarm: elegir mal la topología es el error más caro de revertir.`, shareText: `3 topologías multiagente — jerárquica, peer-to-peer y swarm — con la matriz de selección por control, escalabilidad, resiliencia y costo. De Código Sintético.` },
  { slug: `memoria-agentica`, badge: `Arquitectura`, title: `Arquitectura de Memoria Agéntica`, blurb: `Memoria de trabajo, corto plazo y largo plazo: así se le construye memoria real a un agente.`, shareText: `Las 3 capas de memoria que todo agente de IA necesita para dejar de 'olvidar' apenas se cierra la ventana de contexto. De Código Sintético.` },
  { slug: `resiliencia-fallbacks`, badge: `Operación`, title: `Resiliencia Operativa y Fallbacks`, blurb: `Un agente en bucle infinito no es un bug gracioso — es una factura de miles de dólares.`, shareText: `Circuit breakers de 3 estados, retry con backoff exponencial y degradación grácil: cómo evitar que un agente en bucle te queme el presupuesto. De Código Sintético.` },
  { slug: `evaluacion-probabilistica-tdd`, badge: `Calidad`, title: `Evaluación Probabilística y TDD`, blurb: `El testing tradicional asume que 2+2 siempre da 4. Un agente de IA necesita su propio TDD.`, shareText: `No puedes aplicar unit testing clásico a un sistema no determinista. Así se construye un arnés de evaluación probabilística con LLM-as-a-Judge. De Código Sintético.` },
  { slug: `observabilidad-evals-e2e`, badge: `Operación`, title: `Observabilidad y Evals E2E`, blurb: `Si no puedes medir por qué tu agente decidió algo, no tienes producción — tienes una caja negra.`, shareText: `Trazabilidad de tokens, telemetría del arnés, evaluación probabilística y tracing E2E: las 4 capas de observabilidad que todo sistema agéntico necesita. De Código Sintético.` },
  { slug: `finops-optimizacion-costos`, badge: `Capítulo 18`, title: `FinOps en IA: Optimización de Costos`, blurb: `El 'silent token burn' es el enemigo silencioso. Reducir el TCO en 45% es posible sin tocar la calidad.`, shareText: `Caché semántico, enrutamiento inteligente de modelos y presupuesto de tokens: las estrategias que reducen el TCO de un sistema agéntico en más de 45%. Capítulo 18 de Código Sintético.` },
  { slug: `seguridad-gobernanza`, badge: `Capítulos 11 y 17`, title: `Seguridad y Gobernanza`, blurb: `La inyección de prompts no es ciencia ficción: es el vector de ataque #1 en sistemas agénticos hoy.`, shareText: `Control de deuda técnica, protocolo MCP y barreras de CI/CD automáticas para gobernar agentes de IA en producción. Capítulos 11 y 17 de Código Sintético.` },
  { slug: `mcp-integracion-tools`, badge: `Arquitectura`, title: `Protocolo MCP e Integración de Tools`, blurb: `Conectar un LLM directo a tu base de datos de producción es la forma más rápida de tener un mal día.`, shareText: `Cómo el Model Context Protocol estandariza el acceso de un agente a herramientas externas — sin exponer credenciales ni abrir superficie de ataque. De Código Sintético.` },
  { slug: `mapa-carrera-ai-engineer`, badge: `Carrera`, title: `El Mapa de Carrera: AI Engineer`, blurb: `El 'Prompt Engineer' de 2023 no es el mismo rol en 2026. Las 7 competencias clave, en un mapa.`, shareText: `De Prompt Engineer a Synthetic System Lead: el mapa de carrera completo del AI Engineer, con las 7 competencias que de verdad importan. De Código Sintético.` },
  { slug: `super-razonamiento-enjambres`, badge: `Visión avanzada`, title: `Súper-Razonamiento y Enjambres`, blurb: `El siguiente salto no es un modelo más grande. Es un enjambre que se corrige a sí mismo.`, shareText: `La jerarquía cognitiva completa de un enjambre agéntico avanzado: de agentes especializados a súper-razonamiento y emergencia operativa. De Código Sintético.` }
];

const INFO_BASE_URL = () => `${location.origin}/i/`;
const INFO_IMG_THUMB = (slug) => `assets/infografias/thumb/${slug}.webp`;
const INFO_IMG_FULL  = (slug) => `assets/infografias/full/${slug}.webp`;

let infoCurrentIndex  = 0;
let infoShareCache    = {};
let infoActiveFilter  = 'all';
let infoVisibleItems  = [...INFOGRAFIAS.keys()]; // índices visibles tras el filtro

/* ── Íconos SVG inline ── */
const SVG_SHARE = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>`;
const SVG_EYE   = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`;
const SVG_ZOOM  = `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>`;

function infoShareUrl(slug) {
  return `${INFO_BASE_URL()}${slug}.html`;
}

function infoBuildShareMessage(item) {
  return `${item.shareText}\n\n${infoShareUrl(item.slug)}`;
}

/* ── Render grid con animación ── */
function renderInfografiasCards() {
  const grid = document.getElementById('info-scroller');
  if (!grid) return;

  grid.innerHTML = INFOGRAFIAS.map((item, i) => `
    <article class="info-card" id="infografia-${item.slug}" data-index="${i}" data-badge="${item.badge}">
      <button type="button" class="info-card-img-btn" data-open-lightbox="${i}" aria-label="Ver ${item.title} en tamaño completo">
        <img src="${INFO_IMG_THUMB(item.slug)}" alt="Infografía: ${item.title} — Código Sintético" loading="lazy" width="520" height="924">
        <div class="info-card-img-overlay" aria-hidden="true">
          <span class="info-card-zoom-hint">${SVG_ZOOM} Ver completa</span>
        </div>
      </button>
      <div class="info-card-body">
        <span class="info-badge">${item.badge}</span>
        <h3 class="info-card-title">${item.title}</h3>
        <p class="info-card-blurb">${item.blurb}</p>
        <div class="info-card-actions">
          <button type="button" class="info-btn" data-open-lightbox="${i}">${SVG_EYE} Ver</button>
          <button type="button" class="info-btn share" data-share="${i}">${SVG_SHARE}</button>
        </div>
      </div>
    </article>
  `).join('');

  // Animación de entrada con IntersectionObserver escalonado
  const cards = grid.querySelectorAll('.info-card');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const card  = entry.target;
        const delay = (Number(card.dataset.index) % 6) * 60;
        setTimeout(() => card.classList.add('visible'), delay);
        obs.unobserve(card);
      }
    });
  }, { threshold: 0.08 });
  cards.forEach((c) => obs.observe(c));
}

/* ── Filtros de categoría ── */
function applyInfoFilter(filter) {
  infoActiveFilter = filter;
  const cards = document.querySelectorAll('.info-card');
  let visible = 0;

  cards.forEach((card) => {
    const badge = card.dataset.badge || '';
    const show  = filter === 'all' || badge === filter ||
                  badge.toLowerCase().includes(filter.toLowerCase());
    card.classList.toggle('hidden', !show);
    if (show) visible++;
  });

  // Reconstruir lista de índices visibles para la navegación del lightbox
  infoVisibleItems = INFOGRAFIAS
    .map((item, i) => ({ item, i }))
    .filter(({ item }) =>
      filter === 'all' || item.badge === filter ||
      item.badge.toLowerCase().includes(filter.toLowerCase())
    )
    .map(({ i }) => i);

  const countEl = document.getElementById('info-count');
  if (countEl) {
    countEl.innerHTML = filter === 'all'
      ? `<strong>${INFOGRAFIAS.length}</strong> infografías`
      : `<strong>${visible}</strong> de ${INFOGRAFIAS.length} infografías`;
  }
}

function initInfoFilters() {
  const container = document.getElementById('info-filters');
  if (!container) return;
  applyInfoFilter('all'); // inicializar contador

  container.addEventListener('click', (e) => {
    const btn = e.target.closest('.info-filter-btn');
    if (!btn) return;
    container.querySelectorAll('.info-filter-btn').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    applyInfoFilter(btn.dataset.filter);
  });
}

/* ── Lightbox ── */
function infoUpdateDots(activeIndex) {
  const container = document.getElementById('info-lightbox-dots');
  if (!container) return;
  const pool  = infoVisibleItems.length ? infoVisibleItems : INFOGRAFIAS.map((_, i) => i);
  const total = pool.length;
  if (total <= 1) { container.innerHTML = ''; return; }
  const max    = Math.min(total, 12);
  const posInV = pool.indexOf(activeIndex);
  container.innerHTML = Array.from({ length: max }, (_, k) => {
    const isActive = k === posInV;
    return `<span class="info-lightbox-dot${isActive ? ' active' : ''}"></span>`;
  }).join('');
}

function infoOpenLightbox(index) {
  const item = INFOGRAFIAS[index];
  if (!item) return;
  infoCurrentIndex = index;

  const lb     = document.getElementById('info-lightbox');
  const img    = document.getElementById('info-lightbox-img');
  const badge  = document.getElementById('info-lightbox-badge');
  const title  = document.getElementById('info-lightbox-title');
  const blurb  = document.getElementById('info-lightbox-blurb');
  const dlLink = document.getElementById('info-lightbox-download');

  img.src = INFO_IMG_FULL(item.slug);
  img.alt = `Infografía completa: ${item.title} — Código Sintético`;
  if (badge)  badge.textContent = item.badge;
  title.textContent = item.title;
  blurb.textContent = item.blurb;
  if (dlLink) {
    dlLink.href     = INFO_IMG_FULL(item.slug);
    dlLink.download = `codigo-sintetico-${item.slug}.webp`;
  }

  lb.dataset.index = String(index);
  lb.classList.add('open');
  document.body.style.overflow = 'hidden';
  infoUpdateDots(index);
  setTimeout(() => document.getElementById('info-lightbox-close')?.focus(), 50);
}

function infoCloseLightbox() {
  document.getElementById('info-lightbox')?.classList.remove('open');
  document.body.style.overflow = '';
}

function infoLightboxStep(delta) {
  const pool = infoVisibleItems.length ? infoVisibleItems : INFOGRAFIAS.map((_, i) => i);
  const pos  = pool.indexOf(infoCurrentIndex);
  const next = pool[(pos + delta + pool.length) % pool.length];
  infoOpenLightbox(next);
}

/* ── Swipe táctil en el lightbox ── */
function initLightboxSwipe() {
  const inner = document.querySelector('.info-lightbox-inner');
  if (!inner) return;
  let startX = 0;
  inner.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; }, { passive: true });
  inner.addEventListener('touchend',   (e) => {
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 50) infoLightboxStep(dx < 0 ? 1 : -1);
  }, { passive: true });
}

/* ── Share: Web Share API + fallback bottom-sheet ── */
const SHARE_ICONS = {
  whatsapp: `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.52 3.449C18.24 1.245 15.24 0 12.045 0 5.463 0 .104 5.334.101 11.893c0 2.096.549 4.14 1.595 5.945L0 24l6.335-1.652c1.746.943 3.71 1.444 5.71 1.444h.006c6.585 0 11.946-5.336 11.949-11.896 0-3.176-1.24-6.165-3.48-8.447zm-8.475 18.3h-.005c-1.774 0-3.513-.477-5.03-1.378l-.361-.214-3.741.976.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884zm5.407-7.4c-.297-.149-1.758-.867-2.03-.967-.272-.099-.47-.149-.669.149-.198.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.148-.174.198-.298.297-.497.1-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/></svg>`,
  twitter:  `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`,
  linkedin: `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>`,
  telegram: `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>`,
  copy:     `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`,
  download: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`,
};

async function infoCheckFileShareSupport(item) {
  try {
    const res  = await fetch(INFO_IMG_FULL(item.slug));
    const blob = await res.blob();
    const file = new File([blob], `${item.slug}.webp`, { type: blob.type || 'image/webp' });
    if (navigator.canShare && navigator.canShare({ files: [file] })) return file;
  } catch { /* sin conexión o navegador sin soporte */ }
  return null;
}

function infoOpenShareMenu(item) {
  const menu    = document.getElementById('info-share-menu');
  const panel   = document.getElementById('info-share-panel');
  const message = infoBuildShareMessage(item);
  const url     = infoShareUrl(item.slug);
  const encMsg  = encodeURIComponent(message);
  const encUrl  = encodeURIComponent(url);

  panel.innerHTML = `
    <div class="info-share-handle"></div>
    <h4>Compartir «${item.title}»</h4>
    <div class="info-share-grid">
      <a class="info-share-opt" target="_blank" rel="noopener" href="https://wa.me/?text=${encMsg}">
        ${SHARE_ICONS.whatsapp} WhatsApp
      </a>
      <a class="info-share-opt" target="_blank" rel="noopener" href="https://twitter.com/intent/tweet?text=${encodeURIComponent(item.shareText)}&url=${encUrl}">
        ${SHARE_ICONS.twitter} X / Twitter
      </a>
      <a class="info-share-opt" target="_blank" rel="noopener" href="https://www.linkedin.com/sharing/share-offsite/?url=${encUrl}">
        ${SHARE_ICONS.linkedin} LinkedIn
      </a>
      <a class="info-share-opt" target="_blank" rel="noopener" href="https://t.me/share/url?url=${encUrl}&text=${encodeURIComponent(item.shareText)}">
        ${SHARE_ICONS.telegram} Telegram
      </a>
      <button type="button" class="info-share-opt info-share-opt-full" id="info-share-copy">
        ${SHARE_ICONS.copy} Copiar texto y enlace
      </button>
      <a class="info-share-opt info-share-opt-full" href="${INFO_IMG_FULL(item.slug)}" download="codigo-sintetico-${item.slug}.webp">
        ${SHARE_ICONS.download} Descargar imagen (.webp)
      </a>
    </div>
    <button type="button" class="info-share-cancel" id="info-share-cancel">Cancelar</button>
  `;
  menu.classList.add('open');

  document.getElementById('info-share-copy').addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(message);
      document.getElementById('info-share-copy').innerHTML = `${SHARE_ICONS.copy} ¡Copiado!`;
    } catch { /* portapapeles no disponible */ }
  });
  document.getElementById('info-share-cancel').addEventListener('click', infoCloseShareMenu);
}

function infoCloseShareMenu() {
  document.getElementById('info-share-menu')?.classList.remove('open');
}

async function infoShare(index) {
  const item = INFOGRAFIAS[index];
  if (!item) return;

  if (navigator.share) {
    try {
      let file = infoShareCache[item.slug];
      if (!file) {
        file = await infoCheckFileShareSupport(item);
        if (file) infoShareCache[item.slug] = file;
      }
      const payload = file
        ? { files: [file], title: item.title, text: infoBuildShareMessage(item) }
        : { title: item.title, text: item.shareText, url: infoShareUrl(item.slug) };
      await navigator.share(payload);
      return;
    } catch (err) {
      if (err?.name === 'AbortError') return;
    }
  }
  infoOpenShareMenu(item);
}

/* ── initInfografias ── */
function initInfografias() {
  if (!document.getElementById('info-scroller')) return;

  renderInfografiasCards();
  initInfoFilters();
  initLightboxSwipe();

  // Eventos del grid (delegación)
  document.getElementById('info-scroller')?.addEventListener('click', (e) => {
    const openBtn  = e.target.closest('[data-open-lightbox]');
    if (openBtn)  { infoOpenLightbox(Number(openBtn.dataset.openLightbox)); return; }
    const shareBtn = e.target.closest('[data-share]');
    if (shareBtn) { infoShare(Number(shareBtn.dataset.share)); return; }
  });

  // Lightbox controles
  document.getElementById('info-lightbox-close')?.addEventListener('click', infoCloseLightbox);
  document.getElementById('info-lightbox')?.addEventListener('click', (e) => {
    if (e.target.id === 'info-lightbox') infoCloseLightbox();
  });
  document.getElementById('info-lightbox-prev')?.addEventListener('click', () => infoLightboxStep(-1));
  document.getElementById('info-lightbox-next')?.addEventListener('click', () => infoLightboxStep(1));
  document.getElementById('info-lightbox-share')?.addEventListener('click', () => infoShare(infoCurrentIndex));

  // Share menu
  document.getElementById('info-share-menu')?.addEventListener('click', (e) => {
    if (e.target.id === 'info-share-menu') infoCloseShareMenu();
  });

  // Teclado
  document.addEventListener('keydown', (e) => {
    const lb = document.getElementById('info-lightbox');
    if (!lb?.classList.contains('open')) return;
    if (e.key === 'Escape')     infoCloseLightbox();
    if (e.key === 'ArrowRight') infoLightboxStep(1);
    if (e.key === 'ArrowLeft')  infoLightboxStep(-1);
  });

  // Deep-link: #infografia-slug
  const hash = location.hash.replace('#infografia-', '');
  if (hash) {
    const index = INFOGRAFIAS.findIndex((it) => it.slug === hash);
    if (index >= 0) {
      setTimeout(() => {
        document.getElementById('infografias')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setTimeout(() => infoOpenLightbox(index), 450);
      }, 250);
    }
  }
}
