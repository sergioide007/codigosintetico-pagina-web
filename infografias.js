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
const INFO_IMG_FULL = (slug) => `assets/infografias/full/${slug}.webp`;

let infoCurrentIndex = 0;
let infoShareCache = {}; // slug -> File cacheado para Web Share con archivo

function infoShareUrl(slug) {
  return `${INFO_BASE_URL()}${slug}.html`;
}

function infoBuildShareMessage(item) {
  return `${item.shareText}\n\n${infoShareUrl(item.slug)}`;
}

function renderInfografiasCards() {
  const scroller = document.getElementById('info-scroller');
  if (!scroller) return;
  scroller.innerHTML = INFOGRAFIAS.map((item, i) => `
    <article class="info-card" id="infografia-${item.slug}" data-index="${i}">
      <button type="button" class="info-card-img-btn" data-open-lightbox="${i}" aria-label="Ver ${item.title} en tamaño completo">
        <img src="${INFO_IMG_THUMB(item.slug)}" alt="Infografía: ${item.title} — Código Sintético, por Sergio Perez Ruiz" loading="lazy" width="520" height="924">
      </button>
      <div class="info-card-body">
        <span class="info-badge">${item.badge}</span>
        <h3 class="info-card-title">${item.title}</h3>
        <p class="info-card-blurb">${item.blurb}</p>
        <div class="info-card-actions">
          <button type="button" class="info-btn" data-open-lightbox="${i}">Ver completa</button>
          <button type="button" class="info-btn share" data-share="${i}">Compartir</button>
        </div>
      </div>
    </article>
  `).join('');
}

function initInfoScrollNav() {
  const scroller = document.getElementById('info-scroller');
  const prev = document.getElementById('info-nav-prev');
  const next = document.getElementById('info-nav-next');
  if (!scroller || !prev || !next) return;
  const step = () => (scroller.querySelector('.info-card')?.offsetWidth || 250) + 20;
  prev.addEventListener('click', () => scroller.scrollBy({ left: -step() * 2, behavior: 'smooth' }));
  next.addEventListener('click', () => scroller.scrollBy({ left: step() * 2, behavior: 'smooth' }));
}

function infoOpenLightbox(index) {
  const item = INFOGRAFIAS[index];
  if (!item) return;
  infoCurrentIndex = index;
  const lb = document.getElementById('info-lightbox');
  const img = document.getElementById('info-lightbox-img');
  const title = document.getElementById('info-lightbox-title');
  const blurb = document.getElementById('info-lightbox-blurb');
  img.src = INFO_IMG_FULL(item.slug);
  img.alt = `Infografía completa: ${item.title} — Código Sintético`;
  title.textContent = item.title;
  blurb.textContent = item.blurb;
  lb.dataset.index = String(index);
  lb.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function infoCloseLightbox() {
  document.getElementById('info-lightbox')?.classList.remove('open');
  document.body.style.overflow = '';
}

function infoLightboxStep(delta) {
  const total = INFOGRAFIAS.length;
  const next = (infoCurrentIndex + delta + total) % total;
  infoOpenLightbox(next);
}

async function infoCheckFileShareSupport(item) {
  try {
    const res = await fetch(INFO_IMG_FULL(item.slug));
    const blob = await res.blob();
    const file = new File([blob], `${item.slug}.webp`, { type: blob.type || 'image/webp' });
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      return file;
    }
  } catch (err) { /* sin conexión a la imagen o navegador sin soporte */ }
  return null;
}

