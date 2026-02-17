/* ================================================================
   RG Serviços em Fachadas — JavaScript
   ================================================================
   Sumário:
   1. Scroll Header
   2. Mobile Menu
   3. Theme Toggle
   4. Dynamic Year
   5. Lightbox
   6. Formulário de Orçamento (WhatsApp)
   7. Inicialização (DOMContentLoaded)
   ================================================================ */

'use strict';


/* 1. Scroll Header
   ================================================================
   Adiciona sombra ao header quando rola a página.
   ================================================================ */

function initScrollHeader() {
  const header = document.getElementById('header');
  if (!header) return;

  const SCROLLED_CLASS = 'header--scrolled';
  const SCROLL_THRESHOLD = 10;

  function onScroll() {
    header.classList.toggle(SCROLLED_CLASS, window.scrollY > SCROLL_THRESHOLD);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}


/* 2. Mobile Menu
   ================================================================
   Drawer de navegação mobile com suporte a
   teclado (Escape) e clique fora.
   ================================================================ */

function initMobileMenu() {
  const toggle = document.getElementById('menuToggle');
  const nav    = document.getElementById('mainNav');
  if (!toggle || !nav) return;

  const CLASS_ACTIVE = 'is-active';
  const CLASS_OPEN   = 'is-open';

  function close() {
    nav.classList.remove(CLASS_OPEN);
    toggle.classList.remove(CLASS_ACTIVE);
    toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  function open() {
    nav.classList.add(CLASS_OPEN);
    toggle.classList.add(CLASS_ACTIVE);
    toggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function toggleMenu() {
    nav.classList.contains(CLASS_OPEN) ? close() : open();
  }

  toggle.addEventListener('click', toggleMenu);

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', close);
  });

  document.addEventListener('click', (e) => {
    if (!nav.classList.contains(CLASS_OPEN)) return;
    if (!nav.contains(e.target) && !toggle.contains(e.target)) close();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains(CLASS_OPEN)) {
      close();
      toggle.focus();
      return;
    }

    /* Focus trap: prende Tab dentro do drawer + toggle quando aberto */
    if (e.key === 'Tab' && nav.classList.contains(CLASS_OPEN)) {
      const links = Array.from(nav.querySelectorAll('a'));
      const focusables = [toggle, ...links];
      const first = focusables[0];
      const last  = focusables[focusables.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });
}


/* 3. Theme Toggle
   ================================================================
   Alterna entre claro/escuro respeitando
   a preferência do sistema e localStorage.
   ================================================================ */

function initThemeToggle() {
  const toggle = document.getElementById('themeToggle');
  if (!toggle) return;

  const STORAGE_KEY = 'rg-theme';
  const root = document.documentElement;
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

  function getEffectiveTheme() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'dark' || stored === 'light') return stored;
    return prefersDark.matches ? 'dark' : 'light';
  }

  function applyTheme(theme) {
    if (theme) {
      root.setAttribute('data-theme', theme);
    } else {
      root.removeAttribute('data-theme');
    }
  }

  function toggleTheme() {
    const next = getEffectiveTheme() === 'dark' ? 'light' : 'dark';
    localStorage.setItem(STORAGE_KEY, next);
    applyTheme(next);
  }

  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) applyTheme(stored);

  toggle.addEventListener('click', toggleTheme);
}


/* 4. Dynamic Year
   ================================================================
   Atualiza o ano no rodapé automaticamente.
   ================================================================ */

function initDynamicYear() {
  const el = document.querySelector('[data-year]');
  if (!el) return;
  el.textContent = new Date().getFullYear();
}


/* 5. Lightbox
   ================================================================
   Abre imagens da galeria em modal ampliado
   com navegação por setas, teclado e
   gerenciamento de foco (a11y).
   ================================================================ */

