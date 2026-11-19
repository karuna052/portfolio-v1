/* =============================================================
   KARUNA.DEV — interactions
   ============================================================= */

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) {
    window.lucide.createIcons();
  }

  startTypewriter();
  initReveals();
  initNavigation();
  initScrollUI();
  initCursorCompanion();
  initCopyEmail();
  initProjectSpotlight();
  initMascot();
  checkResume();

  const year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());

  requestAnimationFrame(() => document.body.classList.add('page-ready'));
});

/* -------------------------------------------------------------
   HERO TYPEWRITER
------------------------------------------------------------- */
function startTypewriter() {
  const output = document.getElementById('typewriter');
  if (!output) return;

  const roles = [
    'Computer Science undergraduate',
    'frontend developer in progress',
    'C++ & DSA learner',
    'open-source contributor',
  ];

  if (prefersReducedMotion) {
    output.textContent = roles[0];
    return;
  }

  let roleIndex = 0;
  let charIndex = 0;
  let deleting = false;

  function tick() {
    const word = roles[roleIndex];

    if (deleting) {
      charIndex -= 1;
      output.textContent = word.slice(0, charIndex);
    } else {
      charIndex += 1;
      output.textContent = word.slice(0, charIndex);
    }

    let delay = deleting ? 38 : 72;

    if (!deleting && charIndex === word.length) {
      delay = 1800;
      deleting = true;
    } else if (deleting && charIndex === 0) {
      deleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      delay = 420;
    }

    window.setTimeout(tick, delay);
  }

  window.setTimeout(tick, 700);
}

/* -------------------------------------------------------------
   SCROLL REVEALS
------------------------------------------------------------- */
function initReveals() {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;

  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    items.forEach((item) => item.classList.add('is-in'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  items.forEach((item) => observer.observe(item));
}

/* -------------------------------------------------------------
   MOBILE NAVIGATION + SCROLLSPY
------------------------------------------------------------- */
function initNavigation() {
  const header = document.getElementById('siteHeader');
  const toggle = document.getElementById('menuToggle');
  const menu = document.getElementById('primaryNav');
  if (!header || !toggle || !menu) return;

  const closeMenu = () => {
    menu.classList.remove('is-open');
    header.classList.remove('menu-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open navigation menu');
    toggle.innerHTML = '<i data-lucide="menu"></i>';
    window.lucide?.createIcons();
  };

  const openMenu = () => {
    menu.classList.add('is-open');
    header.classList.add('menu-open');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Close navigation menu');
    toggle.innerHTML = '<i data-lucide="x"></i>';
    window.lucide?.createIcons();
  };

  toggle.addEventListener('click', () => {
    if (menu.classList.contains('is-open')) closeMenu();
    else openMenu();
  });

  menu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menu.classList.contains('is-open')) {
      closeMenu();
      toggle.focus();
    }
  });

  document.addEventListener('click', (event) => {
    if (!menu.classList.contains('is-open')) return;
    const target = event.target;
    if (!(target instanceof Element)) return;
    if (target.closest('#primaryNav') || target.closest('#menuToggle')) return;
    closeMenu();
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 880) closeMenu();
  });

  const links = Array.from(document.querySelectorAll('.nav-link'));
  const sections = links
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  if (!sections.length || !('IntersectionObserver' in window)) return;

  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((link) => {
          link.classList.toggle(
            'is-active',
            link.getAttribute('href') === `#${entry.target.id}`
          );
        });
      });
    },
    { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
  );

  sections.forEach((section) => spy.observe(section));
}

/* -------------------------------------------------------------
   HEADER, PROGRESS BAR, BACK TO TOP
------------------------------------------------------------- */
function initScrollUI() {
  const header = document.getElementById('siteHeader');
  const progress = document.getElementById('scrollProgress');
  const backToTop = document.getElementById('backToTop');

  const update = () => {
    const top = window.scrollY;
    const height = document.documentElement.scrollHeight - window.innerHeight;

    if (header) header.classList.toggle('is-scrolled', top > 24);
    if (progress) progress.style.width = height > 0 ? `${(top / height) * 100}%` : '0%';
    if (backToTop) backToTop.classList.toggle('is-visible', top > window.innerHeight * 0.5);
  };

  update();
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);

  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    });
  }
}

