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

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('sub-name').value.trim();
    const email = document.getElementById('sub-email').value.trim();
    const chapter = document.getElementById('sub-chapter').value;
    const website = document.getElementById('sub-website').value; // honeypot

    const turnstileToken = form.querySelector('[name="cf-turnstile-response"]')?.value;

    if (!email) {
      statusEl.textContent = 'Escribe tu correo, por favor.';
      statusEl.className = 'subscribe-status is-error';
      return;
    }

    if (!turnstileToken) {
      statusEl.textContent = 'Completa la verificación anti-spam.';
      statusEl.className = 'subscribe-status is-error';
      return;
    }

    submitBtn.disabled = true;
    statusEl.textContent = 'Enviando…';
    statusEl.className = 'subscribe-status';

    try {
      const res = await fetch(`${WORKER_URL}/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, chapter, turnstileToken, website }),
      });
      const data = await res.json();

      if (!res.ok || !data.ok) {
        throw new Error(data.error || 'Error desconocido');
      }

      statusEl.textContent = data.alreadySubscribed
        ? 'Ya estabas suscrito — revisa tu correo, ahí tienes el capítulo.'
        : '¡Listo! Revisa tu correo en un par de minutos.';
      statusEl.className = 'subscribe-status is-success';
      form.reset();
      if (window.turnstile) window.turnstile.reset();
    } catch (err) {
      statusEl.textContent = err.message || 'No se pudo enviar. Intenta de nuevo en unos minutos.';
      statusEl.className = 'subscribe-status is-error';
    } finally {
      submitBtn.disabled = false;
    }
  });
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
  initVideoShare();
  initInfografias();
});
