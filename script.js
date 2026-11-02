/**
 * ==========================================================================
 * SARTHAK KSHIRSAGAR — PERSONAL PORTFOLIO
 * Vanilla JavaScript (Zero External Libraries / Zero Frameworks)
 * Strict Semantic Logic & Accessible Interaction Handlers
 * ==========================================================================
 */

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
    initExpandableSkillCards();
    initBatchAccordionControls();
    initSkillMasterDirectory();
    initProjectFilters();
    initProjectBlueprintToggles();
    initContactFormConsole();
    initFooterYear();
  }

  /**
   * 01. LIVE CLOCK (IST / Indian Standard Time)
   * Displays local time in India (UTC+5:30) for contextual availability
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
        // Fallback to local time string if Intl timezone fails
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

    // Close when clicking any nav link
    nav.querySelectorAll('.nav-anchor').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('is-open');
        trigger.setAttribute('aria-expanded', 'false');
        trigger.classList.remove('is-active');
      });
    });

    // Close on outside click
    document.addEventListener('click', function (e) {
      if (nav.classList.contains('is-open')) {
        if (!nav.contains(e.target) && !trigger.contains(e.target)) {
          nav.classList.remove('is-open');
          trigger.setAttribute('aria-expanded', 'false');
          trigger.classList.remove('is-active');
        }
      }
    });

    // Close on Escape key press
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
   * 06. EXPANDABLE SKILLS CARDS (USER '+' ICON UI REQUIREMENT)
   * Smoothly expands/collapses grouped skill sub-items with '+' rotate animation
   */
  function setSkillCardExpanded(card, shouldExpand) {
    if (!card) return;
    const trigger = card.querySelector('.expand-card-trigger');
    const tray = card.querySelector('.stack-expandable-tray');
    if (!trigger || !tray) return;

    if (shouldExpand) {
      card.classList.add('is-expanded');
      tray.removeAttribute('hidden');
      trigger.setAttribute('aria-expanded', 'true');
      const label = trigger.querySelector('.trigger-label');
      if (label) label.textContent = 'Hide Sub-Items & Details';
    } else {
      card.classList.remove('is-expanded');
      tray.setAttribute('hidden', '');
      trigger.setAttribute('aria-expanded', 'false');
      const label = trigger.querySelector('.trigger-label');
      if (label) label.textContent = 'Inspect Sub-Items & Details';
    }
  }

  function initExpandableSkillCards() {
    const cards = document.querySelectorAll('.stack-card');

    cards.forEach(function (card) {
      const trigger = card.querySelector('.expand-card-trigger');
      const tray = card.querySelector('.stack-expandable-tray');
      if (!trigger || !tray) return;

      trigger.addEventListener('click', function () {
        const shouldExpand = !card.classList.contains('is-expanded');
        setSkillCardExpanded(card, shouldExpand);
      });
    });
  }

  /**
   * 07. BATCH ACCORDION CONTROLS (EXPAND ALL / COLLAPSE ALL)
   */
  function initBatchAccordionControls() {
    const expandAllBtn = document.getElementById('btn-expand-all');
    const collapseAllBtn = document.getElementById('btn-collapse-all');
    const cards = document.querySelectorAll('.stack-card');

    if (expandAllBtn) {
      expandAllBtn.addEventListener('click', function () {
        cards.forEach(function (card) {
          card.removeAttribute('hidden');
          setSkillCardExpanded(card, true);
        });
      });
    }

    if (collapseAllBtn) {
      collapseAllBtn.addEventListener('click', function () {
        cards.forEach(function (card) {
          setSkillCardExpanded(card, false);
        });
      });
    }
  }

  /**
   * 07B. MASTER SKILL DIRECTORY & DOMAIN FILTERING
   * Lets visitors filter by domain or click any of the 23 skill pills to focus its card
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
            setSkillCardExpanded(card, true);
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

        // Ensure card is visible and expanded
        targetCard.removeAttribute('hidden');
        setSkillCardExpanded(targetCard, true);

        skillPills.forEach(function (p) {
          p.classList.remove('is-highlighted');
        });
        pill.classList.add('is-highlighted');

        targetCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
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

        // Update active tab state
        filterTabs.forEach(function (t) {
          t.classList.remove('active');
          t.setAttribute('aria-selected', 'false');
        });
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');

        // Filter projects
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

})();