/* -------------------------------------------------------------
   OPTIONAL CURSOR COMPANION
------------------------------------------------------------- */
function initCursorCompanion() {
  const dot = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  if (!dot || !ring) return;

  const finePointer = window.matchMedia('(pointer: fine)').matches;
  if (!finePointer || prefersReducedMotion) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;

  window.addEventListener('mousemove', (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;
    dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
    document.body.classList.add('cursor-active');
  });

  document.addEventListener('mouseleave', () => {
    document.body.classList.remove('cursor-active');
  });

  const interactive = 'a, button, .project-card, .chip, .skill-card, .fact-card';

  document.addEventListener('mouseover', (event) => {
    if (event.target instanceof Element && event.target.closest(interactive)) {
      ring.classList.add('is-hover');
    }
  });

  document.addEventListener('mouseout', (event) => {
    if (event.target instanceof Element && event.target.closest(interactive)) {
      ring.classList.remove('is-hover');
    }
  });

  function animate() {
    ringX += (mouseX - ringX) * 0.16;
    ringY += (mouseY - ringY) * 0.16;
    ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
}

/* -------------------------------------------------------------
   CONTACT: COPY EMAIL
------------------------------------------------------------- */
function initCopyEmail() {
  const button = document.getElementById('copyEmail');
  const status = document.getElementById('copyStatus');
  if (!button || !status) return;

  const email = button.dataset.email || '';

  const showStatus = (message) => {
    status.textContent = message;
    window.setTimeout(() => {
      if (status.textContent === message) status.textContent = '';
    }, 2600);
  };

  const fallbackCopy = () => {
    const field = document.createElement('textarea');
    field.value = email;
    field.setAttribute('readonly', '');
    field.style.position = 'fixed';
    field.style.opacity = '0';
    document.body.appendChild(field);
    field.select();
    try {
      document.execCommand('copy');
      showStatus('email copied to clipboard');
    } catch {
      showStatus(`copy failed — ${email}`);
    }
    field.remove();
  };

  button.addEventListener('click', async (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(email);
        showStatus('email copied to clipboard');
        return;
      } catch {
        /* fall through */
      }
    }

    fallbackCopy();
  });
}

