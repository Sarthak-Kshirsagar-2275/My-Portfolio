

(function () {
  'use strict';

  // Wait for complete DOM readiness
  document.addEventListener('DOMContentLoaded', initializePortfolio);

  function initializePortfolio() {
    initLiveClock();
    initHeaderScroll();
    initMobileNavigation();
    initScrollSpy();
    initEmailClipboard();
    initHeroScrollExit();
    initSkillRollupPopup();
    initSkillMasterDirectory();
    initProjectFilters();
    initStickyProjectStack();
    initProjectBlueprintToggles();
    initLusionSection4Stage();
    initContactFormConsole();
    initFooterYear();
    initAntigravityBackground();
    initFramerScrollReveals();
  }

  /**
   * 01. LIVE CLOCK (IST)
   */
  function initLiveClock() {
    const clockElement = document.getElementById('live-clock');
    if (!clockElement) return;

    function renderTime() {
      try {
        const options = {
          timeZone: 'Asia/Kolkata',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true
        };
        const formatter = new Intl.DateTimeFormat('en-IN', options);
        clockElement.textContent = formatter.format(new Date()) + ' IST';
      } catch (err) {
        const fallback = new Date();
        clockElement.textContent = fallback.toLocaleTimeString() + ' Local';
      }
    }

    renderTime();
    setInterval(renderTime, 1000);
  }

  /**
   * 02. STICKY HEADER SCROLL DETECTION
   * Adds elevation shadow and boundary border when user scrolls
   */
  function initHeaderScroll() {
    const header = document.getElementById('site-header');
    if (!header) return;

    let ticking = false;

    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(function () {
          if (window.scrollY > 20) {
            header.classList.add('is-scrolled');
          } else {
            header.classList.remove('is-scrolled');
          }
          ticking = false;
        });
        ticking = true;
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /**
   * 03. MOBILE NAVIGATION ACCORDION
   * Clean accessible overlay menu with outside-click collapse
   */
  function initMobileNavigation() {
    const trigger = document.getElementById('mobile-menu-trigger');
    const nav = document.getElementById('primary-nav');
    if (!trigger || !nav) return;

    trigger.addEventListener('click', function (e) {
      e.stopPropagation();
      const isOpen = nav.classList.toggle('is-open');
      trigger.setAttribute('aria-expanded', String(isOpen));
      trigger.classList.toggle('is-active', isOpen);
    });

    nav.querySelectorAll('.nav-anchor').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('is-open');
        trigger.setAttribute('aria-expanded', 'false');
        trigger.classList.remove('is-active');
      });
    });

    document.addEventListener('click', function (e) {
      if (nav.classList.contains('is-open')) {
        if (!nav.contains(e.target) && !trigger.contains(e.target)) {
          nav.classList.remove('is-open');
          trigger.setAttribute('aria-expanded', 'false');
          trigger.classList.remove('is-active');
        }
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        nav.classList.remove('is-open');
        trigger.setAttribute('aria-expanded', 'false');
        trigger.classList.remove('is-active');
        trigger.focus();
      }
    });
  }

  /**
   * 04. SCROLL SPY (ACTIVE NAV ANCHOR TRACKING)
   * Uses IntersectionObserver for performant section visibility tracking
   */
  function initScrollSpy() {
    const navAnchors = document.querySelectorAll('.nav-anchor');
    const observedSections = document.querySelectorAll('section[id]');
    if (!navAnchors.length || !observedSections.length) return;

    if (!('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            const currentId = entry.target.id;
            navAnchors.forEach(function (anchor) {
              const href = anchor.getAttribute('href');
              if (href === '#' + currentId) {
                anchor.classList.add('is-active');
              } else {
                anchor.classList.remove('is-active');
              }
            });
          }
        });
      },
      {
        root: null,
        rootMargin: '-20% 0px -70% 0px',
        threshold: 0
      }
    );

    observedSections.forEach(function (section) {
      observer.observe(section);
    });
  }

  /**
   * 05. COPY EMAIL TO CLIPBOARD WITH TOAST FEEDBACK
   * Interactive utility with graceful fallback
   */
  function initEmailClipboard() {
    const copyBtns = [
      document.getElementById('header-copy-email'),
      document.getElementById('inline-copy-email')
    ];
    const emailToCopy = 'sarthak.v.k.2275@gmail.com';

    copyBtns.forEach(function (btn) {
      if (!btn) return;

      btn.addEventListener('click', function () {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard
            .writeText(emailToCopy)
            .then(function () {
              showToast('Email address copied to clipboard!');
            })
            .catch(function () {
              fallbackCopyText(emailToCopy);
            });
        } else {
          fallbackCopyText(emailToCopy);
        }
      });
    });

    function fallbackCopyText(text) {
      const tempTextArea = document.createElement('textarea');
      tempTextArea.value = text;
      tempTextArea.style.position = 'fixed';
      tempTextArea.style.top = '0';
      tempTextArea.style.left = '0';
      tempTextArea.style.opacity = '0';
      document.body.appendChild(tempTextArea);
      tempTextArea.focus();
      tempTextArea.select();
      try {
        document.execCommand('copy');
        showToast('Email address copied to clipboard!');
      } catch (err) {
        showToast('Email: ' + text);
      }
      document.body.removeChild(tempTextArea);
    }
  }

  let toastTimeout = null;
  function showToast(message) {
    const toast = document.getElementById('floating-toast');
    if (!toast) return;

    const messageEl = toast.querySelector('.toast-message');
    if (messageEl) messageEl.textContent = message;

    toast.classList.add('is-visible');
    toast.setAttribute('aria-hidden', 'false');

    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(function () {
      toast.classList.remove('is-visible');
      toast.setAttribute('aria-hidden', 'true');
    }, 3200);
  }

  /**
   * 06. 3D ROLL-UP SPINNING SKILL POPUP MODAL
   */
  let openSkillPopupForCard = null;

  function initSkillRollupPopup() {
    const overlay = document.getElementById('skill-popup-overlay');
    const popupCard = document.getElementById('skill-popup-card');
    const popupContent = document.getElementById('skill-popup-content');
    const closeBtn = document.getElementById('skill-popup-close');
    const cards = document.querySelectorAll('.stack-card');

    if (!overlay || !popupCard || !popupContent || !closeBtn) return;

    // Ensure popup is hidden by default on page load
    overlay.setAttribute('hidden', '');
    overlay.classList.remove('is-active', 'is-opening', 'is-closing');

    let lastFocusedElement = null;
    let isClosing = false;

    function setBackgroundInert(makeInert) {
      const topLevelNodes = document.querySelectorAll(
        '.telemetry-bar, .site-header, .site-footer, main > section:not(#stack), #stack > .section-container'
      );
      topLevelNodes.forEach(function (node) {
        if (makeInert) {
          node.setAttribute('inert', '');
          node.setAttribute('aria-hidden', 'true');
        } else {
          node.removeAttribute('inert');
          node.removeAttribute('aria-hidden');
        }
      });
    }

    function openPopup(card, highlightedSkillText) {
      if (!card || isClosing) return;

      lastFocusedElement = document.activeElement;

      const badgeStrip = card.querySelector('.stack-badge-strip');
      const titleEl = card.querySelector('.stack-domain-title');
      const descEl = card.querySelector('.stack-domain-desc');
      const chipsEl = card.querySelector('.prominent-chips');
      const trayInner = card.querySelector('.tray-inner');

      popupContent.innerHTML = '';

      if (badgeStrip) {
        popupContent.appendChild(badgeStrip.cloneNode(true));
      }
      if (titleEl) {
        const clonedTitle = titleEl.cloneNode(true);
        clonedTitle.id = 'popup-domain-title';
        popupContent.appendChild(clonedTitle);
      }
      if (descEl) {
        popupContent.appendChild(descEl.cloneNode(true));
      }
      if (chipsEl) {
        const clonedChips = chipsEl.cloneNode(true);
        if (highlightedSkillText) {
          clonedChips.querySelectorAll('.tech-chip').forEach(function (chip) {
            if (chip.textContent.trim().toLowerCase() === highlightedSkillText.trim().toLowerCase()) {
              chip.classList.add('is-selected-skill');
            }
          });
        }
        popupContent.appendChild(clonedChips);
      }
      if (trayInner) {
        popupContent.appendChild(trayInner.cloneNode(true));
      }

      // Activate modal layer & lock background interaction
      overlay.removeAttribute('hidden');
      document.body.classList.add('skill-modal-open');
      setBackgroundInert(true);

      // Trigger roll-up spin animation
      overlay.classList.remove('is-closing');
      overlay.classList.add('is-active', 'is-opening');
      popupCard.scrollTop = 0;

      setTimeout(function () {
        closeBtn.focus();
      }, 60);
    }

    function closePopup() {
      if (overlay.hasAttribute('hidden') || isClosing) return;
      isClosing = true;

      overlay.classList.remove('is-opening');
      overlay.classList.add('is-closing');
      overlay.classList.remove('is-active');

      setTimeout(function () {
        overlay.setAttribute('hidden', '');
        overlay.classList.remove('is-closing');
        document.body.classList.remove('skill-modal-open');
        setBackgroundInert(false);
        isClosing = false;

        if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
          lastFocusedElement.focus();
        }
      }, 360);
    }

    openSkillPopupForCard = openPopup;

    cards.forEach(function (card) {
      card.addEventListener('click', function () {
        openPopup(card);
      });

      card.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openPopup(card);
        }
      });
    });

    // Close via top-right cross (×) button
    closeBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      closePopup();
    });

    // Close when clicking outside the popup card on the backdrop
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) {
        closePopup();
      }
    });

    // Close on Escape key and trap Tab focus inside the popup layer
    document.addEventListener('keydown', function (e) {
      if (overlay.hasAttribute('hidden')) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        closePopup();
        return;
      }

      if (e.key === 'Tab') {
        const focusable = popupCard.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

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

  /**
   * 07. MASTER SKILL DIRECTORY & DOMAIN FILTERING
   * Lets visitors filter by domain or click any of the 23 skill pills to spin open its card popup
   */
  function initSkillMasterDirectory() {
    const filterBtns = document.querySelectorAll('.skill-filter-btn');
    const skillPills = document.querySelectorAll('.master-skill-pill');
    const stackCards = document.querySelectorAll('.stack-card');

    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        const targetFilter = btn.getAttribute('data-skill-filter');

        filterBtns.forEach(function (b) {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');

        skillPills.forEach(function (pill) {
          const pillCard = pill.getAttribute('data-target-card');
          if (targetFilter === 'all' || pillCard === targetFilter) {
            pill.removeAttribute('hidden');
          } else {
            pill.setAttribute('hidden', '');
          }
        });

        stackCards.forEach(function (card) {
          if (targetFilter === 'all' || card.id === targetFilter) {
            card.removeAttribute('hidden');
          } else {
            card.setAttribute('hidden', '');
          }
        });
      });
    });

    skillPills.forEach(function (pill) {
      pill.addEventListener('click', function () {
        const targetCardId = pill.getAttribute('data-target-card');
        const targetCard = document.getElementById(targetCardId);
        if (!targetCard) return;

        skillPills.forEach(function (p) {
          p.classList.remove('is-highlighted');
        });
        pill.classList.add('is-highlighted');

        if (typeof openSkillPopupForCard === 'function') {
          openSkillPopupForCard(targetCard, pill.textContent);
        }
      });
    });
  }

  /**
   * 08. PROJECT CATEGORY QUICK FILTER
   * Filters projects by engineering domain with fluid opacity transition
   */
  function initProjectFilters() {
    const filterTabs = document.querySelectorAll('.filter-tab');
    const projectCards = document.querySelectorAll('.exhibition-card');
    if (!filterTabs.length || !projectCards.length) return;

    filterTabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        const filterValue = tab.getAttribute('data-filter');

        filterTabs.forEach(function (t) {
          t.classList.remove('active');
          t.setAttribute('aria-selected', 'false');
        });
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');

        projectCards.forEach(function (card) {
          const cardCategory = card.getAttribute('data-category');
          if (filterValue === 'all' || cardCategory === filterValue) {
            card.style.display = 'block';
            setTimeout(function () {
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            }, 10);
          } else {
            card.style.opacity = '0';
            card.style.transform = 'translateY(8px)';
            setTimeout(function () {
              card.style.display = 'none';
            }, 200);
          }
        });
      });
    });
  }

  /**
   * 09. PROJECT TECHNICAL BLUEPRINT TOGGLES
   */
  function initProjectBlueprintToggles() {
    const toggleButtons = document.querySelectorAll('.specs-toggle-btn');

    toggleButtons.forEach(function (btn) {
      const targetId = btn.getAttribute('data-target');
      const targetEl = document.getElementById(targetId);
      if (!targetEl) return;

      btn.addEventListener('click', function () {
        const isExpanded = btn.getAttribute('aria-expanded') === 'true';
        const sign = btn.querySelector('.toggle-sign');

        if (isExpanded) {
          btn.setAttribute('aria-expanded', 'false');
          targetEl.setAttribute('hidden', '');
          if (sign) {
            sign.textContent = '+';
            sign.style.transform = 'rotate(0deg)';
          }
        } else {
          btn.setAttribute('aria-expanded', 'true');
          targetEl.removeAttribute('hidden');
          if (sign) {
            sign.textContent = '−';
            sign.style.transform = 'rotate(180deg)';
          }
        }
      });
    });
  }

  /**
   * 10. DIRECT CONTACT FORM CONSOLE
   * Client-side validation, error messaging, and simulated response lifecycle
   * Ensures the green tick confirmation banner ONLY appears after valid submission
   */
  function initContactFormConsole() {
    const form = document.getElementById('portfolio-contact-form');
    if (!form) return;

    const nameInput = document.getElementById('contact-name');
    const emailInput = document.getElementById('contact-email');
    const messageInput = document.getElementById('contact-message');
    const submitBtn = document.getElementById('contact-submit-btn');
    const feedbackBanner = document.getElementById('form-feedback-banner');

    const errName = document.getElementById('error-name');
    const errEmail = document.getElementById('error-email');
    const errMessage = document.getElementById('error-message');

    // Explicitly ensure the green tick confirmation is hidden on initial load
    if (feedbackBanner) {
      feedbackBanner.classList.remove('is-visible');
      feedbackBanner.setAttribute('hidden', '');
    }

    function validateEmail(email) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(String(email).toLowerCase());
    }

    // Clear individual errors on input and hide previous submission banner when user types again
    [nameInput, emailInput, messageInput].forEach(function (input) {
      if (!input) return;
      input.addEventListener('input', function () {
        const errorEl = document.getElementById('error-' + input.name);
        if (errorEl) errorEl.textContent = '';
        if (feedbackBanner && feedbackBanner.classList.contains('is-visible')) {
          feedbackBanner.classList.remove('is-visible');
          feedbackBanner.setAttribute('hidden', '');
        }
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      // Hide confirmation banner during validation / re-submission
      if (feedbackBanner) {
        feedbackBanner.classList.remove('is-visible');
        feedbackBanner.setAttribute('hidden', '');
      }

      let isValid = true;

      // Validate Name
      if (!nameInput.value.trim()) {
        errName.textContent = 'Please provide your name or organization.';
        isValid = false;
      } else if (nameInput.value.trim().length < 2) {
        errName.textContent = 'Name should be at least 2 characters long.';
        isValid = false;
      } else {
        errName.textContent = '';
      }

      // Validate Email
      if (!emailInput.value.trim()) {
        errEmail.textContent = 'An email address is required for follow-up.';
        isValid = false;
      } else if (!validateEmail(emailInput.value.trim())) {
        errEmail.textContent = 'Please enter a valid email format (e.g. name@domain.com).';
        isValid = false;
      } else {
        errEmail.textContent = '';
      }

      // Validate Message
      if (!messageInput.value.trim()) {
        errMessage.textContent = 'Please enter a brief project overview or message.';
        isValid = false;
      } else if (messageInput.value.trim().length < 8) {
        errMessage.textContent = 'Message is too brief. Please provide a little more context.';
        isValid = false;
      } else {
        errMessage.textContent = '';
      }

      if (!isValid) return;

      // Simulate submission state
      const originalBtnHTML = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span>Transmitting...</span>';

      setTimeout(function () {
        submitBtn.innerHTML = '<span>Message Dispatched ✓</span>';
        if (feedbackBanner) {
          feedbackBanner.removeAttribute('hidden');
          feedbackBanner.classList.add('is-visible');
        }

        // Reset inputs
        form.reset();
        showToast('Message transmitted! Sarthak will follow up soon.');

        setTimeout(function () {
          submitBtn.innerHTML = originalBtnHTML;
          submitBtn.disabled = false;
        }, 3500);
      }, 900);
    });
  }

  /**
   * 11. FOOTER DYNAMIC YEAR
   */
  function initFooterYear() {
    const yearEl = document.getElementById('current-year');
    if (yearEl) {
      yearEl.textContent = new Date().getFullYear();
    }
  }

  /**
   * 12. ANTI-GRAVITY INSPIRED SPATIAL PHYSICS BACKGROUND CANVAS
   * Richer, darker weightless geometric primitives + HTML, CSS, JS, and Python tech badges
   * with zero-gravity upward drift, scroll-velocity inertia, and damped spring cursor repulsion.
   */
  function initAntigravityBackground() {
    const canvas = document.getElementById('ambient-bg-canvas');
    if (!canvas) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    // Darker, richer warm editorial & tech palette so shapes are clearly visible
    const palette = [
      { stroke: 'rgba(118, 62, 22, 0.46)', fill: 'rgba(168, 108, 59, 0.12)' }, // Deep Caramel
      { stroke: 'rgba(54, 42, 30, 0.42)',  fill: 'rgba(54, 42, 30, 0.09)' },   // Dark Espresso
      { stroke: 'rgba(42, 94, 52, 0.44)',  fill: 'rgba(63, 123, 73, 0.11)' },  // Forest Sage
      { stroke: 'rgba(136, 68, 28, 0.45)', fill: 'rgba(140, 82, 48, 0.11)' },  // Rich Terracotta
      { stroke: 'rgba(78, 60, 44, 0.40)',  fill: 'rgba(102, 91, 76, 0.09)' }   // Warm Bronze
    ];

    // Kept all existing shapes + added HTML, CSS, JS, Python, code glyphs, hexagons & triangles
    const shapes = [
      'ring',
      'pill',
      'cross',
      'dot',
      'diamond',
      'hexagon',
      'triangle',
      'html',
      'css',
      'js',
      'python',
      'code_tag',
      'code_braces'
    ];
    const particles = [];

    const pointer = {
      x: -9999,
      y: -9999,
      vx: 0,
      vy: 0,
      active: false
    };

    let lastScrollY = window.scrollY;
    let scrollVelocity = 0;

    function resizeCanvas() {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function createParticles() {
      particles.length = 0;
      // Increased density so floating geometric & tech shapes populate the screen richly
      const count = Math.max(48, Math.min(86, Math.floor((width * height) / 16500)));

      for (let i = 0; i < count; i++) {
        const shapeType = shapes[i % shapes.length];
        const isTechBadge =
          shapeType === 'html' ||
          shapeType === 'css' ||
          shapeType === 'js' ||
          shapeType === 'python' ||
          shapeType === 'code_tag' ||
          shapeType === 'code_braces';

        const size = isTechBadge ? 14 + Math.random() * 8 : 8 + Math.random() * 17;
        const colorPair = palette[i % palette.length];

        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          // Spring offset displacement (Framer-Motion spring state)
          ox: 0,
          oy: 0,
          vx: 0,
          vy: 0,
          // Natural weightless anti-gravity upward drift
          driftX: (Math.random() - 0.5) * 0.32,
          driftY: -(0.22 + Math.random() * 0.46),
          size: size,
          // Keep tech badges mostly upright with gentle tilt oscillation
          angle: isTechBadge ? (Math.random() - 0.5) * 0.35 : Math.random() * Math.PI * 2,
          spinSpeed: isTechBadge ? (Math.random() - 0.5) * 0.0025 : (Math.random() - 0.5) * 0.009,
          isTechBadge: isTechBadge,
          shape: shapeType,
          stroke: colorPair.stroke,
          fill: colorPair.fill,
          depth: 0.45 + Math.random() * 0.85
        });
      }
    }

    resizeCanvas();
    createParticles();

    window.addEventListener('resize', function () {
      resizeCanvas();
      createParticles();
    });

    window.addEventListener(
      'mousemove',
      function (e) {
        pointer.vx = e.clientX - pointer.x;
        pointer.vy = e.clientY - pointer.y;
        pointer.x = e.clientX;
        pointer.y = e.clientY;
        pointer.active = true;
      },
      { passive: true }
    );

    window.addEventListener(
      'mouseleave',
      function () {
        pointer.active = false;
        pointer.x = -9999;
        pointer.y = -9999;
      },
      { passive: true }
    );

    window.addEventListener(
      'scroll',
      function () {
        const currentY = window.scrollY;
        const delta = currentY - lastScrollY;
        scrollVelocity = Math.max(-20, Math.min(20, delta * 0.16));
        lastScrollY = currentY;
      },
      { passive: true }
    );

    function drawRoundedRectPath(w, h, r) {
      const radius = Math.min(r, w / 2, h / 2);
      ctx.beginPath();
      ctx.moveTo(-w / 2 + radius, -h / 2);
      ctx.lineTo(w / 2 - radius, -h / 2);
      ctx.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + radius);
      ctx.lineTo(w / 2, h / 2 - radius);
      ctx.quadraticCurveTo(w / 2, h / 2, w / 2 - radius, h / 2);
      ctx.lineTo(-w / 2 + radius, h / 2);
      ctx.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - radius);
      ctx.lineTo(-w / 2, -h / 2 + radius);
      ctx.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + radius, -h / 2);
      ctx.closePath();
    }

    function drawTechChip(label, w, h, strokeColor, fillColor, fontSize) {
      drawRoundedRectPath(w, h, 6);
      ctx.fillStyle = fillColor;
      ctx.fill();
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = 1.6;
      ctx.stroke();

      ctx.fillStyle = strokeColor;
      ctx.font = '600 ' + fontSize + 'px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(label, 0, 0.5);
    }

    function renderFrame() {
      ctx.clearRect(0, 0, width, height);

      // Decay scroll impulse smoothly
      scrollVelocity *= 0.92;

      const interactionRadius = 165;
      const springStiffness = 0.036;
      const springDamping = 0.86;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Weightless upward anti-gravity motion + subtle scroll parallax
        p.x += p.driftX * p.depth;
        p.y += p.driftY * p.depth - scrollVelocity * p.depth * 0.48;

        if (p.isTechBadge) {
          p.angle += p.spinSpeed;
          if (p.angle > 0.38 || p.angle < -0.38) {
            p.spinSpeed = -p.spinSpeed;
          }
        } else {
          p.angle += p.spinSpeed;
        }

        // Wrap seamlessly around viewport edges
        const margin = 48;
        if (p.y < -margin) p.y = height + margin;
        if (p.y > height + margin) p.y = -margin;
        if (p.x < -margin) p.x = width + margin;
        if (p.x > width + margin) p.x = -margin;

        // Cursor anti-gravity repulsion force
        const renderX = p.x + p.ox;
        const renderY = p.y + p.oy;
        const dx = renderX - pointer.x;
        const dy = renderY - pointer.y;
        const distSq = dx * dx + dy * dy;

        if (pointer.active && distSq < interactionRadius * interactionRadius && distSq > 1) {
          const dist = Math.sqrt(distSq);
          const force = (1 - dist / interactionRadius) * 1.65 * p.depth;
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
          if (!p.isTechBadge) {
            p.angle += 0.014 * force;
          }
        }

        // Spring physics restoring offset back to (0, 0)
        p.vx += -p.ox * springStiffness;
        p.vy += -p.oy * springStiffness;
        p.vx *= springDamping;
        p.vy *= springDamping;
        p.ox += p.vx;
        p.oy += p.vy;

        const finalX = p.x + p.ox;
        const finalY = p.y + p.oy;

        // Draw visible constellation lines between nearby floating elements
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const nx = finalX - (p2.x + p2.ox);
          const ny = finalY - (p2.y + p2.oy);
          const ndSq = nx * nx + ny * ny;
          if (ndSq < 145 * 145) {
            const alpha = (1 - Math.sqrt(ndSq) / 145) * 0.16;
            ctx.strokeStyle = 'rgba(112, 64, 28, ' + alpha.toFixed(3) + ')';
            ctx.lineWidth = 1.15;
            ctx.beginPath();
            ctx.moveTo(finalX, finalY);
            ctx.lineTo(p2.x + p2.ox, p2.y + p2.oy);
            ctx.stroke();
          }
        }

        ctx.save();
        ctx.translate(finalX, finalY);
        ctx.rotate(p.angle);
        ctx.strokeStyle = p.stroke;
        ctx.fillStyle = p.stroke;
        ctx.lineWidth = 1.75;

        if (p.shape === 'ring') {
          ctx.beginPath();
          ctx.arc(0, 0, p.size * 0.58, 0, Math.PI * 2);
          ctx.fillStyle = p.fill;
          ctx.fill();
          ctx.stroke();
        } else if (p.shape === 'pill') {
          drawRoundedRectPath(p.size * 1.55, p.size * 0.66, p.size * 0.33);
          ctx.fillStyle = p.fill;
          ctx.fill();
          ctx.stroke();
        } else if (p.shape === 'cross') {
          const arm = p.size * 0.48;
          ctx.beginPath();
          ctx.moveTo(-arm, 0);
          ctx.lineTo(arm, 0);
          ctx.moveTo(0, -arm);
          ctx.lineTo(0, arm);
          ctx.stroke();
        } else if (p.shape === 'diamond') {
          const r = p.size * 0.56;
          ctx.beginPath();
          ctx.moveTo(0, -r);
          ctx.lineTo(r, 0);
          ctx.lineTo(0, r);
          ctx.lineTo(-r, 0);
          ctx.closePath();
          ctx.fillStyle = p.fill;
          ctx.fill();
          ctx.stroke();
        } else if (p.shape === 'hexagon') {
          const r = p.size * 0.55;
          ctx.beginPath();
          for (let k = 0; k < 6; k++) {
            const a = (Math.PI / 3) * k;
            const hx = Math.cos(a) * r;
            const hy = Math.sin(a) * r;
            if (k === 0) ctx.moveTo(hx, hy);
            else ctx.lineTo(hx, hy);
          }
          ctx.closePath();
          ctx.fillStyle = p.fill;
          ctx.fill();
          ctx.stroke();
        } else if (p.shape === 'triangle') {
          const r = p.size * 0.58;
          ctx.beginPath();
          ctx.moveTo(0, -r);
          ctx.lineTo(r * 0.88, r * 0.65);
          ctx.lineTo(-r * 0.88, r * 0.65);
          ctx.closePath();
          ctx.fillStyle = p.fill;
          ctx.fill();
          ctx.stroke();
        } else if (p.shape === 'html') {
          drawTechChip('</> HTML', 62, 22, p.stroke, p.fill, 10);
        } else if (p.shape === 'css') {
          drawTechChip('{ } CSS', 56, 22, p.stroke, p.fill, 10);
        } else if (p.shape === 'js') {
          drawTechChip('JS ()', 46, 22, p.stroke, p.fill, 10.5);
        } else if (p.shape === 'python') {
          drawTechChip('PY def:', 56, 22, p.stroke, p.fill, 10);
        } else if (p.shape === 'code_tag') {
          drawTechChip('</>', 34, 20, p.stroke, p.fill, 10.5);
        } else if (p.shape === 'code_braces') {
          drawTechChip('{ }', 34, 20, p.stroke, p.fill, 10.5);
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, Math.max(2.8, p.size * 0.25), 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }

      window.requestAnimationFrame(renderFrame);
    }

    window.requestAnimationFrame(renderFrame);
  }

  /**
   * 13. FRAMER-MOTION STYLE SCROLL REVEAL ENGINE
   * Sections, headings, paragraphs, and cards start hidden below their resting position
   * and smoothly rise up into view with staggered spring timing as the user scrolls down.
   */
  function initFramerScrollReveals() {
    if (!('IntersectionObserver' in window)) return;

    // Text elements that rise up cleanly
    const textSelectors = [
      '.section-eyebrow',
      '.section-title',
      '.section-description',
      '.hero-display-title',
      '.hero-lead-copy',
      '.pill-badge-row',
      '.hero-cta-group',
      '.skills-overview-header',
      '.footer-brand-col',
      '.footer-links-col',
      '.footer-meta-col'
    ];

    // Cards and structural blocks that rise up with subtle scale & blur clearing
    const blockSelectors = [
      '.metric-box',
      '.hero-hud-card',
      '.filter-tab-bar',
      '.skills-master-overview',
      '.stack-card',
      '.value-block',
      '.academic-spotlight-card',
      '.curriculum-pillar',
      '.contact-direct-col',
      '.contact-form-col'
    ];

    const allTargets = [];

    textSelectors.forEach(function (sel) {
      document.querySelectorAll(sel).forEach(function (el) {
        el.classList.add('fm-text-rise');
        allTargets.push(el);
      });
    });

    blockSelectors.forEach(function (sel) {
      document.querySelectorAll(sel).forEach(function (el) {
        el.classList.add('fm-reveal');
        allTargets.push(el);
      });
    });

    // Assign stagger delays to sibling items inside grids/containers
    const staggerContainers = document.querySelectorAll(
      '.metrics-grid, .skills-card-matrix, .values-grid, .curriculum-grid, .contact-grid, .footer-container'
    );
    staggerContainers.forEach(function (container) {
      Array.from(container.children).forEach(function (child, index) {
        child.style.setProperty('--fm-delay', index * 95 + 'ms');
      });
    });

    // Also stagger hero elements so the opening feels choreographed
    const heroSequence = [
      '.pill-badge-row',
      '.hero-display-title',
      '.hero-lead-copy',
      '.hero-cta-group',
      '.hero-hud-card'
    ];
    heroSequence.forEach(function (sel, idx) {
      const el = document.querySelector(sel);
      if (el) {
        el.style.setProperty('--fm-delay', idx * 85 + 'ms');
      }
    });

    const revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-inview');
          } else if (entry.boundingClientRect.top > 0) {
            // Reset elements below the viewport so scrolling back down replays the upward rise
            entry.target.classList.remove('is-inview');
          }
        });
      },
      {
        root: null,
        rootMargin: '0px 0px -8% 0px',
        threshold: 0.08
      }
    );

    allTargets.forEach(function (el) {
      revealObserver.observe(el);
    });
  }

  /**
   * 14. STICKY STACKING PROJECT CARDS SCROLL ENGINE
   * Scales and shades underlying project cards as the next card slides up on top of them.
   */
  function initStickyProjectStack() {
    const cards = Array.from(document.querySelectorAll('.exhibition-card'));
    if (!cards.length) return;

    let ticking = false;

    function updateStackDepth() {
      const visibleCards = cards.filter(function (c) {
        return c.style.display !== 'none';
      });

      for (let i = 0; i < visibleCards.length; i++) {
        const card = visibleCards[i];
        const nextCard = visibleCards[i + 1];
        if (!nextCard) {
          card.style.setProperty('--stack-scale', '1');
          card.style.setProperty('--stack-brightness', '1');
          continue;
        }

        const cardRect = card.getBoundingClientRect();
        const nextRect = nextCard.getBoundingClientRect();
        const distance = nextRect.top - cardRect.top;
        const threshold = cardRect.height;

        if (distance < threshold && distance > 0) {
          const progress = 1 - distance / threshold;
          const scale = 1 - progress * 0.045;
          const brightness = 1 - progress * 0.06;
          card.style.setProperty('--stack-scale', scale.toFixed(4));
          card.style.setProperty('--stack-brightness', brightness.toFixed(4));
        } else if (distance <= 0) {
          card.style.setProperty('--stack-scale', '0.955');
          card.style.setProperty('--stack-brightness', '0.94');
        } else {
          card.style.setProperty('--stack-scale', '1');
          card.style.setProperty('--stack-brightness', '1');
        }
      }
      ticking = false;
    }

    window.addEventListener(
      'scroll',
      function () {
        if (!ticking) {
          window.requestAnimationFrame(updateStackDepth);
          ticking = true;
        }
      },
      { passive: true }
    );

    window.addEventListener('resize', updateStackDepth);
    updateStackDepth();
  }

  /**
   * 15. HERO SECTION SCROLL-EXIT CHOREOGRAPHY
   * As the user scrolls down toward Selected Case Studies (#projects):
   * - Left text (.hero-primary-block) pops out in 3D and sweeps toward the top-right
   * - Right card (.hero-bench-card) shrinks down and travels toward the top-right
   * - Both smoothly disappear as the user reaches the second section (#projects)
   */
  function initHeroScrollExit() {
    const heroSection = document.getElementById('overview');
    const projectsSection = document.getElementById('projects');
    const leftBlock = document.querySelector('.hero-primary-block');
    const rightCard = document.querySelector('.hero-bench-card');

    if (!heroSection || !leftBlock || !rightCard) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    let targetP = 0;
    let currentP = 0;

    function updateHeroScroll() {
      const scrollY = window.scrollY;
      const projectsTop = projectsSection
        ? projectsSection.offsetTop - window.innerHeight * 0.25
        : heroSection.offsetHeight;
      const maxScroll = Math.max(260, projectsTop);
      targetP = Math.max(0, Math.min(1, scrollY / maxScroll));
    }

    window.addEventListener('scroll', updateHeroScroll, { passive: true });
    window.addEventListener('resize', updateHeroScroll);
    updateHeroScroll();

    function renderHeroExit() {
      currentP += (targetP - currentP) * 0.14;
      const p = currentP;

      if (p < 0.003) {
        leftBlock.style.transform = '';
        leftBlock.style.opacity = '';
        leftBlock.style.filter = '';
        rightCard.style.transform = '';
        rightCard.style.opacity = '';
        rightCard.style.filter = '';
      } else {
        // Left text pops out (scale > 1 + Z lift) then arcs to the top-right and fades out
        const popBell = Math.sin(Math.min(1, p * 1.35) * Math.PI);
        const leftScale = 1 + popBell * 0.14 - p * 0.18;
        const leftX = Math.pow(p, 1.15) * (window.innerWidth * 0.42);
        const leftY = -Math.pow(p, 1.1) * (window.innerHeight * 0.44);
        const leftZ = popBell * 90;
        const leftRotZ = p * 5.5;
        const leftOpacity = Math.max(0, 1 - Math.pow(p, 1.35) * 1.18);

        leftBlock.style.transform =
          'translate3d(' + leftX.toFixed(1) + 'px, ' + leftY.toFixed(1) + 'px, ' + leftZ.toFixed(1) + 'px) ' +
          'scale(' + leftScale.toFixed(3) + ') rotateZ(' + leftRotZ.toFixed(2) + 'deg)';
        leftBlock.style.opacity = leftOpacity.toFixed(3);
        leftBlock.style.filter = 'blur(' + (Math.max(0, p - 0.35) * 6).toFixed(2) + 'px)';

        // Right card shrinks smaller and travels toward the top-right until disappearing
        const rightScale = Math.max(0.28, 1 - p * 0.72);
        const rightX = Math.pow(p, 1.05) * (window.innerWidth * 0.24);
        const rightY = -Math.pow(p, 1.12) * (window.innerHeight * 0.48);
        const rightRot = p * 8;
        const rightOpacity = Math.max(0, 1 - Math.pow(p, 1.3) * 1.2);

        rightCard.style.transform =
          'translate3d(' + rightX.toFixed(1) + 'px, ' + rightY.toFixed(1) + 'px, 0) ' +
          'scale(' + rightScale.toFixed(3) + ') rotateZ(' + rightRot.toFixed(2) + 'deg)';
        rightCard.style.opacity = rightOpacity.toFixed(3);
        rightCard.style.filter = 'blur(' + (Math.max(0, p - 0.4) * 5).toFixed(2) + 'px)';
      }

      window.requestAnimationFrame(renderHeroExit);
    }

    window.requestAnimationFrame(renderHeroExit);
  }

  /**
   * 16. WARM-THEME SECTION 4 SCROLL-EXPANDING WINDOW & ARCHITECTURAL WAVE LINE
   * Drives the warm caramel/sage dual-filament wave spline, 3D perspective window warp & expansion,
   * '+' crosshair reveals, and interactive warm portal canvas.
   */
  function initLusionSection4Stage() {
    const section = document.getElementById('academic');
    const path = document.getElementById('lusion-guiding-path');
    const secondaryPath = document.getElementById('lusion-secondary-path');
    const introHeader = document.getElementById('lusion-intro-header');
    const expandingWindow = document.getElementById('lusion-expanding-window');
    const windowInner = document.getElementById('lusion-window-inner');
    const topCrosshairs = document.getElementById('lusion-crosshair-top');
    const bottomCrosshairs = document.getElementById('lusion-crosshair-bottom');
    const portalCanvas = document.getElementById('lusion-portal-canvas');

    if (!section || !expandingWindow || !path) return;

    const pathLength = path.getTotalLength ? path.getTotalLength() : 2800;
    path.style.strokeDasharray = String(pathLength);
    path.style.strokeDashoffset = String(pathLength * 0.72);

    let targetProgress = 0;
    let currentProgress = 0;
    let pointerOffsetX = 0;
    let pointerOffsetY = 0;

    window.addEventListener(
      'mousemove',
      function (e) {
        const nx = (e.clientX / window.innerWidth - 0.5) * 2;
        const ny = (e.clientY / window.innerHeight - 0.5) * 2;
        pointerOffsetX = nx * 32;
        pointerOffsetY = ny * 24;
      },
      { passive: true }
    );

    function computeScrollProgress() {
      const rect = section.getBoundingClientRect();
      const viewH = window.innerHeight;
      const totalScrollable = Math.max(1, rect.height - viewH * 0.85);
      const scrolled = -rect.top + viewH * 0.18;
      targetProgress = Math.max(0, Math.min(1, scrolled / totalScrollable));
    }

    window.addEventListener('scroll', computeScrollProgress, { passive: true });
    window.addEventListener('resize', computeScrollProgress);
    computeScrollProgress();

    // Animated Warm Caramel / Sage Orbital Portal inside the Expanding Window
    let pCtx = null;
    let pW = 0;
    let pH = 0;
    const shards = [];

    if (portalCanvas) {
      pCtx = portalCanvas.getContext('2d');
      function resizePortal() {
        const rect = expandingWindow.getBoundingClientRect();
        pW = Math.max(300, rect.width);
        pH = Math.max(260, rect.height);
        portalCanvas.width = pW;
        portalCanvas.height = pH;
      }
      resizePortal();
      window.addEventListener('resize', resizePortal);

      for (let i = 0; i < 42; i++) {
        shards.push({
          angle: (Math.PI * 2 * i) / 42,
          radius: 28 + (i % 7) * 26,
          speed: 0.008 + (i % 5) * 0.003,
          size: 4 + (i % 4) * 4.5,
          hue: i % 2 === 0 ? 'rgba(212, 155, 106, 0.36)' : 'rgba(63, 123, 73, 0.30)'
        });
      }
    }

    let time = 0;
    function animateStage() {
      time += 0.018;
      currentProgress += (targetProgress - currentProgress) * 0.11;
      const p = currentProgress;

      // 1. Creative Sweeping Diagonal Wave & S-Cascade (No Loop) in Warm Theme
      const drawFraction = Math.min(1, 0.22 + p * 0.78);
      path.style.strokeDashoffset = String(pathLength * (1 - drawFraction));

      const flexX = Math.sin(time * 1.35 + p * 4.2) * 28 + pointerOffsetX;
      const flexY = Math.cos(time * 1.15 + p * 3.4) * 22 + pointerOffsetY;
      const dString =
        'M 1490 60 ' +
        'C ' + (1140 - flexX * 0.6).toFixed(1) + ' ' + (90 + flexY * 0.5).toFixed(1) + ', ' +
        (960 + flexX * 0.5).toFixed(1) + ' ' + (280 - flexY * 0.7).toFixed(1) + ', ' +
        (680 + flexX * 0.35).toFixed(1) + ' ' + (310 + flexY * 0.4).toFixed(1) + ' ' +
        'C ' + (390 - flexX * 0.5).toFixed(1) + ' ' + (340 + flexY).toFixed(1) + ', ' +
        (140 + flexX * 0.4).toFixed(1) + ' ' + (460 - flexY * 0.5).toFixed(1) + ', ' +
        (70 + flexX * 0.25).toFixed(1) + ' 670 ' +
        'C 20 820, ' + (340 - flexX * 0.6).toFixed(1) + ' ' + (910 + flexY * 0.6).toFixed(1) + ', ' +
        (760 + flexX * 0.4).toFixed(1) + ' ' + (860 - flexY * 0.5).toFixed(1) + ' ' +
        'C 1120 815, 1310 920, 1510 980';
      path.setAttribute('d', dString);

      if (secondaryPath) {
        const secString =
          'M -60 220 ' +
          'C ' + (240 + flexX * 0.5).toFixed(1) + ' ' + (180 - flexY * 0.5).toFixed(1) + ', ' +
          (510 - flexX * 0.4).toFixed(1) + ' ' + (380 + flexY * 0.6).toFixed(1) + ', ' +
          (820 + flexX * 0.3).toFixed(1) + ' 340 ' +
          'C 1120 300, ' + (1290 - flexX * 0.5).toFixed(1) + ' ' + (520 + flexY * 0.5).toFixed(1) + ', ' +
          '1040 710 C 790 900, 380 780, -40 920';
        secondaryPath.setAttribute('d', secString);
        secondaryPath.style.strokeDashoffset = String(-time * 40 - p * 180);
      }

      // 2. Window Expansion + 3D Mid-Scroll Warp
      if (window.innerWidth > 900) {
        const widthPct = 44 + p * 56;
        const warpBell = Math.sin(p * Math.PI);
        const rotX = warpBell * 11;
        const rotY = warpBell * -9;
        const rotZ = warpBell * -2.8;
        const skewX = warpBell * -4.5;
        const translateY = (1 - p) * 14 - warpBell * 10;

        expandingWindow.style.width = widthPct.toFixed(2) + '%';
        expandingWindow.style.transform =
          'translate3d(0, ' + translateY.toFixed(1) + 'px, 0) ' +
          'rotateX(' + rotX.toFixed(2) + 'deg) ' +
          'rotateY(' + rotY.toFixed(2) + 'deg) ' +
          'rotateZ(' + rotZ.toFixed(2) + 'deg) ' +
          'skewX(' + skewX.toFixed(2) + 'deg)';

        if (introHeader) {
          const headerShift = Math.max(0, (p - 0.35) / 0.65);
          introHeader.style.transform = 'translate3d(0, ' + (-headerShift * 18).toFixed(1) + 'px, 0)';
          introHeader.style.opacity = String((1 - headerShift * 0.22).toFixed(3));
        }

        if (windowInner) {
          const contentAlpha = Math.max(0.22, Math.min(1, (p - 0.15) / 0.6));
          const contentY = (1 - contentAlpha) * 20;
          const contentScale = 0.95 + contentAlpha * 0.05;
          windowInner.style.opacity = contentAlpha.toFixed(3);
          windowInner.style.transform =
            'translate3d(0, ' + contentY.toFixed(1) + 'px, 0) scale(' + contentScale.toFixed(3) + ')';
        }
      }

      // 3. Toggle '+' Crosshair Framing Rows when Window is Expanded
      if (topCrosshairs && bottomCrosshairs) {
        if (p > 0.62) {
          topCrosshairs.classList.add('is-visible');
          bottomCrosshairs.classList.add('is-visible');
        } else {
          topCrosshairs.classList.remove('is-visible');
          bottomCrosshairs.classList.remove('is-visible');
        }
      }

      // 4. Render Warm Caramel & Sage Swirling Portal Canvas Backdrop
      if (pCtx && pW > 0 && pH > 0) {
        pCtx.clearRect(0, 0, pW, pH);
        const cx = pW * 0.5;
        const cy = pH * 0.5;

        for (let r = 1; r <= 4; r++) {
          pCtx.save();
          pCtx.translate(cx, cy);
          pCtx.rotate(time * 0.4 * (r % 2 === 0 ? 1 : -1) + p * 2.2);
          pCtx.strokeStyle = 'rgba(212, 155, 106, ' + (0.22 - r * 0.035).toFixed(3) + ')';
          pCtx.lineWidth = 2;
          pCtx.beginPath();
          pCtx.ellipse(0, 0, 55 * r + p * 35, 28 * r + p * 18, 0.35, 0, Math.PI * 2);
          pCtx.stroke();
          pCtx.restore();
        }

        for (let i = 0; i < shards.length; i++) {
          const s = shards[i];
          s.angle += s.speed;
          const rad = s.radius + p * 65;
          const sx = cx + Math.cos(s.angle) * rad * 1.35;
          const sy = cy + Math.sin(s.angle) * rad * 0.72;

          pCtx.save();
          pCtx.translate(sx, sy);
          pCtx.rotate(s.angle * 1.8);
          pCtx.fillStyle = s.hue;
          pCtx.beginPath();
          pCtx.moveTo(0, -s.size);
          pCtx.lineTo(s.size * 0.85, 0);
          pCtx.lineTo(0, s.size);
          pCtx.lineTo(-s.size * 0.85, 0);
          pCtx.closePath();
          pCtx.fill();
          pCtx.restore();
        }
      }

      window.requestAnimationFrame(animateStage);
    }

    window.requestAnimationFrame(animateStage);
  }

})();