function infoOpenShareMenu(item) {
  const menu = document.getElementById('info-share-menu');
  const panel = document.getElementById('info-share-panel');
  const message = infoBuildShareMessage(item);
  const url = infoShareUrl(item.slug);
  const encMsg = encodeURIComponent(message);
  const encUrl = encodeURIComponent(url);
  panel.innerHTML = `
    <h4>Compartir "${item.title}"</h4>
    <a class="info-share-opt" target="_blank" rel="noopener" href="https://wa.me/?text=${encMsg}">WhatsApp</a>
    <a class="info-share-opt" target="_blank" rel="noopener" href="https://twitter.com/intent/tweet?text=${encodeURIComponent(item.shareText)}&url=${encUrl}">X / Twitter</a>
    <a class="info-share-opt" target="_blank" rel="noopener" href="https://www.linkedin.com/sharing/share-offsite/?url=${encUrl}">LinkedIn</a>
    <a class="info-share-opt" target="_blank" rel="noopener" href="https://t.me/share/url?url=${encUrl}&text=${encodeURIComponent(item.shareText)}">Telegram</a>
    <button type="button" class="info-share-opt" id="info-share-copy">Copiar texto y enlace</button>
    <a class="info-share-opt" href="${INFO_IMG_FULL(item.slug)}" download="codigo-sintetico-${item.slug}.webp">Descargar imagen</a>
    <button type="button" class="info-share-cancel" id="info-share-cancel">Cancelar</button>
  `;
  menu.classList.add('open');

  document.getElementById('info-share-copy').addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(message);
      document.getElementById('info-share-copy').textContent = '¡Copiado!';
    } catch (err) { /* portapapeles no disponible */ }
  });
  document.getElementById('info-share-cancel').addEventListener('click', infoCloseShareMenu);
}

function infoCloseShareMenu() {
  document.getElementById('info-share-menu')?.classList.remove('open');
}

async function infoShare(index) {
  const item = INFOGRAFIAS[index];
  if (!item) return;

  // 1) Intentamos Web Share API nativa con el archivo de imagen adjunto —
  //    es la mejor experiencia (WhatsApp, Instagram Stories, X, etc. en móvil).
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
      // Usuario canceló el share sheet — no hace falta fallback.
      if (err && err.name === 'AbortError') return;
    }
  }

  // 2) Fallback: menú propio con WhatsApp / X / LinkedIn / Telegram / copiar / descargar.
  infoOpenShareMenu(item);
}

function initInfografias() {
  if (!document.getElementById('info-scroller')) return;
  renderInfografiasCards();
  initInfoScrollNav();

  document.getElementById('infografias-grid')?.addEventListener('click', (e) => {
    const openBtn = e.target.closest('[data-open-lightbox]');
    if (openBtn) { infoOpenLightbox(Number(openBtn.dataset.openLightbox)); return; }
    const shareBtn = e.target.closest('[data-share]');
    if (shareBtn) { infoShare(Number(shareBtn.dataset.share)); return; }
  });

  document.getElementById('info-lightbox-close')?.addEventListener('click', infoCloseLightbox);
  document.getElementById('info-lightbox')?.addEventListener('click', (e) => {
    if (e.target.id === 'info-lightbox') infoCloseLightbox();
  });
  document.getElementById('info-lightbox-prev')?.addEventListener('click', () => infoLightboxStep(-1));
  document.getElementById('info-lightbox-next')?.addEventListener('click', () => infoLightboxStep(1));
  document.getElementById('info-lightbox-share')?.addEventListener('click', () => infoShare(infoCurrentIndex));

  document.getElementById('info-share-menu')?.addEventListener('click', (e) => {
    if (e.target.id === 'info-share-menu') infoCloseShareMenu();
  });

  document.addEventListener('keydown', (e) => {
    const lb = document.getElementById('info-lightbox');
    if (!lb || !lb.classList.contains('open')) return;
    if (e.key === 'Escape') infoCloseLightbox();
    if (e.key === 'ArrowRight') infoLightboxStep(1);
    if (e.key === 'ArrowLeft') infoLightboxStep(-1);
  });

  // Deep-link: si alguien llega desde un enlace compartido (#infografia-slug),
  // desplazamos hasta la galería y abrimos directamente esa infografía.
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
