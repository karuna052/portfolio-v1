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
