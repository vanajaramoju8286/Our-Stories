/**
 * OUR STORIES — Main Entry Script
 */

document.addEventListener('DOMContentLoaded', () => {
  initSitePreloader();
  initCuteCursor();
  initVideoPlayback();
  initRitualVideo();
  initMobileToggle();
  initBackToTop();
});

/* ==========================================
   01. HERO VIDEO PLAYBACK & FALLBACK
   ========================================== */
function initVideoPlayback() {
  const video = document.getElementById('hero-video');
  const fallback = document.querySelector('.hero-video-fallback');

  if (video) {
    video.muted = true;
    video.playsInline = true;

    // Slow down playback rate to 0.5x (half speed) to double play time from 8s to 16s
    const targetPlaybackRate = 0.5;
    video.playbackRate = targetPlaybackRate;

    video.addEventListener('loadedmetadata', () => {
      video.playbackRate = targetPlaybackRate;
    });

    video.addEventListener('play', () => {
      video.playbackRate = targetPlaybackRate;
    });

    video.addEventListener('seeked', () => {
      video.playbackRate = targetPlaybackRate;
    });

    // Smooth seamless loop crossfade
    video.addEventListener('timeupdate', () => {
      if (video.duration && isFinite(video.duration)) {
        const timeLeft = video.duration - video.currentTime;
        if (timeLeft < 0.35 && timeLeft > 0) {
          video.style.opacity = '0.75';
        } else {
          video.style.opacity = '1';
        }
      }
    });

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          video.playbackRate = targetPlaybackRate;
          if (fallback) fallback.style.opacity = '0';
        })
        .catch(err => {
          console.log('Hero video autoplay fallback triggered:', err);
          if (fallback) fallback.style.opacity = '1';
        });
    }

    video.addEventListener('playing', () => {
      video.playbackRate = targetPlaybackRate;
      if (fallback) fallback.style.opacity = '0';
    });

    video.addEventListener('error', () => {
      if (fallback) fallback.style.opacity = '1';
    });
  }
}

/* ==========================================
   02. RITUAL BEANS VIDEO PLAYBACK
   ========================================== */
function initRitualVideo() {
  const video = document.getElementById('ritual-beans-video');
  if (video) {
    video.muted = true;
    video.playsInline = true;
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(err => {
        console.log('Ritual video autoplay notice:', err);
      });
    }
  }
}

/* ==========================================
   03. MOBILE NAVIGATION TOGGLE
   ========================================== */
function initMobileToggle() {
  const toggleBtn = document.getElementById('mobile-toggle');
  const nav = document.querySelector('.header-nav');

  if (toggleBtn && nav) {
    toggleBtn.addEventListener('click', () => {
      nav.classList.toggle('active');
      toggleBtn.classList.toggle('open');
    });
  }
}

/* ==========================================
   04. BACK TO TOP BUTTON
   ========================================== */
function initBackToTop() {
  const btn = document.getElementById('back-top-btn');
  if (btn) {
    btn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
}

/* ==========================================
   05. SITE PRELOADER (0% - 100% Coffee Brewing Load)
   ========================================== */
function initSitePreloader() {
  const preloader = document.getElementById('site-preloader');
  const numElem = document.getElementById('preloader-num');
  const fillElem = document.getElementById('preloader-fill');
  const statusElem = document.getElementById('preloader-status');

  if (!preloader || !numElem || !fillElem) return;

  const messages = [
    { threshold: 0, text: "Slow-dripping single origin decoction..." },
    { threshold: 35, text: "Scalding farm-fresh whole milk..." },
    { threshold: 70, text: "Frothing the metre high pour..." },
    { threshold: 95, text: "Ready to savor." }
  ];

  let currentProgress = 0;
  const duration = 1800; // ms
  const startTime = performance.now();

  function updateLoading(now) {
    const elapsed = now - startTime;
    const rawProgress = Math.min(100, (elapsed / duration) * 100);
    currentProgress = Math.floor(rawProgress);

    numElem.textContent = currentProgress;
    fillElem.style.width = `${currentProgress}%`;

    // Update status message
    if (statusElem) {
      for (let i = messages.length - 1; i >= 0; i--) {
        if (currentProgress >= messages[i].threshold) {
          if (statusElem.textContent !== messages[i].text) {
            statusElem.textContent = messages[i].text;
          }
          break;
        }
      }
    }

    if (currentProgress < 100) {
      requestAnimationFrame(updateLoading);
    } else {
      setTimeout(() => {
        if (window.gsap) {
          gsap.to(preloader, {
            yPercent: -100,
            duration: 0.85,
            ease: 'power3.inOut',
            onComplete: () => {
              preloader.style.display = 'none';
            }
          });
        } else {
          preloader.style.opacity = '0';
          setTimeout(() => { preloader.style.display = 'none'; }, 600);
        }
      }, 250);
    }
  }

  requestAnimationFrame(updateLoading);
}

/* ==========================================
   06. CUTE CUSTOM CURSOR POINTER
   ========================================== */
function initCuteCursor() {
  const dot = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');

  if (!dot || !ring) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;
  let isMoving = false;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    dot.style.left = `${mouseX}px`;
    dot.style.top = `${mouseY}px`;

    if (!isMoving) {
      isMoving = true;
      requestAnimationFrame(animateRing);
    }
  }, { passive: true });

  function animateRing() {
    ringX += (mouseX - ringX) * 0.16;
    ringY += (mouseY - ringY) * 0.16;

    ring.style.left = `${ringX}px`;
    ring.style.top = `${ringY}px`;

    if (Math.abs(mouseX - ringX) > 0.1 || Math.abs(mouseY - ringY) > 0.1) {
      requestAnimationFrame(animateRing);
    } else {
      isMoving = false;
    }
  }

  // Hover detection for interactive targets
  const interactiveSelector = 'a, button, .order-card, .shop-now-pill, .track-tick, .craft-pillar-item, .craft-cta-btn';
  
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(interactiveSelector)) {
      document.body.classList.add('cursor-hover');
    }
  });

  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(interactiveSelector)) {
      document.body.classList.remove('cursor-hover');
    }
  });

  // Click squash
  window.addEventListener('mousedown', () => {
    document.body.classList.add('cursor-active');
  });

  window.addEventListener('mouseup', () => {
    document.body.classList.remove('cursor-active');
  });

  // Window leave
  document.addEventListener('mouseleave', () => {
    dot.style.opacity = '0';
    ring.style.opacity = '0';
  });

  document.addEventListener('mouseenter', () => {
    dot.style.opacity = '1';
    ring.style.opacity = '1';
  });
}