function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  if (!lightbox) return;

  const items = document.querySelectorAll('[data-lightbox]');
  if (!items.length) return;

  const img      = lightbox.querySelector('.lightbox__img');
  const caption  = lightbox.querySelector('.lightbox__caption');
  const btnClose = lightbox.querySelector('.lightbox__close');
  const btnPrev  = lightbox.querySelector('.lightbox__nav--prev');
  const btnNext  = lightbox.querySelector('.lightbox__nav--next');
  const counter  = lightbox.querySelector('.lightbox__counter');

  const TRANSPARENT_GIF = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
  let currentIndex = 0;
  let previousFocus = null;

  const images = Array.from(items).map((item) => {
    const imgEl     = item.querySelector('img');
    const captionEl = item.querySelector('.gallery__caption');
    return {
      src:     imgEl?.src     ?? '',
      alt:     imgEl?.alt     ?? '',
      caption: captionEl?.textContent ?? '',
    };
  });

  function show(index) {
    currentIndex = (index + images.length) % images.length;
    const data = images[currentIndex];
    img.src = data.src;
    img.alt = data.alt;
    caption.textContent = data.caption;
    if (counter) {
      counter.textContent = `Imagem ${currentIndex + 1} de ${images.length}`;
    }
  }

  function open(index) {
    previousFocus = document.activeElement;
    show(index);
    lightbox.removeAttribute('hidden');
    void lightbox.offsetWidth;
    lightbox.classList.add('is-visible');
    document.body.style.overflow = 'hidden';
    btnClose.focus();
  }

  function close() {
    lightbox.classList.remove('is-visible');
    document.body.style.overflow = '';

    function onTransitionDone() {
      lightbox.setAttribute('hidden', '');
      img.src = TRANSPARENT_GIF;
    }

    lightbox.addEventListener('transitionend', onTransitionDone, { once: true });
    setTimeout(onTransitionDone, 400);
    previousFocus?.focus();
    previousFocus = null;
  }

  function next() { show(currentIndex + 1); }
  function prev() { show(currentIndex - 1); }

  items.forEach((item, i) => {
    item.addEventListener('click', () => open(i));
    if (!item.hasAttribute('tabindex')) {
      item.setAttribute('tabindex', '0');
      item.setAttribute('role', 'button');
    }
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        open(i);
      }
    });
  });

  btnClose.addEventListener('click', close);
  btnPrev.addEventListener('click', prev);
  btnNext.addEventListener('click', next);

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) close();
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('is-visible')) return;
    switch (e.key) {
      case 'Escape':     close(); break;
      case 'ArrowLeft':  prev();  break;
      case 'ArrowRight': next();  break;
      case 'Tab': {
        const focusable = lightbox.querySelectorAll('button');
        const first = focusable[0];
        const last  = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
        break;
      }
    }
  });
}


/* 6. Formulário de Orçamento (WhatsApp)
   ================================================================
   Valida campos, monta mensagem formatada e
   redireciona para o WhatsApp.
   ================================================================ */

const WHATSAPP_NUMBER = '5511991234081';
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const BR_PHONE_MAX_DIGITS = 11;

/** Aplica máscara de telefone brasileiro: (11) 99123-4081 */
function maskPhone(input) {
  input.addEventListener('input', () => {
    let digits = input.value.replace(/\D/g, '').slice(0, BR_PHONE_MAX_DIGITS);
    if (digits.length > 6) {
      digits = `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
    } else if (digits.length > 2) {
      digits = `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    }
    input.value = digits;
  });
}

/** Sanitiza string removendo caracteres de controle invisíveis. */
function sanitize(value) {
  return value.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, '').trim();
}

/** Valida campo obrigatório e alterna classes de erro + ARIA. */
function validateField(field) {
  const group = field.closest('.quote-form__group');
  const errorEl = group?.querySelector('.quote-form__error');
  const isEmpty = !field.value.trim();
  const tag = field.tagName;

  if (tag === 'SELECT') {
    field.classList.toggle('quote-form__select--error', isEmpty);
  } else if (tag === 'TEXTAREA') {
    field.classList.toggle('quote-form__textarea--error', isEmpty);
  } else {
    field.classList.toggle('quote-form__input--error', isEmpty);
  }

  field.setAttribute('aria-invalid', String(isEmpty));
  if (errorEl) errorEl.classList.toggle('is-visible', isEmpty);
  return !isEmpty;
}

