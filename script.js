/* ═══════════════════════════════════════════════
   DESIGNER.DEV — Portfolio JavaScript
   ═══════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  // ─── CANVAS BACKGROUND ────────────────────────
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let w, h;

  function resizeCanvas() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * w;
      this.y = Math.random() * h;
      this.size = Math.random() * 1.5 + 0.5;
      this.alpha = Math.random() * 0.4 + 0.05;
      this.vx = (Math.random() - 0.5) * 0.2;
      this.vy = (Math.random() - 0.5) * 0.2;
      this.color = Math.random() > 0.7 ? '#c9824a' : Math.random() > 0.5 ? '#8a9a5b' : '#f3eadc';
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > w || this.y < 0 || this.y > h) this.reset();
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = this.alpha;
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  for (let i = 0; i < 120; i++) particles.push(new Particle());

  // Gradient blobs
  const blobs = [
    { x: 0.15, y: 0.15, r: 350, color: 'rgba(138,154,91,0.07)' },
    { x: 0.85, y: 0.8,  r: 400, color: 'rgba(201,130,74,0.06)' },
    { x: 0.5,  y: 0.5,  r: 300, color: 'rgba(216,184,138,0.05)' },
  ];

  function animateCanvas() {
    ctx.clearRect(0, 0, w, h);

    // Draw blobs
    blobs.forEach(b => {
      const grd = ctx.createRadialGradient(b.x * w, b.y * h, 0, b.x * w, b.y * h, b.r);
      grd.addColorStop(0, b.color);
      grd.addColorStop(1, 'transparent');
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, w, h);
    });

    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animateCanvas);
  }
  animateCanvas();

  // ─── CUSTOM CURSOR ────────────────────────────
  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('cursor-follower');
  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top  = mouseY + 'px';
  });

  function animateCursor() {
    followerX += (mouseX - followerX) * 0.12;
    followerY += (mouseY - followerY) * 0.12;
    follower.style.left = followerX + 'px';
    follower.style.top  = followerY + 'px';
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  const hoverTargets = document.querySelectorAll('a, button, .skill-tag, .cert-card, .project-card, input, textarea');
  hoverTargets.forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
  });

  // ─── NAV SCROLL ───────────────────────────────
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
  });

  // ─── MOBILE MENU ─────────────────────────────
  const burger = document.getElementById('burger');
  const mobileMenu = document.getElementById('mobile-menu');

  burger.addEventListener('click', () => {
    burger.classList.toggle('active');
    mobileMenu.classList.toggle('open');
    document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
  });

  document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
      burger.classList.remove('active');
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // ─── SCROLL REVEAL ────────────────────────────
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        entry.target.style.transitionDelay = (i % 4) * 0.08 + 's';
        entry.target.classList.add('in-view');
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  // ─── STAGGERED HERO REVEAL ───────────────────
  const heroItems = document.querySelectorAll('.hero .reveal');
  heroItems.forEach((el, i) => {
    setTimeout(() => {
      el.style.transitionDelay = '0s';
      el.classList.add('in-view');
    }, 200 + i * 150);
  });

  // ─── NAV ACTIVE STATE ─────────────────────────
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.style.color = '';
          if (link.getAttribute('href') === '#' + entry.target.id) {
            link.style.color = 'var(--accent)';
          }
        });
      }
    });
  }, { threshold: 0.5 });

  sections.forEach(s => sectionObserver.observe(s));

  // ─── TILT CARDS ───────────────────────────────
  document.querySelectorAll('.project-card, .stat-card, .cert-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top)  / rect.height - 0.5;
      card.style.transform = `translateY(-6px) perspective(600px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  // ─── TYPING EFFECT (HERO) ────────────────────
  const codeBody = document.querySelector('.code-body');
  if (codeBody) {
    const originalHTML = codeBody.innerHTML;
    codeBody.innerHTML = '';
    let progress = 0;

    function typeCode() {
      if (progress <= originalHTML.length) {
        codeBody.innerHTML = originalHTML.slice(0, progress);
        progress += 3;
        setTimeout(typeCode, 12);
      }
    }

    const codeObs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        typeCode();
        codeObs.disconnect();
      }
    }, { threshold: 0.5 });
    codeObs.observe(codeBody);
  }

  // ─── CONTACT FORM ─────────────────────────────
  const form = document.getElementById('contact-form');
  const formSuccess = document.getElementById('form-success');

  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const originalText = btn.innerHTML;

      btn.innerHTML = '<span>Sending...</span>';
      btn.disabled = true;

      setTimeout(() => {
        btn.innerHTML = originalText;
        btn.disabled = false;
        form.reset();
        formSuccess.classList.add('show');
        setTimeout(() => formSuccess.classList.remove('show'), 5000);
      }, 1500);
    });
  }

  // ─── SMOOTH SCROLL ────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const offset = target.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top: offset, behavior: 'smooth' });
      }
    });
  });

  // ─── SCROLL PROGRESS BAR ─────────────────────
  const progressBar = document.createElement('div');
  progressBar.style.cssText = `
    position: fixed; top: 0; left: 0; height: 2px;
    background: var(--accent); z-index: 10000;
    width: 0%; transition: width 0.1s;
    pointer-events: none;
  `;
  document.body.appendChild(progressBar);

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (scrollTop / docHeight) * 100;
    progressBar.style.width = progress + '%';
  });

  // ─── GLITCH TEXT ON LOGO ─────────────────────
  const logoText = document.querySelector('.logo-text');
  if (logoText) {
    const original = logoText.textContent;
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';

    logoText.closest('.nav-logo').addEventListener('mouseenter', () => {
      let iterations = 0;
      const interval = setInterval(() => {
        logoText.textContent = original.split('').map((char, i) => {
          if (i < iterations) return original[i];
          return char === ' ' ? ' ' : chars[Math.floor(Math.random() * chars.length)];
        }).join('');
        if (iterations >= original.length) clearInterval(interval);
        iterations += 1 / 2;
      }, 30);
    });
  }

});
