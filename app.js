const WORKER_URL = "https://specsolid-newsletter.sergioide007.workers.dev";

function toggleMenu() {
  document.getElementById('mobileMenu').classList.toggle('open');
}

function initMobileMenu() {
  const menu = document.getElementById('mobileMenu');
  if (!menu) return;
  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => menu.classList.remove('open'));
  });
}

function initScrollReveal() {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -32px 0px' });
  items.forEach(el => observer.observe(el));
}

function initSubscribeForm() {
  const form = document.getElementById('subscribe-form');
  if (!form) return;

  const statusEl = document.getElementById('subscribe-status');
  const submitBtn = document.getElementById('subscribe-submit');
  const langSel = document.getElementById('sub-lang');
  const chapterSel = document.getElementById('sub-chapter');

  // Textos del formulario por idioma. "en" = edición en inglés (Synthetic Code): el capítulo
  // y toda la secuencia de correos llegan en inglés.
  const UI = {
    es: {
      chapters: ['Capítulo 1 — El despertar agéntico', 'Capítulo 2 — El AI Engineer', 'Capítulo 3 — Platform Engineering en la era agéntica'],
      name: 'Tu nombre', email: 'Tu correo', submit: 'Enviarme el capítulo',
      noEmail: 'Escribe tu correo, por favor.', noCaptcha: 'Completa la verificación anti-spam.',
      sending: 'Enviando…', ok: '¡Listo! Revisa tu correo en un par de minutos.',
      already: 'Ya estabas suscrito — revisa tu correo, ahí tienes el capítulo.',
      fail: 'No se pudo enviar. Intenta de nuevo en unos minutos.',
    },
    en: {
      chapters: ['Chapter 1 — The Agentic Awakening', 'Chapter 2 — The AI Engineer', 'Chapter 3 — Platform Engineering in the Agentic Era'],
      name: 'Your name', email: 'Your email', submit: 'Send me the chapter',
      noEmail: 'Please enter your email.', noCaptcha: 'Please complete the anti-spam check.',
      sending: 'Sending…', ok: "Done! Check your inbox in a couple of minutes.",
      already: "You're already subscribed — check your inbox, the chapter is there.",
      fail: 'Could not send. Please try again in a few minutes.',
    },
  };

  // Idioma inicial: ?lang=en en la URL (enlaces desde la página en inglés) o, si no, el idioma
  // del navegador (inglés si es "en-*", español en cualquier otro caso).
  const urlLang = new URLSearchParams(location.search).get('lang');
  const browserLang = ((navigator.languages && navigator.languages[0]) || navigator.language || '').toLowerCase();
  const initialLang = urlLang === 'en' || urlLang === 'es' ? urlLang : (browserLang.startsWith('en') ? 'en' : 'es');
  const t = () => UI[langSel && langSel.value === 'en' ? 'en' : 'es'];

  function applyLang(lang) {
    if (!langSel) return;
    langSel.value = lang;
    const tx = t();
    [...chapterSel.options].forEach((o, i) => { o.textContent = tx.chapters[i]; });
    chapterSel.lang = lang;
    document.getElementById('sub-name').placeholder = tx.name;
    document.getElementById('sub-email').placeholder = tx.email;
    submitBtn.textContent = tx.submit;
    submitBtn.lang = lang;
  }
  if (langSel) {
    applyLang(initialLang);
    langSel.addEventListener('change', () => applyLang(langSel.value));
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const lang = langSel && langSel.value === 'en' ? 'en' : 'es';
    const tx = t();

    const name = document.getElementById('sub-name').value.trim();
    const email = document.getElementById('sub-email').value.trim();
    const chapter = document.getElementById('sub-chapter').value;
    const website = document.getElementById('sub-website').value; // honeypot

    const turnstileToken = form.querySelector('[name="cf-turnstile-response"]')?.value;

    if (!email) {
      statusEl.textContent = tx.noEmail;
      statusEl.className = 'subscribe-status is-error';
      return;
    }

    if (!turnstileToken) {
      statusEl.textContent = tx.noCaptcha;
      statusEl.className = 'subscribe-status is-error';
      return;
    }

    submitBtn.disabled = true;
    statusEl.textContent = tx.sending;
    statusEl.className = 'subscribe-status';

    try {
      const res = await fetch(`${WORKER_URL}/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, chapter, lang, turnstileToken, website }),
      });
      const data = await res.json();

      if (!res.ok || !data.ok) {
        throw new Error(data.error || tx.fail);
      }

      statusEl.textContent = data.alreadySubscribed ? tx.already : tx.ok;
      statusEl.className = 'subscribe-status is-success';
      form.reset();
      applyLang(lang); // reset() devolvería el selector a español
      if (window.turnstile) window.turnstile.reset();
    } catch (err) {
      statusEl.textContent = err.message || tx.fail;
      statusEl.className = 'subscribe-status is-error';
    } finally {
      submitBtn.disabled = false;
    }
  });
}

function initVideoPlayOverlay() {
  const video = document.getElementById('promo-video');
  const overlay = document.getElementById('video-play-overlay');
  const wrap = video && video.closest('.video-wrap');
  if (!video || !overlay || !wrap) return;

  function markPlaying() {
    wrap.classList.add('playing');
  }
  function markPaused() {
    wrap.classList.remove('playing');
  }

  // Click on overlay or video-wrap starts play
  wrap.addEventListener('click', (e) => {
    if (video.paused) {
      video.play().catch(() => {});
    }
  });

  video.addEventListener('play', markPlaying);
  video.addEventListener('playing', markPlaying);
  video.addEventListener('pause', markPaused);
  video.addEventListener('ended', markPaused);

  // Prevent double-click on video controls from toggling overlay
  video.addEventListener('click', (e) => e.stopPropagation());
}

function initVideoShare() {
  const shareBtn = document.getElementById('btn-share-video');
  const downloadBtn = document.getElementById('btn-download-video');
  if (!shareBtn || !downloadBtn) return;

  const videoUrl = 'codigo-sintetico-trailer.mp4';
  const shareTitle = 'Código Sintético — El arte de orquestar agentes de IA';
  const shareText = 'Un libro sobre cómo diseñar y gobernar sistemas multiagente de IA en producción. Mira esto 👇';

  // El navegador solo puede "compartir" un archivo de verdad (a apps como
  // TikTok, Instagram, WhatsApp, Telegram) si soporta la Web Share API con
  // archivos — hoy eso es Chrome/Android y Safari/iOS en su mayoría, no
  // todos los navegadores de escritorio. Por eso se detecta antes de
  // mostrar el botón; si no hay soporte, solo se ofrece la descarga.
  async function checkShareSupport() {
    if (!navigator.canShare) return false;
    try {
      const res = await fetch(videoUrl);
      const blob = await res.blob();
      const file = new File([blob], 'codigo-sintetico-trailer.mp4', { type: 'video/mp4' });
      return navigator.canShare({ files: [file] }) ? file : false;
    } catch {
      return false;
    }
  }

  let cachedFile = null;

  shareBtn.addEventListener('click', async () => {
    shareBtn.disabled = true;
    const originalText = shareBtn.textContent;
    shareBtn.textContent = 'Preparando…';
    try {
      if (!cachedFile) {
        const res = await fetch(videoUrl);
        const blob = await res.blob();
        cachedFile = new File([blob], 'codigo-sintetico-trailer.mp4', { type: 'video/mp4' });
      }
      await navigator.share({ files: [cachedFile], title: shareTitle, text: shareText });
    } catch (err) {
      // El usuario canceló el share sheet, o el navegador lo rechazó — no
      // es un error real, no hace falta mostrar nada.
    } finally {
      shareBtn.disabled = false;
      shareBtn.textContent = originalText;
    }
  });

  // Solo se muestra el botón "Compartir" si el navegador realmente puede
  // hacerlo con un archivo — si no, el botón de descarga es suficiente.
  checkShareSupport().then((supported) => {
    if (supported) {
      cachedFile = supported;
      shareBtn.style.display = '';
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initScrollReveal();
  initSubscribeForm();
  initVideoPlayOverlay();
  initVideoShare();
  initInfografias();
});
