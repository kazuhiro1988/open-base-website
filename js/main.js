/* ============================================================
   Open base 合同会社 — Main JavaScript
   ============================================================ */

(function () {
  'use strict';

  /* ===== 0. prefers-reduced-motion: 動画を停止 ===== */
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.addEventListener('DOMContentLoaded', () => {
      document.querySelectorAll('video').forEach((v) => {
        v.pause();
        v.removeAttribute('autoplay');
      });
    });
  }

  /* ===== 1. PAGE TRANSITION ===== */
  const pageTransition = document.getElementById('page-transition');

  function fadeOutTransition() {
    if (!pageTransition) return;
    requestAnimationFrame(() => {
      pageTransition.classList.add('out');
    });
  }

  function fadeInTransition(callback) {
    if (!pageTransition) {
      callback();
      return;
    }
    pageTransition.classList.remove('out');
    setTimeout(callback, 500);
  }

  document.addEventListener('DOMContentLoaded', () => {
    // Fade out on initial load
    setTimeout(fadeOutTransition, 100);

    // Intercept internal link clicks
    document.querySelectorAll('a[href]').forEach((link) => {
      const href = link.getAttribute('href');
      if (!href) return;
      // Skip mailto, tel, external, hash-only, target blank
      if (
        href.startsWith('mailto:') ||
        href.startsWith('tel:') ||
        href.startsWith('http://') ||
        href.startsWith('https://') ||
        href.startsWith('#') ||
        link.target === '_blank'
      ) return;

      link.addEventListener('click', (e) => {
        e.preventDefault();
        const dest = href;
        fadeInTransition(() => {
          window.location.href = dest;
        });
      });
    });
  });

  /* ===== 2. NAVBAR SCROLL ===== */
  const navbar = document.getElementById('navbar');

  function handleNavbarScroll() {
    if (!navbar) return;
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleNavbarScroll, { passive: true });

  /* ===== 3. MOBILE HAMBURGER MENU ===== */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.classList.contains('open');
      hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
      document.body.style.overflow = isOpen ? '' : 'hidden';
    });

    // Close on mobile link click
    mobileMenu.querySelectorAll('.mobile-nav-link').forEach((link) => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ===== 4. ACTIVE NAV LINK ===== */
  function setActiveNavLink() {
    const path = window.location.pathname;
    const filename = path.split('/').pop() || 'index.html';

    document.querySelectorAll('.nav-links a, .mobile-nav-link').forEach((link) => {
      const linkHref = link.getAttribute('href');
      if (!linkHref) return;
      const linkFile = linkHref.split('/').pop();

      if (
        (linkFile === filename) ||
        (filename === '' && linkFile === 'index.html') ||
        (filename === 'index.html' && linkFile === 'index.html')
      ) {
        link.classList.add('active');
      }
    });
  }

  document.addEventListener('DOMContentLoaded', setActiveNavLink);

  /* ===== 5. SCROLL REVEAL ===== */
  function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');
    if (!reveals.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    reveals.forEach((el) => observer.observe(el));
  }

  document.addEventListener('DOMContentLoaded', initScrollReveal);

  /* ===== 6. COUNTER ANIMATION ===== */
  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function animateCounter(el) {
    const target = parseFloat(el.getAttribute('data-target'));
    const suffix = el.getAttribute('data-suffix') || '';
    const prefix = el.getAttribute('data-prefix') || '';
    const isDecimal = String(target).includes('.');
    const duration = 1800;
    let startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutCubic(progress);
      const current = eased * target;

      el.textContent = prefix + (isDecimal ? current.toFixed(1) : Math.floor(current)) + suffix;

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = prefix + (isDecimal ? target.toFixed(1) : target) + suffix;
      }
    }

    requestAnimationFrame(step);
  }

  function initCounters() {
    const statNums = document.querySelectorAll('.stat-num[data-target]');
    if (!statNums.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    statNums.forEach((el) => observer.observe(el));
  }

  document.addEventListener('DOMContentLoaded', initCounters);

  /* ===== 7. FAQ ACCORDION ===== */
  function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    if (!faqItems.length) return;

    faqItems.forEach((item) => {
      const question = item.querySelector('.faq-question');
      if (!question) return;

      question.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');

        // Close all
        faqItems.forEach((other) => {
          if (other !== item) other.classList.remove('open');
        });

        // Toggle current
        item.classList.toggle('open', !isOpen);
      });
    });
  }

  document.addEventListener('DOMContentLoaded', initFAQ);

  /* ===== 8. HERO CANVAS — PARTICLE NETWORK ===== */
  function initHeroCanvas() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let W, H, particles, animFrame;

    function resize() {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }

    const GOLD = 'rgba(168,188,208,';
    const BLUE = 'rgba(90,168,232,';
    const PARTICLE_COUNT = Math.min(70, Math.floor((window.innerWidth * window.innerHeight) / 12000));
    const MAX_DIST = 140;
    const GRID_SPACING = 60;

    class Particle {
      constructor() {
        this.reset(true);
      }

      reset(initial) {
        this.x = Math.random() * (W || window.innerWidth);
        this.y = initial ? Math.random() * (H || window.innerHeight) : -10;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
        this.r  = Math.random() * 1.8 + 0.6;
        this.color = Math.random() > 0.45 ? GOLD : BLUE;
        this.alpha = Math.random() * 0.5 + 0.3;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < -20 || this.x > W + 20) this.vx *= -1;
        if (this.y < -20 || this.y > H + 20) this.vy *= -1;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = this.color + this.alpha + ')';
        ctx.fill();
      }
    }

    function drawGrid() {
      ctx.strokeStyle = 'rgba(255,255,255,0.018)';
      ctx.lineWidth = 1;
      for (let x = 0; x < W; x += GRID_SPACING) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, H);
        ctx.stroke();
      }
      for (let y = 0; y < H; y += GRID_SPACING) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
        ctx.stroke();
      }
    }

    function drawConnections() {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < MAX_DIST) {
            const alpha = (1 - dist / MAX_DIST) * 0.15;
            const gradient = ctx.createLinearGradient(
              particles[i].x, particles[i].y,
              particles[j].x, particles[j].y
            );
            gradient.addColorStop(0, particles[i].color + alpha + ')');
            gradient.addColorStop(1, particles[j].color + alpha + ')');
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }
    }

    function animate() {
      ctx.clearRect(0, 0, W, H);
      drawGrid();
      drawConnections();
      particles.forEach((p) => { p.update(); p.draw(); });
      animFrame = requestAnimationFrame(animate);
    }

    function init() {
      resize();
      particles = Array.from({ length: PARTICLE_COUNT }, () => new Particle());
      animate();
    }

    window.addEventListener('resize', () => {
      resize();
    });

    init();
  }

  document.addEventListener('DOMContentLoaded', initHeroCanvas);

  /* ===== 9. CHARACTER-BY-CHARACTER TEXT REVEAL ===== */
  function initCharReveal() {
    const els = document.querySelectorAll('[data-charreveal]');
    if (!els.length) return;

    els.forEach((el) => {
      const text = el.textContent;
      el.textContent = '';
      el.style.visibility = 'visible';

      setTimeout(() => {
        const chars = [...text];
        chars.forEach((char, i) => {
          setTimeout(() => {
            const span = document.createElement('span');
            span.textContent = char;
            span.style.opacity = '0';
            span.style.display = 'inline';
            span.style.transition = 'opacity 0.15s ease';
            el.appendChild(span);
            requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                span.style.opacity = '1';
              });
            });
            // Blinking cursor after last character
            if (i === chars.length - 1) {
              setTimeout(() => {
                const cursor = document.createElement('span');
                cursor.style.cssText = [
                  'display:inline-block',
                  'width:2px',
                  'height:0.82em',
                  'background:currentColor',
                  'margin-left:3px',
                  'vertical-align:text-bottom',
                  'border-radius:1px',
                  'animation:cursorBlink 1s ease infinite',
                ].join(';');
                el.appendChild(cursor);
                // Fade out cursor after 3.5s
                setTimeout(() => {
                  cursor.style.transition = 'opacity 0.6s ease';
                  cursor.style.animation  = 'none';
                  cursor.style.opacity    = '0';
                }, 3500);
              }, 200);
            }
          }, i * 55);
        });
      }, 1200);
    });
  }

  document.addEventListener('DOMContentLoaded', initCharReveal);

  /* ===== 10. BACK TO TOP ===== */
  function initBackToTop() {
    const btn = document.getElementById('back-to-top');
    if (!btn) return;

    function toggleBtn() {
      if (window.scrollY > 400) {
        btn.classList.add('visible');
      } else {
        btn.classList.remove('visible');
      }
    }

    window.addEventListener('scroll', toggleBtn, { passive: true });

    btn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  document.addEventListener('DOMContentLoaded', initBackToTop);

  /* ===== 11. CONTACT FORM VALIDATION ===== */
  function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    const successEl = document.getElementById('formSuccess');
    const submitBtn = form.querySelector('.form-submit-btn');

    function validateEmail(email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function showError(input, msg) {
      input.classList.add('error');
      const errEl = input.parentElement.querySelector('.form-error-msg');
      if (errEl) {
        errEl.textContent = msg;
        errEl.classList.add('visible');
      }
    }

    function clearError(input) {
      input.classList.remove('error');
      const errEl = input.parentElement.querySelector('.form-error-msg');
      if (errEl) errEl.classList.remove('visible');
    }

    // Live validation — clear on input
    form.querySelectorAll('.form-control').forEach((input) => {
      input.addEventListener('input', () => clearError(input));
      input.addEventListener('change', () => clearError(input));
    });

    // Blur validation — validate immediately when leaving a field
    form.querySelectorAll('[required]').forEach((input) => {
      input.addEventListener('blur', () => {
        const val = input.value.trim();
        if (!val) {
          showError(input, 'この項目は必須です');
        } else if (input.type === 'email' && !validateEmail(val)) {
          showError(input, '正しいメールアドレスを入力してください');
        } else {
          clearError(input);
          input.classList.add('valid');
        }
      });
      input.addEventListener('input', () => {
        if (input.classList.contains('valid') || input.value.trim()) {
          input.classList.remove('valid');
        }
      });
    });

    // Character counter for textarea
    const textarea = form.querySelector('textarea');
    const counter = form.querySelector('.char-counter');
    if (textarea && counter) {
      const max = 1000;
      function updateCounter() {
        const len = textarea.value.length;
        counter.textContent = len + ' / ' + max;
        counter.classList.toggle('counter-warn', len > max * 0.85);
      }
      textarea.addEventListener('input', updateCounter);
      updateCounter();
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;

      // Required fields
      form.querySelectorAll('[required]').forEach((input) => {
        const val = input.value.trim();
        if (!val) {
          showError(input, 'この項目は必須です');
          valid = false;
        } else if (input.type === 'email' && !validateEmail(val)) {
          showError(input, '正しいメールアドレスを入力してください');
          valid = false;
        } else {
          clearError(input);
        }
      });

      // Privacy checkbox
      const privacyCheck = form.querySelector('#privacyCheck');
      if (privacyCheck && !privacyCheck.checked) {
        const errEl = privacyCheck.closest('.form-group').querySelector('.form-error-msg');
        if (errEl) {
          errEl.textContent = 'プライバシーポリシーへの同意が必要です';
          errEl.classList.add('visible');
        }
        valid = false;
      }

      if (!valid) return;

      // Simulate submission
      submitBtn.classList.add('loading');
      submitBtn.disabled = true;

      setTimeout(() => {
        form.style.display = 'none';
        if (successEl) successEl.classList.add('visible');
      }, 1500);
    });
  }

  document.addEventListener('DOMContentLoaded', initContactForm);

  /* ===== 12. DROPDOWN KEYBOARD ACCESSIBILITY ===== */
  function initDropdownA11y() {
    const dropdownParents = document.querySelectorAll('.has-dropdown');

    dropdownParents.forEach((parent) => {
      const trigger = parent.querySelector('a');
      const dropdown = parent.querySelector('.nav-dropdown');
      if (!trigger || !dropdown) return;

      trigger.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const isOpen = dropdown.style.opacity === '1';
          dropdown.style.opacity = isOpen ? '0' : '1';
          dropdown.style.visibility = isOpen ? 'hidden' : 'visible';
          dropdown.style.transform = isOpen
            ? 'translateX(-50%) translateY(-8px)'
            : 'translateX(-50%) translateY(0)';
          dropdown.style.pointerEvents = isOpen ? 'none' : 'auto';
        }
      });

      // Close on Escape
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          dropdown.style.opacity = '0';
          dropdown.style.visibility = 'hidden';
          dropdown.style.pointerEvents = 'none';
        }
      });
    });
  }

  document.addEventListener('DOMContentLoaded', initDropdownA11y);

  /* ===== 13. SCROLL PROGRESS BAR ===== */
  function initScrollProgress() {
    const bar = document.getElementById('scroll-progress');
    if (!bar) return;
    window.addEventListener('scroll', () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      if (total <= 0) return;
      bar.style.width = ((window.scrollY / total) * 100) + '%';
    }, { passive: true });
  }
  document.addEventListener('DOMContentLoaded', initScrollProgress);

  /* ===== 14. CUSTOM CURSOR ===== */
  function initCustomCursor() {
    const dot  = document.querySelector('.cursor-dot');
    const ring = document.querySelector('.cursor-ring');
    if (!dot || !ring) return;
    // Skip on touch devices
    if ('ontouchstart' in window) return;

    let mx = -100, my = -100, rx = -100, ry = -100, visible = false;

    document.addEventListener('mousemove', (e) => {
      mx = e.clientX;
      my = e.clientY;
      if (!visible) {
        visible = true;
        dot.style.opacity  = '1';
        ring.style.opacity = '1';
      }
    });

    document.addEventListener('mouseleave', () => {
      visible = false;
      dot.style.opacity  = '0';
      ring.style.opacity = '0';
    });

    // Expand ring on interactive elements
    document.querySelectorAll(
      'a, button, .svc-card, .svc-v2-item, .feature-card, .faq-question, ' +
      '.sd-card, .value-card, .mission-card, .usecase-card, .highlight-item, .voice-card'
    ).forEach(el => {
      el.addEventListener('mouseenter', () => {
        ring.style.width       = '50px';
        ring.style.height      = '50px';
        ring.style.borderColor = 'rgba(168,188,208,0.6)';
        dot.style.transform    = 'translate(-50%, -50%) scale(2)';
      });
      el.addEventListener('mouseleave', () => {
        ring.style.width       = '28px';
        ring.style.height      = '28px';
        ring.style.borderColor = 'rgba(168,188,208,0.35)';
        dot.style.transform    = 'translate(-50%, -50%) scale(1)';
      });
    });

    // Animate ring with lag (RAF loop)
    (function loop() {
      rx += (mx - rx) * 0.13;
      ry += (my - ry) * 0.13;
      dot.style.left  = mx + 'px';
      dot.style.top   = my + 'px';
      ring.style.left = rx + 'px';
      ring.style.top  = ry + 'px';
      requestAnimationFrame(loop);
    })();
  }
  document.addEventListener('DOMContentLoaded', initCustomCursor);

  /* ===== 15. HERO MOUSE PARALLAX ===== */
  function initHeroParallax() {
    const hero    = document.getElementById('hero');
    const content = hero ? hero.querySelector('.hero-content') : null;
    if (!hero || !content) return;
    if ('ontouchstart' in window) return;

    content.style.willChange = 'transform';
    content.style.transition = 'transform 0.7s cubic-bezier(0.25, 0.1, 0.25, 1)';

    hero.addEventListener('mousemove', (e) => {
      const rect = hero.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width  - 0.5) * 16;
      const y = ((e.clientY - rect.top)  / rect.height - 0.5) * 8;
      content.style.transform = `translate(${x}px, ${y}px)`;
    });

    hero.addEventListener('mouseleave', () => {
      content.style.transform = 'translate(0, 0)';
    });
  }
  document.addEventListener('DOMContentLoaded', initHeroParallax);

  /* ===== 16. LINE REVEAL (data-lines) ===== */
  function initLineReveals() {
    const targets = document.querySelectorAll('[data-lines]');
    if (!targets.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.18, rootMargin: '0px 0px -40px 0px' });

    targets.forEach((el) => observer.observe(el));
  }
  document.addEventListener('DOMContentLoaded', initLineReveals);

  /* ===== 17. TAKEOVER PARALLAX ===== */
  function initTakeoverParallax() {
    const bgText = document.querySelector('.takeover-bg-text');
    if (!bgText || 'ontouchstart' in window) return;

    let ticking = false;
    window.addEventListener('scroll', () => {
      if (ticking) return;
      requestAnimationFrame(() => {
        const section = bgText.closest('.takeover-section');
        if (!section) { ticking = false; return; }
        const rect = section.getBoundingClientRect();
        const progress = -rect.top / (rect.height + window.innerHeight);
        const shift = progress * 80;
        bgText.style.transform = `translateX(${shift}px)`;
        ticking = false;
      });
      ticking = true;
    }, { passive: true });
  }
  document.addEventListener('DOMContentLoaded', initTakeoverParallax);

})();
