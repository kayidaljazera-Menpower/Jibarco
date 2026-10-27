/**
 * JIBARCO - Interactive UI/UX Logic
 * High-performance, lightweight Vanilla JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initMobileMenu();
  initCounters();
  initGallery();
  initContactForm();
  initNewsletter();
  initClipboardCopy();
  initCookieBanner();
  initActiveNavSpy();
  initScrollReveal();
});

/* ==========================================================================
   1. Sticky Header
   ========================================================================== */
function initStickyHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/* ==========================================================================
   2. Mobile Navigation Drawer
   ========================================================================== */
function initMobileMenu() {
  const menuBtn = document.querySelector('.mobile-menu-btn');
  const drawer = document.querySelector('.mobile-nav-drawer');
  const overlay = document.querySelector('.mobile-drawer-overlay');
  const navLinks = document.querySelectorAll('.mobile-nav-link');

  if (!menuBtn || !drawer || !overlay) return;

  const toggleMenu = (open) => {
    drawer.classList.toggle('open', open);
    overlay.classList.toggle('active', open);
    document.body.style.overflow = open ? 'hidden' : '';
    menuBtn.setAttribute('aria-expanded', open);
  };

  menuBtn.addEventListener('click', () => {
    const isOpen = drawer.classList.contains('open');
    toggleMenu(!isOpen);
  });

  overlay.addEventListener('click', () => toggleMenu(false));

  navLinks.forEach(link => {
    link.addEventListener('click', () => toggleMenu(false));
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('open')) {
      toggleMenu(false);
    }
  });
}

/* ==========================================================================
   3. Animated Stat Counters
   ========================================================================== */
function initCounters() {
  const counters = document.querySelectorAll('.stat-number[data-target]');
  if (!counters.length) return;

  const observerOptions = {
    threshold: 0.5
  };

  const startCounting = (el) => {
    const target = parseFloat(el.getAttribute('data-target'));
    const isDecimal = target % 1 !== 0;
    const duration = 1800; // ms
    const frameRate = 60;
    const totalFrames = Math.round((duration / 1000) * frameRate);
    let frame = 0;

    const counterInterval = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      // Ease-out cubic formula
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = target * ease;

      if (isDecimal) {
        el.textContent = current.toFixed(1);
      } else {
        el.textContent = Math.round(current);
      }

      if (frame >= totalFrames) {
        clearInterval(counterInterval);
        el.textContent = isDecimal ? target.toFixed(1) : target;
      }
    }, 1000 / frameRate);
  };

  const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        startCounting(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  counters.forEach(counter => counterObserver.observe(counter));
}

/* ==========================================================================
   4. Vision & Project Gallery (Filters & Lightbox)
   ========================================================================== */
function initGallery() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');

  // Filter functionality
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      galleryItems.forEach(item => {
        const category = item.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          item.style.display = 'block';
          item.style.animation = 'fadeIn 0.4s ease forwards';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  // Lightbox functionality
  if (lightbox && lightboxImg && lightboxCaption) {
    galleryItems.forEach(item => {
      item.addEventListener('click', () => {
        const img = item.querySelector('img');
        const title = item.querySelector('.gallery-title');
        if (img) {
          lightboxImg.src = img.src;
          lightboxImg.alt = img.alt || 'JIBARCO Project';
          lightboxCaption.textContent = title ? title.textContent : '';
          lightbox.classList.add('active');
          document.body.style.overflow = 'hidden';
        }
      });
    });

    const closeLightbox = () => {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    };

    if (lightboxClose) {
      lightboxClose.addEventListener('click', closeLightbox);
    }

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('active')) {
        closeLightbox();
      }
    });
  }
}

