/**
 * Dr. Sarah Johnson Clinic — Arabic Edition
 * UI interactions, smooth scroll, scroll reveal, mobile menu, form handler
 */

document.addEventListener('DOMContentLoaded', () => {

  // ===== Smooth Scroll =====
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = anchor.getAttribute('href');
      if (target.length > 1 && document.querySelector(target)) {
        e.preventDefault();
        const el = document.querySelector(target);
        const offset = 90;
        const top = el.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top, behavior: 'smooth' });
        // close mobile menu if open
        const navLinks = document.querySelector('.nav-links');
        if (navLinks && navLinks.classList.contains('active')) {
          navLinks.classList.remove('active');
        }
      }
    });
  });

  // ===== Navbar shadow on scroll =====
  const navbar = document.querySelector('.navbar');
  const onScroll = () => {
    if (!navbar) return;
    if (window.scrollY > 24) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ===== Mobile hamburger toggle =====
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => navLinks.classList.toggle('active'));
    hamburger.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        navLinks.classList.toggle('active');
      }
    });
  }

  // ===== Stats counter animation =====
  const animateCounter = (el) => {
    const text = (el.textContent || '').trim();
    // Detect a leading numeric portion (handles "+5000", "98%", "20 سنة", "20 Years")
    const match = text.match(/^(\+?)(\d+)(.*)$/);
    if (!match) return;
    const prefix = match[1] || '';
    const target = parseInt(match[2], 10);
    const suffix = match[3] || '';
    if (Number.isNaN(target) || target === 0) return;

    const duration = 1600;
    const start = performance.now();
    const update = (now) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      const value = Math.round(target * eased);
      el.textContent = `${prefix}${value}${suffix}`;
      if (t < 1) requestAnimationFrame(update);
      else el.textContent = `${prefix}${target}${suffix}`;
    };
    requestAnimationFrame(update);
  };

  // ===== Reveal-on-scroll =====
  const revealTargets = document.querySelectorAll(
    '.about-card, .service-card, .team-card, .cod-card, .credential-item, .trust-item, .gallery-item, .featured-image-wrapper, .stat-item'
  );
  revealTargets.forEach(el => el.classList.add('reveal'));

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // animate stats numbers when they enter view
        if (entry.target.classList.contains('stat-item')) {
          const num = entry.target.querySelector('.stat-number');
          if (num && !num.dataset.animated) {
            num.dataset.animated = 'true';
            animateCounter(num);
          }
        }
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealTargets.forEach(el => revealObserver.observe(el));

  // ===== Contact form =====
  const form = document.getElementById('appointmentForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const original = btn.textContent;
      btn.disabled = true;
      btn.textContent = '✓ تم الإرسال بنجاح — سنتواصل معك قريباً';
      setTimeout(() => {
        form.reset();
        btn.disabled = false;
        btn.textContent = original;
      }, 3500);
    });
  }

  // ===== Certificate Lightbox =====
  const certLightbox = document.getElementById('certLightbox');
  const certLightboxImg = document.getElementById('certLightboxImg');
  if (certLightbox && certLightboxImg) {
    document.querySelectorAll('.cert-image').forEach(img => {
      img.addEventListener('click', () => {
        certLightboxImg.src = img.src;
        certLightboxImg.alt = img.alt;
        certLightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    });
    certLightbox.addEventListener('click', (e) => {
      if (e.target === certLightbox || e.target.closest('.cert-lightbox-close')) {
        certLightbox.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && certLightbox.classList.contains('active')) {
        certLightbox.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }
});