/* -------------------------------------------------------------
   PROJECT CARD SPOTLIGHT
------------------------------------------------------------- */
function initProjectSpotlight() {
  if (prefersReducedMotion) return;

  document.querySelectorAll('.project-card').forEach((card) => {
    card.addEventListener('pointermove', (event) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${event.clientX - rect.left}px`);
      card.style.setProperty('--my', `${event.clientY - rect.top}px`);
    });
  });
}

/* -------------------------------------------------------------
   MASCOT: eased pointer following plus playful hover reactions
------------------------------------------------------------- */
function initMascot() {
  const mascot = document.getElementById('mascot');
  if (!mascot || prefersReducedMotion) return;

  initMascotReactions(mascot);

  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  initMascotFollow(mascot);
}

const MASCOT_REACT_SELECTOR = 'a, button, .project-card, .contact-row, .scroll-cue';
const MASCOT_PEEK_SELECTOR = '.project-card';

function initMascotReactions(mascot) {
  let peekTimer = 0;

  document.addEventListener(
    'pointerover',
    (event) => {
      const target = event.target instanceof Element ? event.target : null;
      if (!target) return;

      if (target.closest(MASCOT_PEEK_SELECTOR)) {
        window.clearTimeout(peekTimer);
        mascot.classList.add('is-peeking');
      }

      if (target.closest(MASCOT_REACT_SELECTOR)) {
        mascot.classList.add('is-waving');
      }
    },
    { passive: true }
  );

  document.addEventListener(
    'pointerout',
    (event) => {
      const target = event.target instanceof Element ? event.target : null;
      if (!target) return;

      const card = target.closest(MASCOT_PEEK_SELECTOR);
      if (card && !card.contains(event.relatedTarget)) {
        peekTimer = window.setTimeout(() => mascot.classList.remove('is-peeking'), 220);
      }

      const interactive = target.closest(MASCOT_REACT_SELECTOR);
      if (interactive && !interactive.contains(event.relatedTarget)) {
        mascot.classList.remove('is-waving');
      }
    },
    { passive: true }
  );
}

function initMascotFollow(mascot) {
  const EASE = 0.16;
  const OFFSET_X = 20;
  const OFFSET_Y = 18;
  const EDGE = 10;
  const REST_LEFT = 16;
  const REST_BOTTOM = 14;

  let width = mascot.offsetWidth || 52;
  let height = mascot.offsetHeight || 52;
  let currentX = 0;
  let currentY = 0;
  let targetX = 0;
  let targetY = 0;
  let placed = false;
  let frame = 0;
  let lastTime = 0;

  const maxX = () => Math.max(EDGE, window.innerWidth - width - EDGE);
  const maxY = () => Math.max(EDGE, window.innerHeight - height - EDGE);
  const clampX = (value) => Math.min(Math.max(value, EDGE), maxX());
  const clampY = (value) => Math.min(Math.max(value, EDGE), maxY());

  const paint = () => {
    mascot.style.transform = `translate3d(${currentX.toFixed(2)}px, ${currentY.toFixed(2)}px, 0)`;
  };

  const stop = () => {
    if (frame) window.cancelAnimationFrame(frame);
    frame = 0;
    lastTime = 0;
  };

  const step = (time) => {
    frame = 0;
    const delta = lastTime ? Math.min(time - lastTime, 64) : 16.7;
    lastTime = time;

    // Frame-rate independent easing, so the lag feels the same at any refresh rate.
    const amount = 1 - Math.pow(1 - EASE, delta / 16.7);
    currentX += (targetX - currentX) * amount;
    currentY += (targetY - currentY) * amount;

    if (Math.abs(targetX - currentX) + Math.abs(targetY - currentY) < 0.2) {
      currentX = targetX;
      currentY = targetY;
      paint();
      lastTime = 0;
      return; // settled: idle until the pointer moves again
    }

    paint();
    frame = window.requestAnimationFrame(step);
  };

  const start = () => {
    if (frame || document.hidden) return;
    lastTime = 0;
    frame = window.requestAnimationFrame(step);
  };

  const aimAt = (clientX, clientY) => {
    // Sit diagonally clear of the pointer, flipping sides near the viewport edges.
    let nextX = clientX + OFFSET_X;
    if (nextX + width > window.innerWidth - EDGE) nextX = clientX - OFFSET_X - width;

    let nextY = clientY + OFFSET_Y;
    if (nextY + height > window.innerHeight - EDGE) nextY = clientY - OFFSET_Y - height;

    targetX = clampX(nextX);
    targetY = clampY(nextY);
  };

  const onPointerMove = (event) => {
    if (event.pointerType === 'touch') return;

    if (!placed) {
      const rect = mascot.getBoundingClientRect();
      currentX = rect.left;
      currentY = rect.top;
      placed = true;
      mascot.classList.add('is-tracking');
      paint();
    }

    aimAt(event.clientX, event.clientY);
    start();
  };

  const onPointerLeave = () => {
    if (!placed) return;
    targetX = clampX(REST_LEFT);
    targetY = clampY(window.innerHeight - height - REST_BOTTOM);
    start();
  };

  const onResize = () => {
    width = mascot.offsetWidth || width;
    height = mascot.offsetHeight || height;
    if (!placed) return;

    currentX = clampX(currentX);
    currentY = clampY(currentY);
    targetX = clampX(targetX);
    targetY = clampY(targetY);
    paint();
    start();
  };

  window.addEventListener('pointermove', onPointerMove, { passive: true });
  window.addEventListener('resize', onResize, { passive: true });
  document.documentElement.addEventListener('pointerleave', onPointerLeave);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stop();
    else if (placed) start();
  });
}

/* -------------------------------------------------------------
   RESUME: only enable when a real PDF is available
------------------------------------------------------------- */
async function checkResume() {
  const link = document.getElementById('resumeButton');
  const status = document.getElementById('resumeStatus');
  if (!link || !status) return;

  const keepPending = () => {
    link.setAttribute('aria-disabled', 'true');
    link.classList.add('is-pending');
    link.addEventListener('click', (event) => event.preventDefault());
  };

  try {
    const response = await fetch('/resume.pdf', { method: 'HEAD', cache: 'no-store' });
    const type = response.headers.get('content-type') || '';
    if (!response.ok || !type.includes('pdf')) {
      keepPending();
      return;
    }

    link.removeAttribute('aria-disabled');
    link.classList.remove('is-pending');
    link.classList.add('is-ready');
    link.title = 'Open resume PDF';
    status.textContent = 'pdf';
  } catch {
    keepPending();
  }
}
