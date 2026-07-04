/* -------------------------------------------------------------
   INITIALIZATION & LIBRARIES
------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // Set active link highlight on page load/anchor click
  handleActiveLinkOnLoad();

  // Start animations
  initCursor();
  initCanvasParticles();
  startTypewriter();
  initScrollAnimations();
  initHeaderEffects();
  initContactForm();

  // Trigger smooth page fade-in
  requestAnimationFrame(() => {
    document.body.classList.remove('page-loading');
    document.body.classList.add('page-ready');
  });
});

/* -------------------------------------------------------------
   GLOWING CUSTOM CURSOR
------------------------------------------------------------- */
function initCursor() {
  const cursorDot = document.getElementById('cursorDot');
  const cursorOutline = document.getElementById('cursorOutline');

  if (!cursorDot || !cursorOutline) return;

  let mouseX = 0;
  let mouseY = 0;
  let outlineX = 0;
  let outlineY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    // Center the dot directly on cursor coordinates
    cursorDot.style.left = mouseX + 'px';
    cursorDot.style.top = mouseY + 'px';
  });

  // Outline linear interpolation (lerp) for smooth trailing
  function animateCursorOutline() {
    const ease = 0.15; // Smooth factor
    outlineX += (mouseX - outlineX) * ease;
    outlineY += (mouseY - outlineY) * ease;

    cursorOutline.style.left = outlineX + 'px';
    cursorOutline.style.top = outlineY + 'px';

    requestAnimationFrame(animateCursorOutline);
  }
  requestAnimationFrame(animateCursorOutline);

  // Mouse over effects to scale outline
  window.addEventListener('mouseover', (e) => {
    const target = e.target;
    if (target && typeof target.closest === 'function' && (
      target.closest('a') || 
      target.closest('button') || 
      target.closest('input') || 
      target.closest('textarea') || 
      target.closest('.info-link-card')
    )) {
      cursorOutline.style.transform = 'translate(-50%, -50%) scale(1.6)';
      cursorOutline.style.backgroundColor = 'rgba(6, 182, 212, 0.12)';
      cursorOutline.style.borderColor = 'transparent';
    } else {
      cursorOutline.style.transform = 'translate(-50%, -50%) scale(1)';
      cursorOutline.style.backgroundColor = 'transparent';
      cursorOutline.style.borderColor = 'var(--accent-cyan)';
    }
  });

  // Hide cursor when mouse leaves browser window
  document.addEventListener('mouseleave', () => {
    cursorDot.style.opacity = '0';
    cursorOutline.style.opacity = '0';
  });

  document.addEventListener('mouseenter', () => {
    cursorDot.style.opacity = '1';
    cursorOutline.style.opacity = '1';
  });
}

/* -------------------------------------------------------------
   ANIMATED CANVAS PARTICLES
------------------------------------------------------------- */
function initCanvasParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let particlesArray = [];
  const maxParticles = 70;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', () => {
    resizeCanvas();
    initParticles();
  });
  resizeCanvas();

  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 0.8;
      // Slanted slow motion speeds
      this.speedX = (Math.random() - 0.5) * 0.35;
      this.speedY = (Math.random() - 0.5) * 0.35;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      // Bounce boundaries
      if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
      if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
    }

    draw() {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function initParticles() {
    particlesArray = [];
    for (let i = 0; i < maxParticles; i++) {
      particlesArray.push(new Particle());
    }
  }
  initParticles();

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < particlesArray.length; i++) {
      particlesArray[i].update();
      particlesArray[i].draw();

      // Connect close points
      for (let j = i + 1; j < particlesArray.length; j++) {
        const dx = particlesArray[i].x - particlesArray[j].x;
        const dy = particlesArray[i].y - particlesArray[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 110) {
          const alpha = 0.12 - (distance / 110) * 0.12;
          ctx.strokeStyle = `rgba(6, 182, 212, ${alpha})`;
          ctx.lineWidth = 0.7;
          ctx.beginPath();
          ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
          ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(animateParticles);
  }
  animateParticles();
}

/* -------------------------------------------------------------
   HERO TYPING ANIMATION
------------------------------------------------------------- */
function startTypewriter() {
  const typewriter = document.getElementById('typewriter');
  if (!typewriter) return;

  const words = [
    'Full Stack Developer (Aspiring)',
    'Web Development Enthusiast',
    'Open Source Learner',
    'DSA Explorer'
  ];
  let wordIdx = 0;
  let charIdx = 0;
  let isDeleting = false;

  function typeAction() {
    const currentText = words[wordIdx];

    if (isDeleting) {
      typewriter.textContent = currentText.substring(0, charIdx - 1);
      charIdx--;
    } else {
      typewriter.textContent = currentText.substring(0, charIdx + 1);
      charIdx++;
    }

    let typeSpeed = 100;
    
    if (isDeleting) {
      typeSpeed /= 2; // Delete faster than typing
    }

    if (!isDeleting && charIdx === currentText.length) {
      typeSpeed = 1800; // Wait at full text display
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      wordIdx = (wordIdx + 1) % words.length; // Shift word index
      typeSpeed = 400; // Small delay before rewriting
    }

    setTimeout(typeAction, typeSpeed);
  }
  typeAction();
}

/* -------------------------------------------------------------
   SCROLL REVEAL ANIMATIONS
------------------------------------------------------------- */
function initScrollAnimations() {
  const revealElements = document.querySelectorAll('.reveal');
  
  if (revealElements.length === 0) return;

  const observerOptions = {
    root: null, // Viewport context
    threshold: 0.1, // Trigger when 10% element is visible
    rootMargin: '0px 0px -40px 0px'
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target); // Reveal once only
      }
    });
  }, observerOptions);

  revealElements.forEach(el => revealObserver.observe(el));
}