/* ==========================================================================
   5. Interactive Contact Form with Validation & Feedback
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const fileInput = document.getElementById('contact-file');
  const fileStatus = document.getElementById('file-status');
  const submitBtn = document.getElementById('contact-submit-btn');

  if (fileInput && fileStatus) {
    fileInput.addEventListener('change', () => {
      if (fileInput.files.length > 0) {
        const names = Array.from(fileInput.files).map(f => f.name).join(', ');
        fileStatus.textContent = `Attached: ${names}`;
        fileStatus.style.display = 'block';
      } else {
        fileStatus.textContent = '';
        fileStatus.style.display = 'none';
      }
    });
  }

  if (form && submitBtn) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = form.querySelector('[name="name"]');
      const emailInput = form.querySelector('[name="email"]');
      const messageInput = form.querySelector('[name="message"]');

      if (!nameInput.value.trim() || !emailInput.value.trim() || !messageInput.value.trim()) {
        showToast('Please fill out all required fields.', 'error');
        return;
      }

      // Show loading state
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg class="spinner" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" style="animation: spin 0.8s linear infinite;">
          <circle cx="12" cy="12" r="10" stroke-dasharray="32" stroke-dashoffset="12"></circle>
        </svg> Sending Message...
      `;

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        form.reset();
        if (fileStatus) fileStatus.textContent = '';

        showToast('Thank you! Your message has been sent successfully. We will get in touch shortly.', 'success');
      }, 1200);
    });
  }
}

/* ==========================================================================
   6. Newsletter Subscription
   ========================================================================== */
function initNewsletter() {
  const form = document.getElementById('newsletter-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const emailInput = form.querySelector('input[type="email"]');
    if (!emailInput || !emailInput.value.trim()) return;

    showToast('Subscribed! Thank you for staying updated with JIBARCO.', 'success');
    form.reset();
  });
}

/* ==========================================================================
   7. Copy to Clipboard Utility
   ========================================================================== */
function initClipboardCopy() {
  const copyButtons = document.querySelectorAll('[data-copy]');
  copyButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const textToCopy = btn.getAttribute('data-copy');
      if (!textToCopy) return;

      navigator.clipboard.writeText(textToCopy).then(() => {
        showToast(`Copied "${textToCopy}" to clipboard!`, 'success');
      }).catch(() => {
        // Fallback
        showToast(`Email: ${textToCopy}`, 'info');
      });
    });
  });
}

/* ==========================================================================
   8. Cookie Banner
   ========================================================================== */
function initCookieBanner() {
  const banner = document.getElementById('cookie-banner');
  const acceptBtn = document.getElementById('cookie-accept');
  const declineBtn = document.getElementById('cookie-decline');

  if (!banner) return;

  const cookieConsent = localStorage.getItem('jibarco_cookie_consent');
  if (!cookieConsent) {
    setTimeout(() => {
      banner.classList.add('show');
    }, 1500);
  }

  if (acceptBtn) {
    acceptBtn.addEventListener('click', () => {
      localStorage.setItem('jibarco_cookie_consent', 'accepted');
      banner.classList.remove('show');
      showToast('Cookies accepted. Welcome to JIBARCO.', 'info');
    });
  }

  if (declineBtn) {
    declineBtn.addEventListener('click', () => {
      localStorage.setItem('jibarco_cookie_consent', 'declined');
      banner.classList.remove('show');
    });
  }
}

/* ==========================================================================
   9. Active Navigation Spy on Scroll
   ========================================================================== */
function initActiveNavSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link[href^="#"], .mobile-nav-link[href^="#"]');

  if (!sections.length || !navLinks.length) return;

  const highlightNav = () => {
    const scrollPos = window.scrollY + 120;

    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      const id = sec.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', highlightNav, { passive: true });
}

/* ==========================================================================
   10. Global Toast System
   ========================================================================== */
function showToast(message, type = 'info') {
  let toast = document.getElementById('global-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'global-toast';
    toast.className = 'toast-notification';
    document.body.appendChild(toast);
  }

  const iconSvg = type === 'success' ? `
    <svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
      <path d="M20 6L9 17l-5-5"></path>
    </svg>
  ` : `
    <svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="12" y1="8" x2="12" y2="12"></line>
      <line x1="12" y1="16" x2="12.01" y2="16"></line>
    </svg>
  `;

  toast.innerHTML = `${iconSvg} <span>${message}</span>`;
  toast.classList.add('show');

  if (window.toastTimeout) {
    clearTimeout(window.toastTimeout);
  }

  window.toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 4000);
}

/* ==========================================================================
   11. Smooth Scroll-Reveal Animation Engine
   ========================================================================== */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal');
  if (!revealElements.length) return;

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));
}

// Keyframes style helper for dynamic spinner
const style = document.createElement('style');
style.textContent = `
  @keyframes spin { 100% { transform: rotate(360deg); } }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
`;
document.head.appendChild(style);
