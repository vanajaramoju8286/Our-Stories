/**
 * OUR STORIES — LUXURY COFFEE BRAND WEBSITE
 * Interactive Motion & Experience Controller
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeroExperience();
  initHeaderScroll();
  initMobileNav();
  initRitualSection();
  initProcessTimeline();
  initQuickViewModal();
  initScrollAnimations();
  initBackToTop();
});

/* ==========================================
   01. HERO VIDEO & CINEMATIC REVEAL
   ========================================== */
function initHeroExperience() {
  const heroSection = document.getElementById('hero');
  const heroVideo = document.getElementById('hero-video');
  const replayBtn = document.getElementById('replay-video-btn');
  const heroCanvas = document.getElementById('hero-canvas-fallback');
  let revealTriggered = false;

  function triggerCinematicReveal() {
    if (revealTriggered) return;
    revealTriggered = true;

    // Add finished class to activate dark vignette, blur background and reveal center logo & text
    heroSection.classList.add('video-finished');
  }

  // 1. Listen for video ended event
  if (heroVideo) {
    heroVideo.addEventListener('ended', () => {
      triggerCinematicReveal();
    });

    // Handle video load error or autoplay restriction fallback
    heroVideo.addEventListener('error', () => {
      if (heroCanvas) heroCanvas.style.opacity = '1';
      setTimeout(triggerCinematicReveal, 3500);
    });

    // Auto-trigger fallback timer in case video duration is short or loops
    heroVideo.addEventListener('loadedmetadata', () => {
      const duration = heroVideo.duration;
      if (duration && duration > 0 && isFinite(duration)) {
        setTimeout(triggerCinematicReveal, (duration * 1000) - 200);
      } else {
        setTimeout(triggerCinematicReveal, 5000);
      }
    });

    // Fallback safety timeout (6 seconds max before showing reveal)
    setTimeout(() => {
      if (!revealTriggered) {
        triggerCinematicReveal();
      }
    }, 6000);
  } else {
    // If no video element, fallback immediately
    setTimeout(triggerCinematicReveal, 1500);
  }

  // 2. Replay Experience Button
  if (replayBtn) {
    replayBtn.addEventListener('click', () => {
      revealTriggered = false;
      heroSection.classList.remove('video-finished');
      
      if (heroVideo) {
        heroVideo.currentTime = 0;
        const playPromise = heroVideo.play();
        if (playPromise !== undefined) {
          playPromise.catch(err => {
            console.log('Autoplay prevented on replay:', err);
            setTimeout(triggerCinematicReveal, 4000);
          });
        }
      } else {
        setTimeout(triggerCinematicReveal, 4000);
      }
    });
  }
}

/* ==========================================
   02. HEADER SCROLL & GLASSMORPHISM
   ========================================== */