/* -------------------------------------------------------------
   SCROLL TRACKING (HEADER, PROGRESS, BACK TO TOP, ACTIVE LI)
------------------------------------------------------------- */
function initHeaderEffects() {
  const header = document.querySelector('.glass-header');
  const scrollProgress = document.getElementById('scrollProgress');
  const backToTop = document.getElementById('backToTop');
  const navItems = document.querySelectorAll('.nav-item');
  const sections = document.querySelectorAll('section');

  // Track scrolling actions
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;

    // Header shrinking
    if (scrollTop > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Scroll Progress Bar
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (totalHeight > 0) {
      const progressPercent = (scrollTop / totalHeight) * 100;
      scrollProgress.style.width = progressPercent + '%';
    }

    // Back to top floating button visibility
    if (scrollTop > window.innerHeight * 0.4) {
      backToTop.classList.add('show');
    } else {
      backToTop.classList.remove('show');
    }

    // Active Section Link Highlight
    let currentId = '';
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.clientHeight;
      if (scrollTop >= top - 200) {
        currentId = section.getAttribute('id');
      }
    });

    navItems.forEach(item => {
      item.classList.remove('active');
      if (item.getAttribute('href') === `#${currentId}`) {
        item.classList.add('active');
      }
    });
  });

  // Back to Top trigger action
  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // Mobile menu links interaction
  const mobileMenuToggle = document.getElementById('mobileMenuToggle');
  const navLinks = document.getElementById('navLinks');

  if (mobileMenuToggle && navLinks) {
    mobileMenuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      const icon = mobileMenuToggle.querySelector('i');
      if (navLinks.classList.contains('open')) {
        icon.setAttribute('data-lucide', 'x');
      } else {
        icon.setAttribute('data-lucide', 'menu');
      }
      lucide.createIcons();
    });

    // Close mobile nav menu when selecting links
    navItems.forEach(item => {
      item.addEventListener('click', () => {
        navLinks.classList.remove('open');
        const icon = mobileMenuToggle.querySelector('i');
        icon.setAttribute('data-lucide', 'menu');
        lucide.createIcons();
      });
    });
  }
}

// Check URL Hash on Load
function handleActiveLinkOnLoad() {
  const currentHash = window.location.hash;
  if (!currentHash) return;
  
  const activeLink = document.querySelector(`.nav-item[href="${currentHash}"]`);
  const navItems = document.querySelectorAll('.nav-item');
  
  if (activeLink) {
    navItems.forEach(item => item.classList.remove('active'));
    activeLink.classList.add('active');
  }
}

/* -------------------------------------------------------------
   CONTACT FORM SUBMISSION
------------------------------------------------------------- */
function initContactForm() {
  const contactForm = document.getElementById('contactForm');
  const formFeedback = document.getElementById('formFeedback');

  if (!contactForm || !formFeedback) return;

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Input values gathering
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    if (!name || !email || !message) return;

    // Simulate asynchronous sending process
    const submitBtn = contactForm.querySelector('.btn-submit');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span>Sending...</span> <i data-lucide="loader" class="animate-spin"></i>`;
    lucide.createIcons();

    setTimeout(() => {
      // Smoothly hide form
      contactForm.style.opacity = '0';
      
      setTimeout(() => {
        contactForm.classList.add('hidden');
        formFeedback.classList.remove('hidden');
        
        // Trigger scaling animation
        setTimeout(() => {
          formFeedback.classList.add('show');
        }, 50);
      }, 300);

    }, 1500);
  });
}
