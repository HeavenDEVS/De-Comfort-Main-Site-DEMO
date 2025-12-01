// app.js
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

document.addEventListener('DOMContentLoaded', () => {
  // Mobile nav
  const hamburger = $('#hamburger');
  const nav = $('#nav');
  if (hamburger && nav) {
    hamburger.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', String(isOpen));
    });
    $$('#nav a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));
  }

  // Year
  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Modal open/close
  const openers = $$('[data-open]');
  const closers = $$('[data-close]');
  const animateModal = (modal, opening) => {
    const content = modal.querySelector('.reveal');
    if (!content) return;
    if (opening) {
      content.classList.remove('is-visible');
      requestAnimationFrame(() => {
        content.classList.add('is-visible');
      });
    } else {
      content.classList.remove('is-visible');
    }
  };
  openers.forEach(btn => btn.addEventListener('click', () => {
    const id = btn.getAttribute('data-open');
    const modal = document.getElementById(id);
    if (modal) {
      modal.setAttribute('aria-hidden', 'false');
      animateModal(modal, true);
    }
  }));
  closers.forEach(btn => btn.addEventListener('click', () => {
    const id = btn.getAttribute('data-close');
    const modal = document.getElementById(id);
    if (modal) {
      modal.setAttribute('aria-hidden', 'true');
      animateModal(modal, false);
    }
  }));

  // Reservation forms (demo submit)
  const reserveForm = $('#reserve-form');
  const quickForm = $('#quick-reserve');
  const postDemo = async (payload) => {
    await new Promise(r => setTimeout(r, 1200)); // simulate
    return { ok: true };
  };

  const attachHandler = (form, statusSel) => {
    if (!form) return;
    const status = $(statusSel);
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      status.textContent = 'Sending...';
      const data = Object.fromEntries(new FormData(form).entries());
      try {
        const res = await postDemo(data);
        if (res.ok) {
          status.textContent = 'Thanks! We will confirm by email shortly.';
          form.reset();
        } else {
          status.textContent = 'Something went wrong. Please try again.';
        }
      } catch {
        status.textContent = 'Network error. Please try again.';
      }
    });
  };

  attachHandler(reserveForm, '#reserve-status');
  attachHandler(quickForm, '#quick-status');

  const initScrollReveal = () => {
    const allReveals = $$('.reveal');
    if (!allReveals.length) return;

    const staticReveals = allReveals.filter(el => !el.closest('.modal'));
    const showAll = () => {
      staticReveals.forEach(el => el.classList.add('is-visible'));
    };

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    if (mediaQuery.matches) {
      showAll();
    } else {
      const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.18, rootMargin: '0px 0px -10% 0px' });

      staticReveals.forEach(el => observer.observe(el));

      if (typeof mediaQuery.addEventListener === 'function') {
        mediaQuery.addEventListener('change', (event) => {
          if (event.matches) showAll();
        });
      } else if (typeof mediaQuery.addListener === 'function') {
        mediaQuery.addListener((event) => {
          if (event.matches) showAll();
        });
      }
    }

  };

  initScrollReveal();
});