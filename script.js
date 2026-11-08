

(function () {
  'use strict';

  // Wait for complete DOM readiness
  document.addEventListener('DOMContentLoaded', initializePortfolio);

  function initializePortfolio() {
    initHeadFaviconAndSchema();
    initLiveClock();
    initHeaderScroll();
    initMobileNavigation();
    initScrollSpy();
    initEmailClipboard();
    initHeroHudInteractivity();
    initHeroScrollExit();
    initSkillRollupPopup();
    initSkillCardsScrollScale();
    initSkillMasterDirectory();
    initKineticSkillPills();
    initProjectFilters();
    initStickyProjectStack();
    initProjectBlueprintToggles();
    initProjectLiveSandboxes();
    initValuesFanOutAndTilt();
    initLusionSection4Stage();
    initConnectSplitCurtain();
    initContactFormConsole();
    initContactSignalWaveform();
    initKineticFooterWordmark();
    initGlobalMagneticAndSpotlight();
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
   * 02. MORPHING LEFT FLOATING DOCK & VERTICAL TELEMETRY PROGRESS SPINE
   * Detaches the top header into a left-side vertical floating dock on scroll,
   * updates the live telemetry progress spine (000%-100%), and supports click/drag scrubbing.
   */
  let syncLiquidIndicator = null;

  function initHeaderScroll() {
    const header = document.getElementById('site-header');
    const spineTrack = document.getElementById('dock-spine-track');
    const spineFill = document.getElementById('dock-spine-fill');
    const spineThumb = document.getElementById('dock-spine-thumb');
    const scrollPctEl = document.getElementById('dock-scroll-pct');
    const spineContainer = document.getElementById('dock-telemetry-spine');
    const topLaserFill = document.getElementById('top-laser-fill');

    if (!header) return;

    let wasDocked = false;

    function updateDockAndTelemetry() {
      const scrollY = window.scrollY;
      const docHeight = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const pct = Math.max(0, Math.min(1, scrollY / docHeight));
      const pctNum = Math.round(pct * 100);

      // Update top-edge laser bar and vertical telemetry spine fill, thumb position, and 3-digit readout
      if (topLaserFill) topLaserFill.style.width = (pct * 100).toFixed(2) + '%';
      if (spineFill) spineFill.style.height = (pct * 100).toFixed(2) + '%';
      if (spineThumb) spineThumb.style.top = (pct * 100).toFixed(2) + '%';
      if (spineContainer) spineContainer.setAttribute('aria-valuenow', String(pctNum));
      if (scrollPctEl) {
        scrollPctEl.textContent = String(pctNum).padStart(3, '0') + '%';
      }

      const shouldDock = scrollY > 90 && window.innerWidth > 960;
      if (shouldDock) {
        header.classList.add('is-scrolled', 'is-docked-left');
      } else {
        header.classList.remove('is-docked-left');
        if (scrollY > 20) {
          header.classList.add('is-scrolled');
        } else {
          header.classList.remove('is-scrolled');
        }
      }

      if (shouldDock !== wasDocked) {
        wasDocked = shouldDock;
        if (typeof syncLiquidIndicator === 'function') {
          setTimeout(syncLiquidIndicator, 40);
          setTimeout(syncLiquidIndicator, 340);
        }
      }
    }

    window.addEventListener('scroll', updateDockAndTelemetry, { passive: true });
    window.addEventListener('resize', updateDockAndTelemetry);
    header.addEventListener('mouseenter', function () {
      if (typeof syncLiquidIndicator === 'function') {
        setTimeout(syncLiquidIndicator, 60);
        setTimeout(syncLiquidIndicator, 280);
      }
    });
    header.addEventListener('mouseleave', function () {
      if (typeof syncLiquidIndicator === 'function') {
        setTimeout(syncLiquidIndicator, 60);
        setTimeout(syncLiquidIndicator, 280);
      }
    });
    updateDockAndTelemetry();

    // Interactive Click & Drag Scrubbing on the Vertical Telemetry Spine
    if (spineContainer && spineTrack) {
      let isScrubbing = false;

      function scrubToClientY(clientY) {
        const rect = spineTrack.getBoundingClientRect();
        if (rect.height <= 0) return;
        const ratio = Math.max(0, Math.min(1, (clientY - rect.top) / rect.height));
        const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
        window.scrollTo({
          top: ratio * maxScroll,
          behavior: 'auto'
        });
      }

      spineContainer.addEventListener('mousedown', function (e) {
        isScrubbing = true;
        scrubToClientY(e.clientY);
      });

      window.addEventListener('mousemove', function (e) {
        if (!isScrubbing) return;
        scrubToClientY(e.clientY);
      });

      window.addEventListener('mouseup', function () {
        isScrubbing = false;
      });

      spineContainer.addEventListener('keydown', function (e) {
        const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
        if (e.key === 'ArrowDown' || e.key === 'PageDown') {
          e.preventDefault();
          window.scrollBy({ top: window.innerHeight * 0.35, behavior: 'smooth' });
        } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
          e.preventDefault();
          window.scrollBy({ top: -window.innerHeight * 0.35, behavior: 'smooth' });
        } else if (e.key === 'Home') {
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else if (e.key === 'End') {
          e.preventDefault();
          window.scrollTo({ top: maxScroll, behavior: 'smooth' });
        }
      });
    }
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
   * 04. SCROLL SPY & SPRING-PHYSICS LIQUID DOCK INDICATOR
   * Tracks active section and glides the liquid highlight pill smoothly across horizontal & vertical dock modes
   */
  function initScrollSpy() {
    const navList = document.getElementById('nav-list');
    const indicator = document.getElementById('nav-liquid-indicator');
    const navAnchors = Array.from(document.querySelectorAll('.nav-anchor'));
    const observedSections = Array.from(document.querySelectorAll('section[id]'));
    if (!navAnchors.length || !observedSections.length) return;

    let activeAnchor = navAnchors[0];
    let hoveredAnchor = null;

    // Spring state for the liquid sliding indicator
    const spring = {
      x: 0,
      y: 0,
      w: 0,
      h: 0,
      tx: 0,
      ty: 0,
      tw: 0,
      th: 0,
      vx: 0,
      vy: 0,
      vw: 0,
      vh: 0,
      initialized: false
    };

    function measureTargetAnchor() {
      const target = hoveredAnchor || activeAnchor;
      if (!target || !navList || !indicator) return;

      const listRect = navList.getBoundingClientRect();
      const itemRect = target.getBoundingClientRect();

      spring.tx = itemRect.left - listRect.left;
      spring.ty = itemRect.top - listRect.top;
      spring.tw = itemRect.width;
      spring.th = itemRect.height;

      if (!spring.initialized && spring.tw > 0) {
        spring.x = spring.tx;
        spring.y = spring.ty;
        spring.w = spring.tw;
        spring.h = spring.th;
        spring.initialized = true;
        indicator.style.opacity = '1';
      }
    }

    syncLiquidIndicator = measureTargetAnchor;

    function animateLiquidPill() {
      measureTargetAnchor();

      const stiffness = 0.18;
      const damping = 0.76;

      spring.vx = (spring.vx + (spring.tx - spring.x) * stiffness) * damping;
      spring.vy = (spring.vy + (spring.ty - spring.y) * stiffness) * damping;
      spring.vw = (spring.vw + (spring.tw - spring.w) * stiffness) * damping;
      spring.vh = (spring.vh + (spring.th - spring.h) * stiffness) * damping;

      spring.x += spring.vx;
      spring.y += spring.vy;
      spring.w += spring.vw;
      spring.h += spring.vh;

      if (indicator && spring.initialized) {
        indicator.style.transform =
          'translate3d(' + spring.x.toFixed(2) + 'px, ' + spring.y.toFixed(2) + 'px, 0)';
        indicator.style.width = Math.max(0, spring.w).toFixed(2) + 'px';
        indicator.style.height = Math.max(0, spring.h).toFixed(2) + 'px';
      }

      window.requestAnimationFrame(animateLiquidPill);
    }

    navAnchors.forEach(function (anchor) {
      anchor.addEventListener('mouseenter', function () {
        hoveredAnchor = anchor;
        measureTargetAnchor();
      });
      anchor.addEventListener('mouseleave', function () {
        hoveredAnchor = null;
        measureTargetAnchor();
      });
      anchor.addEventListener('click', function () {
        const secId = anchor.getAttribute('data-section');
        const targetSec = secId ? document.getElementById(secId) : null;
        const eyebrow = targetSec ? targetSec.querySelector('.section-eyebrow') : null;
        if (eyebrow) {
          eyebrow.classList.remove('is-section-arriving');
          void eyebrow.offsetWidth;
          eyebrow.classList.add('is-section-arriving');
          setTimeout(function () {
            eyebrow.classList.remove('is-section-arriving');
          }, 1150);
        }
      });
    });

    function updateActiveSectionByScroll() {
      const checkY = window.innerHeight * 0.36;
      let currentSectionId = observedSections[0].id;

      for (let i = 0; i < observedSections.length; i++) {
        const sec = observedSections[i];
        const rect = sec.getBoundingClientRect();
        if (rect.top <= checkY) {
          currentSectionId = sec.id;
        }
      }

      if (currentSectionId === 'overview') {
        currentSectionId = 'projects';
      }

      navAnchors.forEach(function (anchor) {
        const href = anchor.getAttribute('href');
        if (href === '#' + currentSectionId) {
          anchor.classList.add('is-active');
          activeAnchor = anchor;
        } else {
          anchor.classList.remove('is-active');
        }
      });
    }

    window.addEventListener('scroll', updateActiveSectionByScroll, { passive: true });
    window.addEventListener('resize', measureTargetAnchor);
    updateActiveSectionByScroll();
    window.requestAnimationFrame(animateLiquidPill);
  }

  /**
   * 05. COPY EMAIL TO CLIPBOARD WITH TOAST FEEDBACK
   * Interactive utility with graceful fallback
   */
  function initEmailClipboard() {
    const repoUrl = ['https:', '', 'github.com', 'Sarthak-Kshirsagar-2275', 'My-Portfolio'].join('/');
    ['telemetry-portfolio-repo-link', 'hero-portfolio-repo-link', 'footer-portfolio-repo-link'].forEach(function (id) {
      const linkEl = document.getElementById(id);
      if (linkEl) linkEl.setAttribute('href', repoUrl);
    });

    const copyBtns = [
      document.getElementById('header-copy-email'),
      document.getElementById('inline-copy-email')
    ];
    const emailToCopy = 'Sarthak.v.k.2275@gmail.com';

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
  let openAllSkillsRollupPopup = null;

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

    function triggerModalOpenAnimation() {
      overlay.removeAttribute('hidden');
      document.body.classList.add('skill-modal-open');
      setBackgroundInert(true);

      overlay.classList.remove('is-closing');
      overlay.classList.add('is-active', 'is-opening');
      popupCard.scrollTop = 0;

      setTimeout(function () {
        closeBtn.focus();
      }, 60);
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

      triggerModalOpenAnimation();
    }

    function openAllSkillsPopup() {
      if (isClosing) return;
      lastFocusedElement = document.activeElement;

      popupContent.innerHTML = '';

      const headerStrip = document.createElement('div');
      headerStrip.className = 'stack-badge-strip';
      headerStrip.innerHTML =
        '<span class="domain-tag">ALL 04 DOMAINS</span>' +
        '<span class="item-count-pill">23 Core Technologies</span>';
      popupContent.appendChild(headerStrip);

      const masterTitle = document.createElement('h3');
      masterTitle.className = 'stack-domain-title';
      masterTitle.id = 'popup-domain-title';
      masterTitle.textContent = 'Complete Technical Stack & Engineering Index';
      popupContent.appendChild(masterTitle);

      const masterDesc = document.createElement('p');
      masterDesc.className = 'stack-domain-desc';
      masterDesc.textContent =
        'All 23 production technologies across Frontend & 3D, Backend & Databases, AI/ML & Computer Vision (rPPG), and Developer Workflows.';
      popupContent.appendChild(masterDesc);

      const allChipsWrap = document.createElement('div');
      allChipsWrap.className = 'prominent-chips';
      document.querySelectorAll('.skills-all-pills-grid .master-skill-pill').forEach(function (pill) {
        const chip = document.createElement('span');
        chip.className = 'tech-chip';
        chip.textContent = pill.textContent.trim();
        allChipsWrap.appendChild(chip);
      });
      popupContent.appendChild(allChipsWrap);

      cards.forEach(function (card) {
        const trayInner = card.querySelector('.tray-inner');
        if (trayInner) {
          const clone = trayInner.cloneNode(true);
          clone.style.marginBottom = '20px';
          popupContent.appendChild(clone);
        }
      });

      triggerModalOpenAnimation();
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
    openAllSkillsRollupPopup = openAllSkillsPopup;

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
    const pillsGrid = document.querySelector('.skills-all-pills-grid');
    const skillPills = document.querySelectorAll('.master-skill-pill');
    const stackCards = document.querySelectorAll('.stack-card');
    const mobileViewMoreBtn = document.getElementById('mobile-skills-view-more-btn');

    if (mobileViewMoreBtn) {
      mobileViewMoreBtn.addEventListener('click', function () {
        if (typeof openAllSkillsRollupPopup === 'function') {
          openAllSkillsRollupPopup();
        }
      });
    }

    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        const targetFilter = btn.getAttribute('data-skill-filter');

        filterBtns.forEach(function (b) {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');

        if (pillsGrid) {
          pillsGrid.classList.toggle('is-filtered', targetFilter !== 'all');
        }

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
   * 09. PROJECT TECHNICAL BLUEPRINT TOGGLES & LIVE IN-CARD SANDBOXES
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
   * 09B. LIVE EMBEDDED PRODUCTION SANDBOXES (SYLLABUS EXPLAINER & ELANOR)
   * Embeds live deployed web apps inside the right-hand browser box of Project 02 and Project 03,
   * scales the 1280px virtual desktop proportionally to fit the card box, and supports click-to-interact,
   * reload, and fullscreen modal expansion.
   */
  function initProjectLiveSandboxes() {
    const sandboxUrls = {
      syllabus: ['https:', '', 'syllabus-explainer.vercel.app', ''].join('/'),
      elanor: ['https:', '', 'elanorofficial.netlify.app', ''].join('/')
    };

    const projectsSection = document.getElementById('projects');
    const modalOverlay = document.getElementById('sandbox-modal-overlay');
    const modalIframe = document.getElementById('sandbox-modal-iframe');
    const modalTitle = document.getElementById('sandbox-modal-title');
    const modalUrl = document.getElementById('sandbox-modal-url');
    const modalExternal = document.getElementById('sandbox-modal-external');
    const modalClose = document.getElementById('sandbox-modal-close');

    let iframesHydrated = false;

    function hydrateSandboxIframes() {
      if (iframesHydrated) return;
      iframesHydrated = true;
      Object.keys(sandboxUrls).forEach(function (key) {
        const iframe = document.getElementById('sandbox-iframe-' + key);
        if (iframe && !iframe.getAttribute('src')) {
          iframe.setAttribute('src', sandboxUrls[key]);
        }
      });
    }

    // Hydrate iframes when #projects approaches the viewport so initial page load stays fast
    if (projectsSection && 'IntersectionObserver' in window) {
      const obs = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              hydrateSandboxIframes();
              obs.disconnect();
            }
          });
        },
        { root: null, rootMargin: '500px 0px 500px 0px', threshold: 0.01 }
      );
      obs.observe(projectsSection);
    } else {
      hydrateSandboxIframes();
    }

    function updateSandboxScales() {
      const isMobileViewport = window.innerWidth <= 768;
      const frameW = isMobileViewport ? 412 : 1280;
      const frameH = isMobileViewport ? 600 : 800;

      Object.keys(sandboxUrls).forEach(function (key) {
        const viewport = document.getElementById('sandbox-viewport-' + key);
        const scaleStage = document.getElementById('sandbox-scale-' + key);
        if (!viewport || !scaleStage) return;

        const vw = viewport.clientWidth || (isMobileViewport ? 300 : 460);
        const scale = Math.max(0.2, Math.min(1, vw / frameW));
        const scaledHeight = Math.round(frameH * scale);

        scaleStage.style.setProperty('--sandbox-frame-w', frameW + 'px');
        scaleStage.style.setProperty('--sandbox-frame-h', frameH + 'px');
        scaleStage.style.setProperty('--sandbox-scale', scale.toFixed(4));
        viewport.style.height = scaledHeight + 'px';
        viewport.style.minHeight = scaledHeight + 'px';
      });
    }

    window.addEventListener('resize', updateSandboxScales);
    setTimeout(updateSandboxScales, 60);
    updateSandboxScales();

    function setSandboxInteracting(key, active) {
      const stageCard = document.querySelector('[data-sandbox-card="' + key + '"]');
      const toggleBtn = document.querySelector('.sandbox-toggle-interact[data-sandbox-target="' + key + '"]');
      if (!stageCard) return;

      hydrateSandboxIframes();
      stageCard.classList.toggle('is-interacting', active);
      if (toggleBtn) {
        toggleBtn.classList.toggle('is-active', active);
        toggleBtn.setAttribute('aria-pressed', String(active));
        toggleBtn.textContent = active ? 'Lock Scroll' : 'Interact';
      }
    }

    // Unlock interaction when clicking the shield overlay on the right-hand box
    document.querySelectorAll('.sandbox-click-shield').forEach(function (shield) {
      shield.addEventListener('click', function () {
        const key = shield.getAttribute('data-sandbox-target');
        setSandboxInteracting(key, true);
      });
    });

    // Toggle Interact / Lock Scroll button in the mockup top bar
    document.querySelectorAll('.sandbox-toggle-interact').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const key = btn.getAttribute('data-sandbox-target');
        const stageCard = document.querySelector('[data-sandbox-card="' + key + '"]');
        const isCurrentlyActive = stageCard && stageCard.classList.contains('is-interacting');
        setSandboxInteracting(key, !isCurrentlyActive);
      });
    });

    // Auto-lock scroll when cursor leaves the sandbox card so page scrolling is never trapped
    document.querySelectorAll('.card-visual-stage.is-live-sandbox').forEach(function (stageCard) {
      stageCard.addEventListener('mouseleave', function () {
        const key = stageCard.getAttribute('data-sandbox-card');
        if (key && stageCard.classList.contains('is-interacting')) {
          setSandboxInteracting(key, false);
        }
      });
    });

    // Reload button in mockup top bar
    document.querySelectorAll('.sandbox-reload-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const key = btn.getAttribute('data-sandbox-target');
        const iframe = document.getElementById('sandbox-iframe-' + key);
        if (iframe && sandboxUrls[key]) {
          iframe.setAttribute('src', sandboxUrls[key]);
        }
      });
    });

    // Expand Fullscreen Sandbox Modal
    document.querySelectorAll('.sandbox-expand-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const key = btn.getAttribute('data-sandbox-target');
        const title = btn.getAttribute('data-sandbox-title') || 'Live Project Sandbox';
        const url = sandboxUrls[key];
        if (!modalOverlay || !modalIframe || !url) return;

        if (modalTitle) modalTitle.textContent = title;
        if (modalUrl) modalUrl.textContent = url;
        if (modalExternal) modalExternal.setAttribute('href', url);
        modalIframe.setAttribute('src', url);
        modalOverlay.removeAttribute('hidden');
        document.body.classList.add('skill-modal-open');
        if (modalClose) modalClose.focus();
      });
    });

    function closeSandboxModal() {
      if (!modalOverlay || modalOverlay.hasAttribute('hidden')) return;
      modalOverlay.setAttribute('hidden', '');
      if (modalIframe) modalIframe.setAttribute('src', 'about:blank');
      document.body.classList.remove('skill-modal-open');
    }

    if (modalClose) {
      modalClose.addEventListener('click', closeSandboxModal);
    }
    if (modalOverlay) {
      modalOverlay.addEventListener('click', function (e) {
        if (e.target === modalOverlay) closeSandboxModal();
      });
    }
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modalOverlay && !modalOverlay.hasAttribute('hidden')) {
        closeSandboxModal();
      }
    });
  }

  /**
   * 10. DIRECT CONTACT FORM CONSOLE & INTERACTIVE 3D ENVELOPE DISPATCH
   * Live-binds form inputs to the 3D envelope letter sheet, tilts the 3D envelope with cursor movement,
   * folds & seals the 3D envelope on valid submission, and reveals the green tick banner after dispatch.
   */
  function initContactFormConsole() {
    const form = document.getElementById('portfolio-contact-form');
    if (!form) return;

    const nameInput = document.getElementById('contact-name');
    const emailInput = document.getElementById('contact-email');
    const topicInput = document.getElementById('contact-topic');
    const messageInput = document.getElementById('contact-message');
    const submitBtn = document.getElementById('contact-submit-btn');
    const feedbackBanner = document.getElementById('form-feedback-banner');
    const formSurfaceCard = form.closest('.form-surface-card');

    // Interactive 3D Envelope Elements
    const envelopeStage = document.getElementById('envelope-3d-stage');
    const envelope3D = document.getElementById('interactive-envelope-3d');
    const envStateText = document.getElementById('envelope-stage-state');
    const envName = document.getElementById('env-preview-name');
    const envEmail = document.getElementById('env-preview-email');
    const envTopic = document.getElementById('env-preview-topic');
    const envMsg = document.getElementById('env-preview-msg');

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

    // Sync live form typing onto the 3D Envelope's letter sheet
    function syncEnvelopePreview() {
      if (envName && nameInput) {
        envName.textContent = nameInput.value.trim() || 'Awaiting Sender...';
      }
      if (envEmail && emailInput) {
        envEmail.textContent = emailInput.value.trim() || 'awaiting@domain.com';
      }
      if (envTopic && topicInput) {
        const selectedOption = topicInput.options[topicInput.selectedIndex];
        envTopic.textContent = selectedOption
          ? selectedOption.textContent.toUpperCase()
          : 'WEB APPLICATION';
      }
      if (envMsg && messageInput) {
        envMsg.textContent =
          messageInput.value.trim() ||
          'Start typing in the console on the right to draft your live blueprint packet...';
      }
      if (envelope3D && !envelope3D.classList.contains('is-sealing')) {
        envelope3D.classList.add('is-open');
        if (envStateText) envStateText.textContent = 'Drafting live packet inside envelope...';
      }
    }

    // Allow clicking/pressing Enter on the 3D envelope to toggle its flap open/closed
    // On mobile/stacked screens (<= 1024px), clicking the envelope smoothly scrolls down to the form console
    if (envelope3D) {
      envelope3D.addEventListener('click', function () {
        if (envelope3D.classList.contains('is-sealing') || envelope3D.classList.contains('is-launching')) return;

        if (window.innerWidth <= 1024) {
          envelope3D.classList.add('is-open');
          if (envStateText) {
            envStateText.textContent = 'Flap open • Jumping to message console ↓';
          }
          const formTarget = formSurfaceCard || form;
          if (formTarget) {
            const headerOffset = 74;
            const targetTop = formTarget.getBoundingClientRect().top + window.scrollY - headerOffset;
            window.scrollTo({
              top: Math.max(0, targetTop),
              behavior: 'smooth'
            });
            setTimeout(function () {
              if (nameInput) nameInput.focus({ preventScroll: true });
            }, 520);
          }
          return;
        }

        const isOpen = envelope3D.classList.toggle('is-open');
        if (envStateText) {
          envStateText.textContent = isOpen ? 'Flap open • Ready for drafting' : 'Flap sealed • Click to open';
        }
      });

      envelope3D.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          envelope3D.click();
        }
      });
    }

    // 3D Perspective Tilt on the Envelope Stage when moving cursor
    if (envelopeStage && envelope3D) {
      envelopeStage.addEventListener('mousemove', function (e) {
        const rect = envelopeStage.getBoundingClientRect();
        const nx = ((e.clientX - rect.left) / Math.max(1, rect.width) - 0.5) * 2;
        const ny = ((e.clientY - rect.top) / Math.max(1, rect.height) - 0.5) * 2;
        envelope3D.style.setProperty('--env-rot-x', (-ny * 12).toFixed(2) + 'deg');
        envelope3D.style.setProperty('--env-rot-y', (nx * 14).toFixed(2) + 'deg');
      });

      envelopeStage.addEventListener('mouseleave', function () {
        envelope3D.style.setProperty('--env-rot-x', '4deg');
        envelope3D.style.setProperty('--env-rot-y', '-6deg');
      });
    }

    // Clear individual errors on input, update 3D envelope letter, and hide previous submission banner
    [nameInput, emailInput, messageInput, topicInput].forEach(function (input) {
      if (!input) return;
      input.addEventListener('input', function () {
        const errorEl = document.getElementById('error-' + input.name);
        if (errorEl) errorEl.textContent = '';
        syncEnvelopePreview();
        if (feedbackBanner && feedbackBanner.classList.contains('is-visible')) {
          feedbackBanner.classList.remove('is-visible');
          feedbackBanner.setAttribute('hidden', '');
        }
      });
      input.addEventListener('change', syncEnvelopePreview);
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

      // Step 1: Fold letter into 3D envelope & stamp SK wax seal shut
      const originalBtnHTML = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span>Sealing 3D Packet...</span>';

      if (envelope3D) {
        envelope3D.classList.remove('is-open');
        envelope3D.classList.add('is-sealing');
      }
      if (envStateText) {
        envStateText.textContent = 'Sealing packet with SK verification stamp...';
      }
      if (formSurfaceCard) {
        formSurfaceCard.classList.add('is-dispatching');
      }

      // Step 2: Launch the sealed 3D envelope into space
      setTimeout(function () {
        submitBtn.innerHTML = '<span>Launching Packet...</span>';
        if (envelope3D) {
          envelope3D.classList.add('is-launching');
        }
        if (envStateText) {
          envStateText.textContent = 'Packet transmitted ✓';
        }
      }, 520);

      // Step 3: Build real mailto dispatch & copy formatted packet to clipboard
      const senderName = nameInput.value.trim();
      const senderEmail = emailInput.value.trim();
      const selectedTopic = topicInput && topicInput.options[topicInput.selectedIndex]
        ? topicInput.options[topicInput.selectedIndex].textContent.trim()
        : 'Web Application';
      const senderMsg = messageInput.value.trim();
      const targetEmail = 'Sarthak.v.k.2275@gmail.com';
      const subjectLine = '[' + selectedTopic + '] Inquiry from ' + senderName;
      const packetText =
        'From: ' + senderName + ' <' + senderEmail + '>\n' +
        'Scope: ' + selectedTopic + '\n\n' +
        senderMsg;
      const mailtoHref =
        'mailto:' + targetEmail +
        '?subject=' + encodeURIComponent(subjectLine) +
        '&body=' + encodeURIComponent(packetText);

      const mailtoBtn = document.getElementById('feedback-mailto-link');
      const copyPacketBtn = document.getElementById('feedback-copy-packet-btn');
      if (mailtoBtn) {
        mailtoBtn.setAttribute('href', mailtoHref);
      }
      if (copyPacketBtn) {
        copyPacketBtn.onclick = function () {
          if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(packetText);
          }
          showToast('Formatted inquiry packet copied to clipboard!');
        };
      }

      setTimeout(function () {
        submitBtn.innerHTML = '<span>Packet Sealed &amp; Ready ✓</span>';
        if (feedbackBanner) {
          feedbackBanner.removeAttribute('hidden');
          feedbackBanner.classList.add('is-visible');
        }
        if (formSurfaceCard) {
          formSurfaceCard.classList.remove('is-dispatching');
        }

        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(packetText).catch(function () {});
        }

        // Reset inputs
        form.reset();
        showToast('Packet sealed! Click "Open in Mail App" or paste from clipboard.');

        setTimeout(function () {
          submitBtn.innerHTML = originalBtnHTML;
          submitBtn.disabled = false;
          if (envelope3D) {
            envelope3D.classList.remove('is-sealing', 'is-launching');
            envelope3D.classList.add('is-open');
          }
          syncEnvelopePreview();
          if (envStateText) {
            envStateText.textContent = 'Click envelope or type to preview';
          }
        }, 3200);
      }, 1220);
    });
  }

  /**
   * 11. FOOTER DYNAMIC YEAR & VIEWPORT-GATED RAF HELPER
   */
  function initFooterYear() {
    const yearEl = document.getElementById('current-year');
    if (yearEl) {
      yearEl.textContent = new Date().getFullYear();
    }
  }

  function startVisibilityGatedLoop(targetElement, stepCallback, rootMargin) {
    let isNearViewport = true;
    let isTabVisible = !document.hidden;
    let rafId = null;

    function tick() {
      if (!isNearViewport || !isTabVisible) {
        rafId = null;
        return;
      }
      stepCallback();
      rafId = window.requestAnimationFrame(tick);
    }

    function ensureRunning() {
      if (isNearViewport && isTabVisible && rafId === null) {
        rafId = window.requestAnimationFrame(tick);
      }
    }

    if (targetElement && 'IntersectionObserver' in window) {
      const obs = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            isNearViewport = entry.isIntersecting;
            ensureRunning();
          });
        },
        { root: null, rootMargin: rootMargin || '240px 0px 240px 0px', threshold: 0 }
      );
      obs.observe(targetElement);
    }

    document.addEventListener('visibilitychange', function () {
      isTabVisible = !document.hidden;
      ensureRunning();
    });

    ensureRunning();
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
   * Sections, headings, paragraphs, and cards below the hero start hidden below their resting position
   * and smoothly rise up into view with staggered spring timing as the user scrolls down.
   * (Note: Hero #overview elements, .stack-card, and .value-block use dedicated 60fps scroll physics engines
   * and must not have .fm-reveal / .fm-text-rise CSS transitions attached.)
   */
  function initFramerScrollReveals() {
    if (!('IntersectionObserver' in window)) return;

    // Text elements below the hero that rise up cleanly
    const textSelectors = [
      '.section-eyebrow',
      '.section-title',
      '.section-description',
      '.skills-overview-header',
      '.footer-col-left',
      '.footer-col-nav',
      '.footer-col-links'
    ];

    // Cards and structural blocks below the hero that rise up with subtle scale & blur clearing
    const blockSelectors = [
      '.project-filter-bar',
      '.skills-master-overview',
      '.values-blueprint-rail',
      '.lusion-sub-card',
      '.lusion-stat-pill',
      '.connect-info-panel',
      '.connect-form-panel'
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

    // Assign stagger delays to sibling items inside grids/containers below the hero
    const staggerContainers = document.querySelectorAll(
      '.lusion-sub-sections-grid, .connect-split-layout, .footer-container'
    );
    staggerContainers.forEach(function (container) {
      Array.from(container.children).forEach(function (child, index) {
        child.style.setProperty('--fm-delay', index * 95 + 'ms');
      });
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
   * 13B. SKILL CARDS 10%-TO-100% SCROLL-LINKED GROWTH ENGINE
   * Starts the 4 skill cards at 10% scale (0.10) and smoothly grows them to 100% (1.00)
   * as the user scrolls down through the Technical Stack section, without affecting
   * their click-to-roll-up center popup functionality.
   */
  function initSkillCardsScrollScale() {
    const matrix = document.querySelector('.skills-card-matrix');
    const cards = Array.from(document.querySelectorAll('.stack-card'));
    if (!matrix || !cards.length) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      cards.forEach(function (c) {
        c.style.setProperty('--skill-card-scale', '1');
        c.style.setProperty('--skill-card-opacity', '1');
      });
      return;
    }

    const cardStates = cards.map(function () {
      return { current: 0, target: 0 };
    });

    function computeTargets() {
      const viewH = window.innerHeight;
      const isMobile = window.innerWidth <= 768;
      const matrixRect = matrix.getBoundingClientRect();

      cards.forEach(function (card, idx) {
        if (card.hasAttribute('hidden')) {
          cardStates[idx].target = 1;
          return;
        }
        // Unscaled top position of the card relative to the viewport
        const unscaledTop = matrixRect.top + card.offsetTop;
        // On mobile (single column), complete growth higher in the lower viewport (72% viewH)
        // so cards are already 100% width when in the reading zone
        const startY = isMobile ? viewH * 0.98 : viewH * 0.96;
        const endY = isMobile ? viewH * 0.72 : viewH * 0.50;
        const rawProgress = (startY - unscaledTop) / Math.max(1, startY - endY);
        cardStates[idx].target = Math.max(0, Math.min(1, rawProgress));
      });
    }

    window.addEventListener('scroll', computeTargets, { passive: true });
    window.addEventListener('resize', computeTargets);
    computeTargets();

    function animateSkillScale() {
      for (let i = 0; i < cards.length; i++) {
        const state = cardStates[i];
        state.current += (state.target - state.current) * 0.14;
        const p = state.current;

        // Smoothly grow from 10% (0.10) to 100% (1.00)
        const scale = 0.10 + p * 0.90;
        const opacity = 0.20 + p * 0.80;

        cards[i].style.setProperty('--skill-card-scale', scale.toFixed(4));
        cards[i].style.setProperty('--skill-card-opacity', opacity.toFixed(4));
      }
    }

    startVisibilityGatedLoop(matrix, animateSkillScale);
  }

  /**
   * 14. STICKY STACKING PROJECT CARDS SCROLL ENGINE
   * Dynamically adjusts sticky top offset when a card is taller than the viewport (e.g., on mobile)
   * so the user can always scroll to see the bottom sandbox of each card before the next card stacks over it.
   */
  function initStickyProjectStack() {
    const cards = Array.from(document.querySelectorAll('.exhibition-card'));
    if (!cards.length) return;

    let ticking = false;

    function updateStickyTopOffsets() {
      const isMobile = window.innerWidth <= 768;
      const baseHeaderOffset = isMobile ? 64 : 88;
      const stepOffset = isMobile ? 14 : 28;
      const viewH = window.innerHeight;

      cards.forEach(function (card, idx) {
        const desiredTop = baseHeaderOffset + idx * stepOffset;
        const cardH = card.offsetHeight;
        // If card is taller than the remaining viewport below desiredTop, shift sticky top negative
        // so the card only sticks AFTER its bottom edge (the sandbox) has scrolled into view!
        if (cardH + desiredTop + 16 > viewH) {
          const adjustedTop = Math.min(desiredTop, viewH - cardH - 16);
          card.style.top = adjustedTop + 'px';
        } else {
          card.style.top = desiredTop + 'px';
        }
      });
    }

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
        const distance = nextRect.bottom - cardRect.bottom;
        const threshold = Math.max(240, cardRect.height * 0.75);

        if (nextRect.top < cardRect.bottom && distance > 0) {
          const overlap = Math.min(1, (cardRect.bottom - nextRect.top) / threshold);
          const scale = 1 - overlap * 0.045;
          const brightness = 1 - overlap * 0.06;
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

    window.addEventListener('resize', function () {
      updateStickyTopOffsets();
      updateStackDepth();
    });

    setTimeout(updateStickyTopOffsets, 120);
    setTimeout(updateStickyTopOffsets, 600);
    updateStickyTopOffsets();
    updateStackDepth();
  }

  /**
   * 15. HERO SECTION SCROLL-EXIT CHOREOGRAPHY
   * As the user scrolls down toward Selected Case Studies (#projects):
   * - On desktop (> 1024px): Left text (.hero-primary-block) and Right card (.hero-bench-card) sit side-by-side
   *   and exit together as the user scrolls toward #projects.
   * - On mobile/tablet (<= 1024px): Left text and Right HUD card are stacked vertically in 1 column.
   *   The top text block pops out in 3D, sweeps top-right, and disappears as the user scrolls down to the card,
   *   while the HUD card (.hero-bench-card) stays 100% full-size and opaque until the user scrolls past the card itself!
   */
  function initHeroScrollExit() {
    const heroSection = document.getElementById('overview');
    const projectsSection = document.getElementById('projects');
    const leftBlock = document.querySelector('.hero-primary-block');
    const rightCard = document.querySelector('.hero-bench-card');

    if (!heroSection || !leftBlock || !rightCard) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    let targetPLeft = 0;
    let currentPLeft = 0;
    let targetPRight = 0;
    let currentPRight = 0;

    function updateHeroScroll() {
      const scrollY = window.scrollY;
      const isStackedMobile = window.innerWidth <= 1024;

      if (!isStackedMobile) {
        const projectsTop = projectsSection
          ? projectsSection.offsetTop - window.innerHeight * 0.25
          : heroSection.offsetHeight;
        const maxScroll = Math.max(260, projectsTop);
        const sharedP = Math.max(0, Math.min(1, scrollY / maxScroll));
        targetPLeft = sharedP;
        targetPRight = sharedP;
      } else {
        // 1. Top Text Block (.hero-primary-block): exits cleanly before the user reaches the HUD card
        const leftExitSpan = Math.max(150, leftBlock.offsetHeight * 0.56);
        targetPLeft = Math.max(0, Math.min(1, (scrollY - 8) / leftExitSpan));

        // 2. Bottom HUD Card (.hero-bench-card): stays at 0 (100% visible & full size) while user scrolls to it and reads it!
        // Only starts shrinking & exiting once the card's untransformed top rises above 22% of the viewport height.
        const cardDocTop = heroSection.offsetTop + rightCard.offsetTop;
        const cardViewportTop = cardDocTop - scrollY;
        const exitStartTop = window.innerHeight * 0.22;
        const exitDistance = Math.max(220, rightCard.offsetHeight * 0.78);

        if (cardViewportTop >= exitStartTop) {
          targetPRight = 0;
        } else {
          targetPRight = Math.max(0, Math.min(1, (exitStartTop - cardViewportTop) / exitDistance));
        }
      }
    }

    window.addEventListener('scroll', updateHeroScroll, { passive: true });
    window.addEventListener('resize', updateHeroScroll);
    updateHeroScroll();

    function renderHeroExit() {
      currentPLeft += (targetPLeft - currentPLeft) * 0.15;
      currentPRight += (targetPRight - currentPRight) * 0.15;

      const pL = currentPLeft;
      const pR = currentPRight;
      const isMobile = window.innerWidth <= 1024;

      // Render Left Text Block (.hero-primary-block)
      if (pL < 0.003) {
        leftBlock.style.transform = '';
        leftBlock.style.opacity = '';
        leftBlock.style.filter = '';
      } else {
        const popBell = Math.sin(Math.min(1, pL * 1.35) * Math.PI);
        const leftScale = 1 + popBell * (isMobile ? 0.08 : 0.14) - pL * (isMobile ? 0.32 : 0.18);
        const leftX = Math.pow(pL, 1.1) * (window.innerWidth * (isMobile ? 0.52 : 0.42));
        const leftY = -Math.pow(pL, 1.08) * (window.innerHeight * (isMobile ? 0.36 : 0.44));
        const leftZ = popBell * (isMobile ? 55 : 90);
        const leftRotZ = pL * (isMobile ? 5 : 5.5);
        const leftOpacity = Math.max(0, 1 - Math.pow(pL, 1.2) * 1.32);

        leftBlock.style.transform =
          'translate3d(' + leftX.toFixed(1) + 'px, ' + leftY.toFixed(1) + 'px, ' + leftZ.toFixed(1) + 'px) ' +
          'scale(' + leftScale.toFixed(3) + ') rotateZ(' + leftRotZ.toFixed(2) + 'deg)';
        leftBlock.style.opacity = leftOpacity.toFixed(3);
        leftBlock.style.filter = 'blur(' + (Math.max(0, pL - 0.3) * 6).toFixed(2) + 'px)';
      }

      // Render Right HUD Card (.hero-bench-card)
      if (pR < 0.003) {
        rightCard.style.transform = '';
        rightCard.style.opacity = '';
        rightCard.style.filter = '';
      } else {
        const rightScale = Math.max(0.28, 1 - pR * 0.72);
        const rightX = Math.pow(pR, 1.05) * (window.innerWidth * (isMobile ? 0.38 : 0.24));
        const rightY = -Math.pow(pR, 1.12) * (window.innerHeight * (isMobile ? 0.36 : 0.48));
        const rightRot = pR * (isMobile ? 6 : 8);
        const rightOpacity = Math.max(0, 1 - Math.pow(pR, 1.22) * 1.28);

        rightCard.style.transform =
          'translate3d(' + rightX.toFixed(1) + 'px, ' + rightY.toFixed(1) + 'px, 0) ' +
          'scale(' + rightScale.toFixed(3) + ') rotateZ(' + rightRot.toFixed(2) + 'deg)';
        rightCard.style.opacity = rightOpacity.toFixed(3);
        rightCard.style.filter = 'blur(' + (Math.max(0, pR - 0.35) * 5).toFixed(2) + 'px)';
      }
    }

    startVisibilityGatedLoop(heroSection, renderHeroExit, '400px 0px 400px 0px');
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
    let portalMouseX = -9999;
    let portalMouseY = -9999;
    const shards = [];

    // Wire interactive lab chips inside Section 04 window to launch the 3D Skill Domain Popup
    section.querySelectorAll('.lusion-lab-chip').forEach(function (chip) {
      chip.addEventListener('click', function () {
        const cardId = chip.getAttribute('data-open-skill-card');
        const skillName = chip.getAttribute('data-skill-highlight');
        const targetCard = cardId ? document.getElementById(cardId) : null;
        if (targetCard && typeof openSkillPopupForCard === 'function') {
          openSkillPopupForCard(targetCard, skillName);
        }
      });
    });

    // Radial cursor spotlight tracking on Section 04 sub-cards and stat pills
    section.querySelectorAll('.lusion-sub-card, .lusion-stat-pill').forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--spot-x', (e.clientX - rect.left).toFixed(1) + 'px');
        card.style.setProperty('--spot-y', (e.clientY - rect.top).toFixed(1) + 'px');
      });
    });

    expandingWindow.addEventListener('mousemove', function (e) {
      const rect = expandingWindow.getBoundingClientRect();
      portalMouseX = e.clientX - rect.left;
      portalMouseY = e.clientY - rect.top;
    });

    expandingWindow.addEventListener('mouseleave', function () {
      portalMouseX = -9999;
      portalMouseY = -9999;
    });

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
          size: 3.5 + (i % 4) * 3.8,
          x: 0,
          y: 0,
          hue: i % 2 === 0 ? 'rgba(212, 155, 106, 0.42)' : 'rgba(63, 123, 73, 0.34)'
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
          s.x = cx + Math.cos(s.angle) * rad * 1.35;
          s.y = cy + Math.sin(s.angle) * rad * 0.72;

          // Subtle cursor attraction inside portal window
          if (portalMouseX > 0) {
            const dx = portalMouseX - s.x;
            const dy = portalMouseY - s.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 180 && dist > 1) {
              const pull = (1 - dist / 180) * 18;
              s.x += (dx / dist) * pull;
              s.y += (dy / dist) * pull;
            }
          }

          pCtx.save();
          pCtx.translate(s.x, s.y);
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

        // Draw delicate golden constellation lines between nearby shards
        for (let i = 0; i < shards.length; i++) {
          for (let j = i + 1; j < shards.length; j++) {
            const dx = shards[i].x - shards[j].x;
            const dy = shards[i].y - shards[j].y;
            const dSq = dx * dx + dy * dy;
            if (dSq < 95 * 95) {
              const alpha = (1 - Math.sqrt(dSq) / 95) * 0.16;
              pCtx.strokeStyle = 'rgba(212, 155, 106, ' + alpha.toFixed(3) + ')';
              pCtx.lineWidth = 1;
              pCtx.beginPath();
              pCtx.moveTo(shards[i].x, shards[i].y);
              pCtx.lineTo(shards[j].x, shards[j].y);
              pCtx.stroke();
            }
          }
        }
      }
    }

    startVisibilityGatedLoop(section, animateStage);
  }

  /**
   * 17. SECTION 03: 3D FAN-OUT BLUEPRINT DECK, RAIL & 3D CURSOR TILT / SPOTLIGHT
   * Deals the 6 Engineering Manifesto cards out from a central stacked deck as the user scrolls,
   * syncs the 01->06 Blueprint Progress Rail, and applies 3D tilt + radial caramel cursor spotlight.
   */
  function initValuesFanOutAndTilt() {
    const section = document.getElementById('values');
    const grid = document.getElementById('values-grid');
    const cards = Array.from(document.querySelectorAll('.value-block'));
    const railFill = document.getElementById('blueprint-rail-fill');
    const railNodes = Array.from(document.querySelectorAll('.rail-node'));

    if (!section || !grid || !cards.length) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Fan-out offsets from the center of the 3x2 grid for each of the 6 cards
    const dealOffsets = [
      { x: 160, y: 95, rot: -9 },
      { x: 0,   y: 105, rot: 0 },
      { x: -160, y: 95, rot: 9 },
      { x: 160, y: -45, rot: 7 },
      { x: 0,   y: -55, rot: 0 },
      { x: -160, y: -45, rot: -7 }
    ];

    let targetScrollP = prefersReducedMotion ? 1 : 0;
    let currentScrollP = prefersReducedMotion ? 1 : 0;
    let hoveredCardIdx = -1;

    function updateValuesScroll() {
      if (prefersReducedMotion) return;
      const rect = grid.getBoundingClientRect();
      const viewH = window.innerHeight;
      const startY = viewH * 0.96;
      const endY = viewH * 0.36;
      const raw = (startY - rect.top) / Math.max(1, startY - endY);
      targetScrollP = Math.max(0, Math.min(1, raw));
    }

    window.addEventListener('scroll', updateValuesScroll, { passive: true });
    window.addEventListener('resize', updateValuesScroll);
    updateValuesScroll();

    // 3D Tilt & Radial Spotlight on each Value Card
    cards.forEach(function (card, idx) {
      card.addEventListener('mousemove', function (e) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const nx = (x / Math.max(1, rect.width) - 0.5) * 2;
        const ny = (y / Math.max(1, rect.height) - 0.5) * 2;

        card.style.setProperty('--spot-x', x.toFixed(1) + 'px');
        card.style.setProperty('--spot-y', y.toFixed(1) + 'px');
        card.style.setProperty('--tilt-x', (-ny * 6.5).toFixed(2) + 'deg');
        card.style.setProperty('--tilt-y', (nx * 6.5).toFixed(2) + 'deg');
        hoveredCardIdx = idx;
        syncRailHighlight();
      });

      card.addEventListener('mouseleave', function () {
        card.style.setProperty('--tilt-x', '0deg');
        card.style.setProperty('--tilt-y', '0deg');
        hoveredCardIdx = -1;
        syncRailHighlight();
      });
    });

    // Interactive Blueprint Rail Nodes
    railNodes.forEach(function (node, idx) {
      node.addEventListener('mouseenter', function () {
        hoveredCardIdx = idx;
        cards.forEach(function (c, cIdx) {
          c.classList.toggle('is-spotlighted', cIdx === idx);
        });
        syncRailHighlight();
      });
      node.addEventListener('mouseleave', function () {
        hoveredCardIdx = -1;
        cards.forEach(function (c) {
          c.classList.remove('is-spotlighted');
        });
        syncRailHighlight();
      });
      node.addEventListener('click', function () {
        if (cards[idx]) {
          cards[idx].scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      });
    });

    function syncRailHighlight() {
      const activeCount = hoveredCardIdx >= 0
        ? hoveredCardIdx + 1
        : Math.max(1, Math.min(6, Math.ceil(currentScrollP * 6)));

      if (railFill) {
        railFill.style.width = ((activeCount / 6) * 100).toFixed(2) + '%';
      }
      railNodes.forEach(function (n, idx) {
        const isActive = hoveredCardIdx >= 0 ? idx === hoveredCardIdx : idx < activeCount;
        n.classList.toggle('is-active', isActive);
        n.setAttribute('aria-selected', String(isActive));
      });
    }

    function animateValuesDeck() {
      currentScrollP += (targetScrollP - currentScrollP) * 0.12;

      for (let i = 0; i < cards.length; i++) {
        const card = cards[i];
        const offset = dealOffsets[i] || { x: 0, y: 0, rot: 0 };
        // Stagger each card slightly along the scroll progress
        const staggerStart = i * 0.06;
        const localP = Math.max(0, Math.min(1, (currentScrollP - staggerStart) / (1 - staggerStart)));
        const inv = 1 - localP;

        const fx = window.innerWidth > 900 ? offset.x * inv : 0;
        const fy = offset.y * inv;
        const frot = window.innerWidth > 900 ? offset.rot * inv : 0;
        const fscale = 0.76 + localP * 0.24;
        const fop = 0.18 + localP * 0.82;

        card.style.setProperty('--fan-x', fx.toFixed(1) + 'px');
        card.style.setProperty('--fan-y', fy.toFixed(1) + 'px');
        card.style.setProperty('--fan-rot', frot.toFixed(2) + 'deg');
        card.style.setProperty('--fan-scale', fscale.toFixed(3));
        card.style.setProperty('--fan-opacity', fop.toFixed(3));
      }

      syncRailHighlight();
    }

    startVisibilityGatedLoop(section, animateValuesDeck);
  }

  /**
   * 18. SECTION 02: PHYSICS-DRIVEN FLOATING WAVE & MAGNETIC SKILL PILLS
   * Gives the 23 skill pills a subtle weightless sine wave drift that pauses on hover
   * and attracts individual pills toward the cursor.
   */
  function initKineticSkillPills() {
    const container = document.querySelector('.skills-all-pills-grid');
    const pills = Array.from(document.querySelectorAll('.master-skill-pill'));
    if (!container || !pills.length) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    let isContainerHovered = false;
    container.addEventListener('mouseenter', function () {
      isContainerHovered = true;
    });
    container.addEventListener('mouseleave', function () {
      isContainerHovered = false;
    });

    let waveTime = 0;
    function animatePillWave() {
      if (!isContainerHovered) {
        waveTime += 0.032;
      }
      for (let i = 0; i < pills.length; i++) {
        const pill = pills[i];
        if (pill.hasAttribute('hidden')) continue;
        const floatY = isContainerHovered ? 0 : Math.sin(waveTime + i * 0.55) * 3.2;
        pill.style.setProperty('--pill-float-y', floatY.toFixed(2) + 'px');
      }
    }

    startVisibilityGatedLoop(container, animatePillWave);
  }

  /**
   * 19. SECTION 05: LIVE CONTACT CONSOLE SIGNAL WAVEFORM
   * Renders a real-time dual-harmonic telemetry sine wave in the contact form header
   * that spikes in amplitude and frequency as the user types.
   */
  function initContactSignalWaveform() {
    const canvas = document.getElementById('contact-waveform-canvas');
    const statusDot = document.getElementById('signal-status-dot');
    const statusText = document.getElementById('signal-status-text');
    const form = document.getElementById('portfolio-contact-form');
    if (!canvas || !form) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let energy = 0;
    let targetEnergy = 0;
    let phase = 0;
    let statusResetTimer = null;

    function triggerSignalSpike(label) {
      targetEnergy = Math.min(1, targetEnergy + 0.45);
      if (statusDot) statusDot.classList.add('is-spiking');
      if (statusText && label) statusText.textContent = label;

      clearTimeout(statusResetTimer);
      statusResetTimer = setTimeout(function () {
        if (statusDot) statusDot.classList.remove('is-spiking');
        if (statusText) statusText.textContent = 'SIGNAL // STANDBY';
      }, 900);
    }

    form.querySelectorAll('input, textarea, select').forEach(function (field) {
      field.addEventListener('input', function () {
        triggerSignalSpike('SIGNAL // MODULATING INPUT');
      });
      field.addEventListener('focus', function () {
        triggerSignalSpike('SIGNAL // CHANNEL LOCKED');
      });
    });

    form.addEventListener('submit', function () {
      targetEnergy = 1;
      triggerSignalSpike('SIGNAL // DISPATCHING PACKET');
    });

    function renderWaveform() {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      targetEnergy *= 0.94;
      energy += (targetEnergy - energy) * 0.18;
      phase += 0.08 + energy * 0.22;

      const midY = h * 0.5;
      const baseAmp = 3.2 + energy * 10.5;
      const freq = 0.055 + energy * 0.045;

      // Secondary echo wave
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(63, 123, 73, 0.35)';
      ctx.lineWidth = 1.3;
      for (let x = 0; x <= w; x += 2) {
        const env = Math.sin((x / w) * Math.PI);
        const y = midY + Math.cos(x * freq * 0.85 - phase * 0.7) * (baseAmp * 0.65) * env;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Primary caramel signal wave
      ctx.beginPath();
      ctx.strokeStyle = '#a86c3b';
      ctx.lineWidth = 1.9;
      for (let x = 0; x <= w; x += 2) {
        const env = Math.sin((x / w) * Math.PI);
        const y = midY + Math.sin(x * freq - phase) * baseAmp * env;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    startVisibilityGatedLoop(canvas, renderWaveform);
  }

  /**
   * 20. GIANT KINETIC TYPOGRAPHY FOOTER WORDMARK
   * Splits 'SARTHAK KSHIRSAGAR' into interactive character spans that lift, scale,
   * and shift toward warm caramel based on Gaussian cursor proximity.
   */
  function initKineticFooterWordmark() {
    const wordmark = document.getElementById('kinetic-wordmark');
    const stage = document.getElementById('footer-kinetic-stage');
    if (!wordmark || !stage) return;

    const rawText = wordmark.getAttribute('data-text') || 'SARTHAK KSHIRSAGAR';
    wordmark.innerHTML = '';

    const charSpans = [];
    for (let i = 0; i < rawText.length; i++) {
      const ch = rawText[i];
      const span = document.createElement('span');
      if (ch === ' ') {
        span.className = 'kinetic-space';
        span.innerHTML = '&nbsp;';
      } else {
        span.className = 'kinetic-char';
        span.textContent = ch;
        charSpans.push({ el: span, y: 0, scale: 1, rot: 0, ty: 0, tscale: 1, trot: 0 });
      }
      wordmark.appendChild(span);
    }

    let pointerX = -9999;
    let isHoveringStage = false;

    stage.addEventListener('mousemove', function (e) {
      pointerX = e.clientX;
      isHoveringStage = true;
    });

    stage.addEventListener('mouseleave', function () {
      isHoveringStage = false;
      pointerX = -9999;
    });

    function animateKineticChars() {
      for (let i = 0; i < charSpans.length; i++) {
        const item = charSpans[i];
        if (isHoveringStage) {
          const rect = item.el.getBoundingClientRect();
          const centerX = rect.left + rect.width * 0.5;
          const dist = Math.abs(pointerX - centerX);
          const radius = 175;
          if (dist < radius) {
            const weight = Math.cos((dist / radius) * (Math.PI * 0.5));
            item.ty = -weight * 18;
            item.tscale = 1 + weight * 0.18;
            item.trot = ((pointerX - centerX) / radius) * -5;
            item.el.style.setProperty('--char-color', weight > 0.35 ? 'var(--accent-caramel)' : 'var(--text-main)');
          } else {
            item.ty = 0;
            item.tscale = 1;
            item.trot = 0;
            item.el.style.setProperty('--char-color', 'var(--text-main)');
          }
        } else {
          item.ty = 0;
          item.tscale = 1;
          item.trot = 0;
          item.el.style.setProperty('--char-color', 'var(--text-main)');
        }

        item.y += (item.ty - item.y) * 0.18;
        item.scale += (item.tscale - item.scale) * 0.18;
        item.rot += (item.trot - item.rot) * 0.18;

        item.el.style.setProperty('--char-y', item.y.toFixed(2) + 'px');
        item.el.style.setProperty('--char-scale', item.scale.toFixed(3));
        item.el.style.setProperty('--char-rot', item.rot.toFixed(2) + 'deg');
      }
    }

    startVisibilityGatedLoop(stage, animateKineticChars);
  }

  /**
   * 21. GLOBAL MAGNETIC PULL BUTTONS & RADIAL CURSOR SPOTLIGHT
   * Adds Framer-Motion-style spring magnetic attraction to primary interactive buttons
   * and radial warm-caramel cursor spotlight tracking across cards.
   */
  function initGlobalMagneticAndSpotlight() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const magneticTargets = document.querySelectorAll(
      '.primary-pill-btn, .secondary-pill-btn, .lusion-approach-pill, .project-action-link, .submit-action-btn, .channel-card, .master-skill-pill'
    );

    magneticTargets.forEach(function (el) {
      let mx = 0;
      let my = 0;
      let tx = 0;
      let ty = 0;
      let vx = 0;
      let vy = 0;
      let rafId = null;

      function stepSpring() {
        vx = (vx + (tx - mx) * 0.2) * 0.74;
        vy = (vy + (ty - my) * 0.2) * 0.74;
        mx += vx;
        my += vy;

        el.style.setProperty('--mag-x', mx.toFixed(2) + 'px');
        el.style.setProperty('--mag-y', my.toFixed(2) + 'px');

        if (Math.abs(tx - mx) > 0.08 || Math.abs(ty - my) > 0.08 || Math.abs(vx) > 0.08 || Math.abs(vy) > 0.08) {
          rafId = window.requestAnimationFrame(stepSpring);
        } else {
          rafId = null;
        }
      }

      el.addEventListener('mousemove', function (e) {
        const rect = el.getBoundingClientRect();
        const dx = e.clientX - (rect.left + rect.width * 0.5);
        const dy = e.clientY - (rect.top + rect.height * 0.5);
        const strength = el.classList.contains('channel-card') ? 0.12 : 0.26;
        tx = Math.max(-10, Math.min(10, dx * strength));
        ty = Math.max(-8, Math.min(8, dy * strength));
        if (!rafId) {
          rafId = window.requestAnimationFrame(stepSpring);
        }
      });

      el.addEventListener('mouseleave', function () {
        tx = 0;
        ty = 0;
        if (!rafId) {
          rafId = window.requestAnimationFrame(stepSpring);
        }
      });
    });

    // Radial spotlight tracking on .stack-card and .channel-card
    document.querySelectorAll('.stack-card, .channel-card').forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--spot-x', (e.clientX - rect.left).toFixed(1) + 'px');
        card.style.setProperty('--spot-y', (e.clientY - rect.top).toFixed(1) + 'px');
      });
    });
  }

  /**
   * 22. SECTION 05: SCROLL-TRIGGERED SPLIT CURTAIN PORTAL & LIVE TIMEZONE SYNC
   * Smoothly parts the left ('READY TO') and right ('ENGINEER?') curtain doors as the user
   * scrolls from Section 04 into Section 05 (#connect), revealing the 3D Envelope and
   * Contact Console underneath, while computing the visitor's real-time offset from IST.
   */
  function initConnectSplitCurtain() {
    const connectSection = document.getElementById('connect');
    const curtain = document.getElementById('connect-split-curtain');
    const tzReadout = document.getElementById('timezone-sync-readout');

    if (!connectSection) return;

    // Live Visitor-to-IST (UTC+5:30) Timezone Sync Calculation
    function updateTimezoneSync() {
      if (!tzReadout) return;
      try {
        const now = new Date();
        const visitorTimeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const istTimeStr = new Intl.DateTimeFormat('en-IN', {
          timeZone: 'Asia/Kolkata',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        }).format(now);

        // Visitor UTC offset in minutes (Date.getTimezoneOffset() is positive west of UTC, negative east)
        const visitorOffsetMins = -now.getTimezoneOffset();
        const istOffsetMins = 330; // UTC+5:30 = +330 mins
        const diffMins = istOffsetMins - visitorOffsetMins;

        let diffLabel = 'Same timezone as Sarthak (IST)';
        if (diffMins !== 0) {
          const absHours = Math.floor(Math.abs(diffMins) / 60);
          const absRemMins = Math.abs(diffMins) % 60;
          const aheadBehind = diffMins > 0 ? 'ahead of you' : 'behind you';
          diffLabel =
            'Sarthak is ' +
            (absHours > 0 ? absHours + 'h ' : '') +
            (absRemMins > 0 ? absRemMins + 'm ' : '') +
            aheadBehind;
        }

        tzReadout.textContent =
          'Your Local: ' + visitorTimeStr + '  ↔  Sarthak: ' + istTimeStr + ' IST (' + diffLabel + ')';
      } catch (e) {
        tzReadout.textContent = 'Sarthak operates in IST (UTC+5:30) • Active for global collaborations';
      }
    }
    updateTimezoneSync();
    setInterval(updateTimezoneSync, 30000);

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || !curtain) {
      connectSection.style.setProperty('--curtain-split', '1');
      return;
    }

    let targetSplit = 0;
    let currentSplit = 0;

    function computeCurtainProgress() {
      const rect = connectSection.getBoundingClientRect();
      const viewH = window.innerHeight;
      // Curtain begins closed (0) when #connect top is at 92% of viewport height
      // and parts completely open (1) by the time #connect top reaches 38% of viewport height
      const startY = viewH * 0.92;
      const endY = viewH * 0.38;
      const raw = (startY - rect.top) / Math.max(1, startY - endY);
      targetSplit = Math.max(0, Math.min(1, raw));
    }

    window.addEventListener('scroll', computeCurtainProgress, { passive: true });
    window.addEventListener('resize', computeCurtainProgress);
    computeCurtainProgress();

    function animateCurtain() {
      currentSplit += (targetSplit - currentSplit) * 0.13;
      connectSection.style.setProperty('--curtain-split', currentSplit.toFixed(4));
    }

    startVisibilityGatedLoop(connectSection, animateCurtain);
  }

  /**
   * 23. UPGRADE 2: HERO SPECIFICATION HUD COUNTERS & INTERACTIVE TELEMETRY READOUT
   * Smoothly counts up the 20+ and 5+ metrics on load, tracks radial cursor spotlight on
   * .hero-bench-card, and updates the bottom telemetry readout when hovering/focusing any spec row.
   */
  function initHeroHudInteractivity() {
    const hudCard = document.getElementById('hero-bench-card') || document.querySelector('.hero-bench-card');
    if (!hudCard) return;

    // Radial cursor spotlight tracking on .hero-bench-card
    hudCard.addEventListener('mousemove', function (e) {
      const rect = hudCard.getBoundingClientRect();
      hudCard.style.setProperty('--spot-x', (e.clientX - rect.left).toFixed(1) + 'px');
      hudCard.style.setProperty('--spot-y', (e.clientY - rect.top).toFixed(1) + 'px');
    });

    // Live Number Counter Animation (0 -> 20 and 0 -> 5)
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const countEls = hudCard.querySelectorAll('.metric-count-val[data-count-target]');
    if (!prefersReducedMotion && countEls.length) {
      countEls.forEach(function (el) {
        const targetVal = parseInt(el.getAttribute('data-count-target'), 10) || 0;
        const duration = 1150;
        const startTime = performance.now();
        el.textContent = '0';

        function stepCount(now) {
          const elapsed = now - startTime;
          const progress = Math.min(1, elapsed / duration);
          const eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = String(Math.round(eased * targetVal));
          if (progress < 1) {
            window.requestAnimationFrame(stepCount);
          } else {
            el.textContent = String(targetVal);
          }
        }
        window.requestAnimationFrame(stepCount);
      });
    }

    // Interactive Spec Row & Metric Cell Telemetry Readout
    const calloutBox = document.getElementById('bench-callout-box');
    const calloutTag = document.getElementById('bench-callout-tag');
    const calloutText = document.getElementById('bench-callout-text');
    const defaultTag = 'TELEMETRY // HOVER OR TAP ANY SPEC';
    const defaultText =
      'Committed to zero framework bloat when vanilla browser APIs deliver superior performance and lower maintenance.';

    const interactiveItems = hudCard.querySelectorAll('[data-hud-spec]');
    interactiveItems.forEach(function (item) {
      function activateSpec() {
        interactiveItems.forEach(function (el) {
          el.classList.toggle('is-spec-active', el === item);
        });
        if (calloutBox) calloutBox.classList.add('is-active-spec');
        if (calloutTag) {
          calloutTag.textContent = item.getAttribute('data-hud-tag') || defaultTag;
        }
        if (calloutText) {
          calloutText.textContent = item.getAttribute('data-hud-spec') || defaultText;
        }
      }

      function resetSpec() {
        item.classList.remove('is-spec-active');
        if (calloutBox) calloutBox.classList.remove('is-active-spec');
        if (calloutTag) calloutTag.textContent = defaultTag;
        if (calloutText) calloutText.textContent = defaultText;
      }

      item.addEventListener('mouseenter', activateSpec);
      item.addEventListener('focus', activateSpec);
      item.addEventListener('click', activateSpec);
      item.addEventListener('mouseleave', resetSpec);
      item.addEventListener('blur', resetSpec);
    });
  }

  /**
   * 24. UPGRADE 6: CUSTOM SVG 'SK' MONOGRAM FAVICON & STRUCTURED JSON-LD SCHEMA
   * Sets a crisp warm-editorial SK monogram SVG favicon and injects Person + SoftwareSourceCode
   * structured data into <head> for search engines and automated portfolio evaluators.
   */
  function initHeadFaviconAndSchema() {
    const faviconLink = document.getElementById('dynamic-svg-favicon');
    if (faviconLink) {
      const svgMarkup =
        '<svg viewBox="0 0 64 64" width="64" height="64">' +
        '<rect width="64" height="64" rx="16" fill="#251e18"/>' +
        '<rect x="3" y="3" width="58" height="58" rx="13" fill="none" stroke="#a86c3b" stroke-width="2.5"/>' +
        '<text x="31" y="41" text-anchor="middle" font-family="monospace" font-weight="700" font-size="24" fill="#fbf8f3">SK</text>' +
        '<circle cx="51" cy="14" r="5" fill="#3f7b49" stroke="#fbf8f3" stroke-width="1.5"/>' +
        '</svg>';
      faviconLink.setAttribute('href', 'data:image/svg+xml;utf8,' + encodeURIComponent(svgMarkup));
    }

    if (!document.getElementById('portfolio-jsonld-schema')) {
      const proto = ['https:', ''].join('/');
      const schemaObj = {
        '@context': proto + '/schema.org',
        '@graph': [
          {
            '@type': 'Person',
            name: 'Sarthak Kshirsagar',
            jobTitle: 'CS & AI/ML Undergraduate & Frontend Engineer',
            email: 'mailto:Sarthak.v.k.2275@gmail.com',
            affiliation: {
              '@type': 'CollegeOrUniversity',
              name: 'Newton School of Technology'
            },
            sameAs: [
              proto + '/github.com/Sarthak-Kshirsagar-2275',
              proto + '/github.com/Sarthak-Kshirsagar-2275/My-Portfolio'
            ],
            knowsAbout: [
              'HTML5',
              'CSS3',
              'Vanilla JavaScript',
              'Next.js',
              'Three.js',
              'Node.js',
              'Express.js',
              'Python',
              'PyTorch',
              'OpenCV',
              'Remote Photoplethysmography (rPPG)'
            ]
          },
          {
            '@type': 'SoftwareSourceCode',
            name: 'Sarthak Kshirsagar Portfolio',
            programmingLanguage: ['HTML5', 'CSS3', 'JavaScript'],
            codeRepository: proto + '/github.com/Sarthak-Kshirsagar-2275/My-Portfolio'
          }
        ]
      };
      const scriptEl = document.createElement('script');
      scriptEl.id = 'portfolio-jsonld-schema';
      scriptEl.type = 'application/ld+json';
      scriptEl.textContent = JSON.stringify(schemaObj);
      document.head.appendChild(scriptEl);
    }
  }

})();