/** Valida formato de e-mail (quando preenchido). */
function validateEmail(field) {
  const group = field.closest('.quote-form__group');
  const errorEl = group?.querySelector('.quote-form__error');
  const value = field.value.trim();
  if (!value) {
    field.classList.remove('quote-form__input--error');
    field.setAttribute('aria-invalid', 'false');
    if (errorEl) errorEl.classList.remove('is-visible');
    return true;
  }
  const valid = EMAIL_RE.test(value);
  field.classList.toggle('quote-form__input--error', !valid);
  field.setAttribute('aria-invalid', String(!valid));
  if (errorEl) errorEl.classList.toggle('is-visible', !valid);
  return valid;
}

/** Alterna estados visuais: default | success */
function setFormState(form, state) {
  const grid    = form.querySelector('.quote-form__grid');
  const header  = form.querySelector('.quote-form__header');
  const success = form.querySelector('.quote-form__success');
  const submit  = form.querySelector('.quote-form__submit');
  const label   = submit.querySelector('.quote-form__submit-text');

  grid.style.display   = '';
  header.style.display = '';
  if (success) success.style.display = 'none';
  submit.disabled = false;
  label.textContent = 'Enviar pelo WhatsApp';

  if (state === 'success') {
    grid.style.display   = 'none';
    header.style.display = 'none';
    if (success) success.style.display = 'block';
  }
}

/** Monta a mensagem formatada para WhatsApp. */
function buildWhatsAppMessage({ nome, email, telefone, celular, servico, origem, mensagem }) {
  return [
    '*Novo Orcamento - Site RG Servicos*',
    '',
    `*Nome:* ${nome}`,
    `*E-mail:* ${email}`,
    `*Telefone:* ${telefone}`,
    `*Celular:* ${celular}`,
    `*Servico:* ${servico}`,
    `*Como nos conheceu:* ${origem}`,
    '',
    `*Mensagem:*`,
    mensagem,
  ].join('\n');
}

function initQuoteForm() {
  const form = document.getElementById('quoteForm');
  if (!form) return;

  form.querySelectorAll('[data-mask="phone"]').forEach(maskPhone);

  const resetBtn = form.querySelector('[data-action="reset-form"]');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => setFormState(form, 'default'));
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nome     = form.querySelector('#qf-nome');
    const email    = form.querySelector('#qf-email');
    const telefone = form.querySelector('#qf-telefone');
    const celular  = form.querySelector('#qf-celular');
    const servico  = form.querySelector('#qf-servico');
    const origem   = form.querySelector('#qf-origem');
    const mensagem = form.querySelector('#qf-mensagem');

    let valid = true;
    [nome, celular, servico, mensagem].forEach((f) => {
      if (!validateField(f)) valid = false;
    });
    if (!validateEmail(email)) valid = false;

    if (!valid) {
      form.querySelector('.quote-form__input--error, .quote-form__select--error, .quote-form__textarea--error')
        ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    const text = buildWhatsAppMessage({
      nome:     sanitize(nome.value),
      email:    sanitize(email.value)    || '—',
      telefone: sanitize(telefone.value) || '—',
      celular:  sanitize(celular.value)  || '—',
      servico:  sanitize(servico.value),
      origem:   sanitize(origem.value)   || 'Não informado',
      mensagem: sanitize(mensagem.value) || '(sem mensagem adicional)',
    });

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener');

    setFormState(form, 'success');
    form.reset();
  });

  form.querySelectorAll('[required]').forEach((input) => {
    input.addEventListener('blur', () => validateField(input));
  });

  const emailField = form.querySelector('#qf-email');
  if (emailField) {
    emailField.addEventListener('blur', () => validateEmail(emailField));
  }
}


/* 7. Inicialização
   ================================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initScrollHeader();
  initMobileMenu();
  initThemeToggle();
  initDynamicYear();
  initLightbox();
  initQuoteForm();
});