function initHeaderScroll() {
  const header = document.getElementById('site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });
}

/* ==========================================
   03. MOBILE NAVIGATION MENU
   ========================================== */
function initMobileNav() {
  const toggleBtn = document.getElementById('mobile-nav-toggle');
  const navOverlay = document.getElementById('mobile-nav-overlay');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  if (toggleBtn && navOverlay) {
    toggleBtn.addEventListener('click', () => {
      navOverlay.classList.toggle('active');
      document.body.style.overflow = navOverlay.classList.contains('active') ? 'hidden' : '';
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        navOverlay.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }
}

/* ==========================================
   04. SECTION 02 — THE RITUAL EXPERIENCE
   ========================================== */
const RITUAL_DATA = [
  {
    step: 1,
    title: "The Brass Filter Decoction",
    indicator: "01 — BREWING DECOCTION",
    desc: "Freshly ground dark roast coffee and chicory are tamped inside a heavy brass filter. Boiling spring water trickles slowly over the bed, extracting a dense, aromatic decoction over twenty patient minutes.",
    badge: "STEP 01 / 04",
    img: "assets/ritual_pour.jpg",
    features: [
      "Traditional Heavy-Gauge Brass Filter",
      "Slow Gravity Extraction at 92°C",
      "80:20 Arabica & Chicory Harmony"
    ]
  },
  {
    step: 2,
    title: "The Aerated Brass Pour",
    indicator: "02 — AERATION & POUR",
    desc: "The steaming hot decoction is combined with scalded whole milk and poured back and forth between the dabara bowl and tumbler in wide sweeping arcs, creating a velvety natural micro-foam.",
    badge: "STEP 02 / 04",
    img: "assets/ritual_pour.jpg",
    features: [
      "High-Arc Traditional Pouring Technique",
      "Silky Micro-foam Without Steam Wands",
      "Temperature Stabilization in Solid Brass"
    ]
  },
  {
    step: 3,
    title: "The Awakening Aroma",
    indicator: "03 — AROMA RELEASE",
    desc: "As the frothy coffee rests in the brass tumbler, dark chocolate, toasted caramel, and wild monsoon spice notes rise with the steam, awakening the senses before the first sip.",
    badge: "STEP 03 / 04",
    img: "assets/hero_plantation.jpg",
    features: [
      "Notes of Roasted Nutmeg & Dark Cocoa",
      "Infused with Pure Plantation Essence",
      "Rich Crema Retention"
    ]
  },
  {
    step: 4,
    title: "The Sacred Morning Cup",
    indicator: "04 — THE SACRED CUP",
    desc: "Served in hand-hammered brass dabaraware that retains heat to the last drop. A morning ritual cherished across generations of South Indian coffee connoisseurs.",
    badge: "STEP 04 / 04",
    img: "assets/product_filter_coffee.jpg",
    features: [
      "Hand-Hammered Brass Dabara Set",
      "Balanced Bitterness & Sweet Crema",
      "Rooted in 300 Years of Tradition"
    ]
  }
];

function initRitualSection() {
  let currentStep = 1;
  const stepBtns = document.querySelectorAll('.ritual-step-btn');
  const prevBtn = document.getElementById('ritual-prev-btn');
  const nextBtn = document.getElementById('ritual-next-btn');
  const dots = document.querySelectorAll('.ritual-step-dots .dot');

  const titleEl = document.getElementById('ritual-step-title');
  const indicatorEl = document.getElementById('ritual-step-indicator');
  const descEl = document.getElementById('ritual-step-desc');
  const badgeEl = document.getElementById('ritual-media-badge');
  const imgEl = document.getElementById('ritual-active-img');
  const featList = document.getElementById('ritual-features-list');

  function updateStep(stepNum) {
    currentStep = stepNum;
    const data = RITUAL_DATA.find(d => d.step === currentStep);
    if (!data) return;

    // Update active nav buttons & dots
    stepBtns.forEach(btn => {
      btn.classList.toggle('active', parseInt(btn.dataset.step) === currentStep);
    });

    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === currentStep - 1);
    });

    // Content animation crossfade
    if (imgEl) {
      imgEl.style.opacity = '0.4';
      setTimeout(() => {
        imgEl.src = data.img;
        imgEl.style.opacity = '1';
      }, 250);
    }

    if (titleEl) titleEl.textContent = data.title;
    if (indicatorEl) indicatorEl.textContent = data.indicator;
    if (descEl) descEl.textContent = data.desc;
    if (badgeEl) badgeEl.textContent = data.badge;

    if (featList) {
      featList.innerHTML = data.features.map(f => `
        <div class="feature-item">
          <span class="feat-icon">✦</span>
          <span class="feat-text">${f}</span>
        </div>
      `).join('');
    }
  }

  stepBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      updateStep(parseInt(btn.dataset.step));
    });
  });

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      const prev = currentStep > 1 ? currentStep - 1 : 4;
      updateStep(prev);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      const next = currentStep < 4 ? currentStep + 1 : 1;
      updateStep(next);
    });
  }
}

/* ==========================================
   05. SECTION 07 — PROCESS TIMELINE
   ========================================== */
function initProcessTimeline() {
  const nodes = document.querySelectorAll('.timeline-node');
  nodes.forEach(node => {
    node.addEventListener('click', () => {
      nodes.forEach(n => n.classList.remove('active'));
      node.classList.add('active');
    });
  });
}

/* ==========================================
   06. PRODUCT QUICK VIEW & TOAST NOTIFICATION
   ========================================== */
