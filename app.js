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

    if (WORKER_URL.includes('specsolid-newsletter.sergioide007.workers.dev')) {
      statusEl.textContent = 'El formulario aún no está conectado al Worker (ver app.js).';
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
      statusEl.textContent = 'No se pudo enviar. Intenta de nuevo en unos minutos.';
      statusEl.className = 'subscribe-status is-error';
    } finally {
      submitBtn.disabled = false;
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initScrollReveal();
  initSubscribeForm();
});
