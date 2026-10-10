/**
 * OUR STORIES — Motion & ScrollTrigger Controller
 */

document.addEventListener('DOMContentLoaded', () => {
  gsap.registerPlugin(ScrollTrigger);

  const lenis = initLenis();
  initHeaderScroll();

  initHeroAnimations();
  initFilterTitleAnimations();
  initPinnedBrassSequence();
  initBrassCraftAnimations();
  initRitualHomeAnimations();
  initArchRevealSequence();
  initPhotoStoryAnimations();
  initWetPaintButtons();
});

/* ==========================================
   01. LENIS SMOOTH SCROLLING
   ========================================== */
function initLenis() {
  const lenis = new Lenis({
    duration: 1.0,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    touchMultiplier: 1.5
  });

  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(1000, 16);
  return lenis;
}

/* ==========================================
   02. HEADER SCROLL STATE
   ========================================== */
function initHeaderScroll() {
  const header = document.getElementById('site-header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });
}

/* ==========================================
   03. SECTION 1 — HERO ANIMATIONS
   ========================================== */
function initHeroAnimations() {
  gsap.timeline({
    scrollTrigger: {
      trigger: '#hero',
      start: 'top top',
      end: 'bottom top',
      scrub: true
    }
  })
  .to('.hero-content', { y: -80, opacity: 0, ease: 'none' }, 0)
  .to('.hero-video-container', { scale: 1.2, opacity: 0.3, ease: 'none' }, 0);
}

/* ==========================================
   04. SECTION 2 — FILTER TITLE ANIMATIONS
   ========================================== */
function initFilterTitleAnimations() {
  gsap.timeline({
    scrollTrigger: {
      trigger: '#filter-title',
      start: 'top 80%',
      end: 'bottom top',
      scrub: 1
    }
  })
  .from('.title-left', { x: -60, opacity: 0 }, 0)
  .from('.title-right', { x: 60, opacity: 0 }, 0)
  .from('#title-brass-frame', { scale: 0.95 }, 0.2)
  .to('.dripping-shape-img', { y: -30, ease: 'none' }, 0);
}

/* ==========================================
   05. SECTION 3 — PINNED BRASS POUR SEQUENCE
   ========================================== */
function initPinnedBrassSequence() {
  const beats = document.querySelectorAll('.pour-beat');
  const video = document.getElementById('brass-pour-video');
  const beanThumb = document.getElementById('bean-thumb');
  const trackProgress = document.getElementById('bean-track-progress');
  const tickDots = document.querySelectorAll('.track-tick');
  const stepLabels = document.querySelectorAll('.step-label');
  const counterCurrent = document.getElementById('counter-current');

  if (video) {
    video.pause();
    video.muted = true;
    video.playsInline = true;
  }

  let targetVideoTime = 0;
  let isSeeking = false;

  if (video) {
    video.addEventListener('seeked', () => { isSeeking = false; });
  }

  function syncVideoFrame() {
    if (video && video.duration && !isSeeking) {
      if (Math.abs(video.currentTime - targetVideoTime) > 0.03) {
        isSeeking = true;
        if ('fastSeek' in video) {
          try {
            video.fastSeek(targetVideoTime);
          } catch (e) {
            video.currentTime = targetVideoTime;
          }
        } else {
          video.currentTime = targetVideoTime;
        }
      }
    }
    requestAnimationFrame(syncVideoFrame);
  }
  requestAnimationFrame(syncVideoFrame);

  let lastStep = -1;

  ScrollTrigger.create({
    trigger: '#brass-pour',
    start: 'top top',
    end: '+=300%',
    pin: '.pinned-canvas-wrapper',
    scrub: 0.6,
    onUpdate: (self) => {
      const p = self.progress;

      // 1. Smoothly scrub video with scroll
      if (video && video.duration) {
        targetVideoTime = Math.min(video.duration - 0.05, Math.max(0, p * video.duration));
      }

      // 2. Slide 3D coffee bean thumb and track progress
      const beanPercent = 4 + (p * 92);
      if (beanThumb) {
        beanThumb.style.left = `${beanPercent}%`;
      }
      if (trackProgress) {
        trackProgress.style.width = `${beanPercent}%`;
      }

      // 3. Update step index and beat copy
      const stepIndex = Math.min(3, Math.floor(p * 4));

      if (stepIndex !== lastStep) {
        lastStep = stepIndex;

        beats.forEach((beat, idx) => {
          beat.classList.toggle('active', idx === stepIndex);
        });

        tickDots.forEach((tick, idx) => {
          tick.classList.toggle('active', idx === stepIndex);
          tick.classList.toggle('passed', idx < stepIndex);
        });

        stepLabels.forEach((label, idx) => {
          label.classList.toggle('active', idx === stepIndex);
        });

        if (counterCurrent) {
          counterCurrent.textContent = `0${stepIndex + 1}`;
        }
      }
    }
  });

  // Also support clicking directly on ticks to navigate steps
  tickDots.forEach((tick) => {
    tick.addEventListener('click', () => {
      const step = parseInt(tick.getAttribute('data-step'), 10) - 1;
      const progressTarget = step / 3;
      const st = ScrollTrigger.getById('brass-pour') || ScrollTrigger.getAll().find(s => s.vars.trigger === '#brass-pour');
      if (st) {
        const targetScroll = st.start + (st.end - st.start) * progressTarget;
        window.scrollTo({ top: targetScroll, behavior: 'smooth' });
      }
    });
  });
}

/* ==========================================
   05B. SECTION 3B — THE SACRED RATIO & BRASS CRAFT
   ========================================== */
function initBrassCraftAnimations() {
  const cupImg = document.getElementById('craft-cup-img');

  if (cupImg) {
    gsap.timeline({
      scrollTrigger: {
        trigger: '#brass-craft',
        start: 'top 80%',
        end: 'bottom 20%',
        scrub: 1.2
      }
    })
    .fromTo(cupImg, 
      { y: 50, scale: 0.94, rotation: -2 }, 
      { y: -30, scale: 1.04, rotation: 1, ease: 'power1.out' }
    );
  }

  gsap.from('.craft-pillar-item', {
    scrollTrigger: {
      trigger: '#brass-craft',
      start: 'top 75%'
    },
    x: -40,
    opacity: 0,
    stagger: 0.18,
    duration: 0.8,
    ease: 'power2.out'
  });
}

/* ==========================================
   06. SECTION 4 — RITUAL HOME & 3D TACTILE CARDS
   ========================================== */
function initRitualHomeAnimations() {
  if (window.CoffeeBeansCanvas) {
    new window.CoffeeBeansCanvas('beans-canvas');
  }

  // Entrance animation
  gsap.from('.order-card', {
    scrollTrigger: {
      trigger: '#ritual-grid',
      start: 'top 85%'
    },
    y: 50,
    opacity: 0,
    duration: 0.8,
    stagger: 0.12,
    ease: 'power2.out'
  });

  // ThreeUI Tactile 3D Tilt Interaction on mouse move
  const cards = document.querySelectorAll('.order-card[data-tilt]');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      const rotX = -y * 14;
      const rotY = x * 14;

      card.style.transform = `perspective(1000px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) translateY(-8px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    });
  });
}

/* ==========================================
   07. SECTION 5 — ARCH TO FULL-BLEED REVEAL
   ========================================== */
function initArchRevealSequence() {
  const archFrame = document.getElementById('arch-frame');
  const archHeader = document.getElementById('arch-header-box');

  ScrollTrigger.create({
    trigger: '#coorg-arch',
    start: 'top top',
    end: '+=130%',
    pin: '.arch-sticky-wrapper',
    scrub: 0.8,
    onUpdate: (self) => {
      const p = self.progress;

      if (archFrame) {
        const startW = Math.min(380, window.innerWidth * 0.85);
        const startH = Math.min(480, window.innerHeight * 0.62);

        // Expand aperture shape smoothly to full viewport without distorting image
        const currentW = startW + (window.innerWidth - startW) * p;
        const currentH = startH + (window.innerHeight - startH) * p;
        const currentRadius = (startW / 2) * (1 - p);
        const currentMarginTop = (1 - p) * 60;

        archFrame.style.width = `${currentW}px`;
        archFrame.style.height = `${currentH}px`;
        archFrame.style.borderRadius = `${currentRadius}px ${currentRadius}px 0 0`;
        archFrame.style.marginTop = `${currentMarginTop}px`;
        archFrame.style.transform = 'none';
      }

      if (archHeader) {
        archHeader.style.opacity = `${Math.max(0, 1 - p * 2.2)}`;
        archHeader.style.transform = `translate3d(0, ${-p * 60}px, 0)`;
      }
    }
  });
}

/* ==========================================
   08. SECTION 6 — FULL-SCREEN HD PHOTO STORY
   ========================================== */
function initPhotoStoryAnimations() {
  const img1 = document.getElementById('story-img-1');
  const img2 = document.getElementById('story-img-2');
  const img3 = document.getElementById('story-img-3');

  const cap1 = document.getElementById('cap-1');
  const cap2 = document.getElementById('cap-2');
  const cap3 = document.getElementById('cap-3');

  const dots = document.querySelectorAll('.story-dot');

  ScrollTrigger.create({
    trigger: '#photo-story',
    start: 'top top',
    end: '+=180%',
    pin: true,
    scrub: 0.8,
    onUpdate: (self) => {
      const p = self.progress;

      // Active slide index: 0, 1, or 2
      let activeIndex = 0;
      if (p >= 0.66) {
        activeIndex = 2;
      } else if (p >= 0.33) {
        activeIndex = 1;
      } else {
        activeIndex = 0;
      }

      // Update image crossfades and zooms
      if (img1) {
        img1.classList.toggle('active', activeIndex === 0);
        img1.style.transform = `scale(${1.04 + p * 0.08})`;
      }
      if (img2) {
        img2.classList.toggle('active', activeIndex === 1);
        img2.style.transform = `scale(${1.04 + (p - 0.33) * 0.08})`;
      }
      if (img3) {
        img3.classList.toggle('active', activeIndex === 2);
        img3.style.transform = `scale(${1.04 + (p - 0.66) * 0.08})`;
      }

      // Update captions
      if (cap1) cap1.classList.toggle('active', activeIndex === 0);
      if (cap2) cap2.classList.toggle('active', activeIndex === 1);
      if (cap3) cap3.classList.toggle('active', activeIndex === 2);

      // Update dots
      dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === activeIndex);
      });
    }
  });
}

/* ==========================================
   09. WET PAINT BUTTONS (Hover.dev Coffee Drip Injector)
   ========================================== */
function initWetPaintButtons() {
  const dripMarkup = `
    <div class="drip-stem-wrap drip-1"><div class="drip-stem" style="height:22px"></div><svg width="6" height="6" viewBox="0 0 6 6" fill="none" class="drip-fillet-left" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M5.4 0H0V5.4C0 2.41765 2.41766 0 5.4 0Z" class="fillet-path"/></svg><svg width="6" height="6" viewBox="0 0 6 6" fill="none" class="drip-fillet-right" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M5.4 0H0V5.4C0 2.41765 2.41766 0 5.4 0Z" class="fillet-path"/></svg><div class="drip-droplet"></div></div>
    <div class="drip-stem-wrap drip-2"><div class="drip-stem" style="height:18px"></div><svg width="6" height="6" viewBox="0 0 6 6" fill="none" class="drip-fillet-left" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M5.4 0H0V5.4C0 2.41765 2.41766 0 5.4 0Z" class="fillet-path"/></svg><svg width="6" height="6" viewBox="0 0 6 6" fill="none" class="drip-fillet-right" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M5.4 0H0V5.4C0 2.41765 2.41766 0 5.4 0Z" class="fillet-path"/></svg><div class="drip-droplet"></div></div>
    <div class="drip-stem-wrap drip-3"><div class="drip-stem" style="height:10px"></div><svg width="6" height="6" viewBox="0 0 6 6" fill="none" class="drip-fillet-left" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M5.4 0H0V5.4C0 2.41765 2.41766 0 5.4 0Z" class="fillet-path"/></svg><svg width="6" height="6" viewBox="0 0 6 6" fill="none" class="drip-fillet-right" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M5.4 0H0V5.4C0 2.41765 2.41766 0 5.4 0Z" class="fillet-path"/></svg><div class="drip-droplet"></div></div>
    <div class="drip-stem-wrap drip-4"><div class="drip-stem" style="height:15px"></div><svg width="6" height="6" viewBox="0 0 6 6" fill="none" class="drip-fillet-left" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M5.4 0H0V5.4C0 2.41765 2.41766 0 5.4 0Z" class="fillet-path"/></svg><svg width="6" height="6" viewBox="0 0 6 6" fill="none" class="drip-fillet-right" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M5.4 0H0V5.4C0 2.41765 2.41766 0 5.4 0Z" class="fillet-path"/></svg><div class="drip-droplet"></div></div>
  `;

  const buttons = document.querySelectorAll('.wet-paint-btn');
  buttons.forEach(btn => {
    if (!btn.querySelector('.drip-stem-wrap')) {
      btn.insertAdjacentHTML('beforeend', dripMarkup);
    }
  });
}