const PRODUCT_DATA = {
  'filter-coffee': {
    name: 'Our Stories Filter Coffee',
    price: '₹450',
    origin: 'CHIKMAGALUR SINGLE ORIGIN',
    desc: 'Traditional South Indian Filter Coffee ground for gravity extraction. Crafted with 80% shade-grown Arabica and 20% dark roasted jamnagar chicory.',
    img: 'assets/product_filter_coffee.jpg'
  },
  'south-indian': {
    name: 'Our Stories South Indian Blend',
    price: '₹480',
    origin: 'BABA BUDAN RANGE',
    desc: 'Dark roasted full-bodied espresso & filter blend with deep chocolate malt notes and velvety mouthfeel.',
    img: 'assets/product_south_indian.jpg'
  },
  'signature': {
    name: 'Our Stories Signature Blend',
    price: '₹520',
    origin: 'COORG CANOPY ESTATE',
    desc: 'Medium roast 100% Arabica reserve with wild honey, toasted almond, and subtle floral jasmine aroma.',
    img: 'assets/product_signature.jpg'
  },
  'estate': {
    name: 'Our Stories Estate Coffee',
    price: '₹580',
    origin: 'SHADE GROWN RESERVE',
    desc: 'High-elevation micro-lot single estate coffee with bright black cherry acidity and warm brown sugar finish.',
    img: 'assets/product_estate.jpg'
  }
};

function initQuickViewModal() {
  const modal = document.getElementById('quick-view-modal');
  const closeBtn = document.getElementById('modal-close-btn');
  const backdrop = document.getElementById('modal-backdrop');
  const quickBtns = document.querySelectorAll('.quick-view-btn');
  const addCartBtns = document.querySelectorAll('.add-to-cart-btn');
  const modalAddBtn = document.getElementById('modal-add-btn');

  const modalImg = document.getElementById('modal-img');
  const modalTitle = document.getElementById('modal-title');
  const modalPrice = document.getElementById('modal-price');
  const modalDesc = document.getElementById('modal-desc');
  const modalTag = document.getElementById('modal-tag');

  function openModal(key) {
    const p = PRODUCT_DATA[key] || PRODUCT_DATA['filter-coffee'];
    if (modalImg) modalImg.src = p.img;
    if (modalTitle) modalTitle.textContent = p.name;
    if (modalPrice) modalPrice.textContent = p.price;
    if (modalDesc) modalDesc.textContent = p.desc;
    if (modalTag) modalTag.textContent = p.origin;

    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  quickBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const productKey = btn.dataset.product || 'filter-coffee';
      openModal(productKey);
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (backdrop) backdrop.addEventListener('click', closeModal);

  // Option selectors in modal
  const grindOpts = document.querySelectorAll('.grind-opt');
  grindOpts.forEach(opt => {
    opt.addEventListener('click', () => {
      grindOpts.forEach(o => o.classList.remove('active'));
      opt.classList.add('active');
    });
  });

  const weightOpts = document.querySelectorAll('.weight-opt');
  weightOpts.forEach(opt => {
    opt.addEventListener('click', () => {
      weightOpts.forEach(o => o.classList.remove('active'));
      opt.classList.add('active');
    });
  });

  // Add to cart triggers
  addCartBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const name = btn.dataset.name || 'Coffee';
      showToast(`${name} added to selection`);
    });
  });

  if (modalAddBtn) {
    modalAddBtn.addEventListener('click', () => {
      closeModal();
      showToast('Item added to your selection');
    });
  }
}

function showToast(message) {
  const toast = document.getElementById('toast-notification');
  const toastMsg = document.getElementById('toast-msg');
  if (!toast || !toastMsg) return;

  toastMsg.textContent = message;
  toast.classList.add('active');

  setTimeout(() => {
    toast.classList.remove('active');
  }, 3500);
}

/* ==========================================
   07. SCROLL REVEAL ANIMATIONS
   ========================================== */
function initScrollAnimations() {
  const revealElements = document.querySelectorAll('[data-reveal]');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.revealDelay || 0;
        setTimeout(() => {
          entry.target.classList.add('revealed');
        }, parseInt(delay));
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => observer.observe(el));
}

/* ==========================================
   08. BACK TO TOP
   ========================================== */
function initBackToTop() {
  const topBtn = document.getElementById('back-to-top');
  if (topBtn) {
    topBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
}
