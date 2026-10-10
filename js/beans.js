/**
 * OUR STORIES — Realistic Falling & Bouncing Coffee Beans Engine
 * Section 4 ("Take The Ritual Home") Particle Physics & Canvas Renderer
 */

class CoffeeBeansCanvas {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');

    this.beans = [];
    this.isMobile = window.innerWidth <= 768;
    this.beanCount = this.isMobile ? 30 : 75; // Rich realistic bean pile

    this.mouseX = -1000;
    this.mouseY = -1000;
    this.rect = { left: 0, top: 0, width: 0, height: 0 };
    this.animFrameId = null;
    this.isVisible = false;
    this.hasTriggeredFall = false;

    this.init();
  }

  init() {
    this.resize();
    this.updateRect();

    window.addEventListener('resize', () => {
      this.resize();
      this.updateRect();
    }, { passive: true });

    window.addEventListener('scroll', () => {
      this.updateRect();
      this.checkScrollTrigger();
    }, { passive: true });

    const container = this.canvas.parentElement;
    container.addEventListener('mousemove', (e) => {
      this.mouseX = e.clientX - this.rect.left;
      this.mouseY = e.clientY - this.rect.top;
    }, { passive: true });

    this.createBeans();
    this.initObserver();
  }

  updateRect() {
    if (!this.canvas || !this.canvas.parentElement) return;
    this.rect = this.canvas.parentElement.getBoundingClientRect();
  }

  checkScrollTrigger() {
    // Trigger bean drop cascade as Section 4 enters screen
    if (!this.hasTriggeredFall && this.rect.top < window.innerHeight * 0.8) {
      this.hasTriggeredFall = true;
      this.resetBeansToTop();
    }
  }

  initObserver() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        this.isVisible = entry.isIntersecting;
        if (this.isVisible) {
          if (!this.animFrameId) this.startLoop();
        } else {
          this.stopLoop();
        }
      });
    }, { threshold: 0.05 });

    observer.observe(this.canvas.parentElement);
  }

  resize() {
    if (!this.canvas.parentElement) return;
    this.width = this.canvas.parentElement.clientWidth;
    this.height = this.canvas.parentElement.clientHeight;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.canvas.width = this.width * dpr;
    this.canvas.height = this.height * dpr;
    this.ctx.scale(dpr, dpr);
  }

  createBeans() {
    this.beans = [];
    for (let i = 0; i < this.beanCount; i++) {
      this.beans.push(this.generateSingleBean(i));
    }
  }

  generateSingleBean(index) {
    const radiusX = 11 + Math.random() * 9; // Bean length
    const radiusY = radiusX * (0.6 + Math.random() * 0.15); // Bean width
    const depth = Math.random(); // 0 = back/smaller, 1 = front/larger

    // Stagger initial Y heights so beans stream continuously from top
    const startY = -40 - Math.random() * (this.height * 1.5) - (index * 15);
    
    // Stack floor positions across the bottom to form a realistic pile
    const floorY = this.height - 25 - Math.random() * 45;

    return {
      x: Math.random() * (this.width - 60) + 30,
      y: startY,
      vx: (Math.random() - 0.5) * 1.2,
      vy: 2.5 + Math.random() * 3.5, // Falling speed
      gravity: 0.28 + Math.random() * 0.12,
      bounce: 0.45 + Math.random() * 0.2, // Realistic elastic bounce
      radiusX: radiusX,
      radiusY: radiusY,
      rotation: Math.random() * Math.PI * 2,
      vRot: (Math.random() - 0.5) * 0.08, // Rotation spin
      depth: depth,
      alpha: 0.75 + depth * 0.25,
      settled: false,
      floorY: floorY
    };
  }

  resetBeansToTop() {
    this.beans.forEach((bean, idx) => {
      bean.y = -30 - Math.random() * 600 - (idx * 12);
      bean.vy = 2.5 + Math.random() * 3.5;
      bean.settled = false;
    });
  }

  update() {
    for (let i = 0; i < this.beans.length; i++) {
      const bean = this.beans[i];

      if (!bean.settled) {
        // Apply gravity & velocity
        bean.vy += bean.gravity;
        bean.x += bean.vx;
        bean.y += bean.vy;
        bean.rotation += bean.vRot;

        // Interactive mouse avoidance reaction
        const dx = bean.x - this.mouseX;
        const dy = bean.y - this.mouseY;
        const distSq = dx * dx + dy * dy;
        if (distSq < 10000 && distSq > 0) {
          const dist = Math.sqrt(distSq);
          const force = (100 - dist) / 100;
          bean.vx += (dx / dist) * force * 1.5;
          bean.vy += (dy / dist) * force * 1.5;
        }

        // Screen side bounds reflection
        if (bean.x < 15) { bean.x = 15; bean.vx *= -0.5; }
        if (bean.x > this.width - 15) { bean.x = this.width - 15; bean.vx *= -0.5; }

        // Bottom Floor Collision & Bounce
        if (bean.y >= bean.floorY) {
          bean.y = bean.floorY;
          bean.vy = -bean.vy * bean.bounce; // Bounce upward
          bean.vx *= 0.65; // Horizontal friction damping
          bean.vRot *= 0.5; // Rotation damping

          // Come to a complete rest (settled in pile)
          if (Math.abs(bean.vy) < 0.7) {
            bean.vy = 0;
            bean.vx = 0;
            bean.vRot = 0;
            bean.settled = true;
          }
        }
      }
    }
  }

  drawBean(bean) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(bean.x, bean.y);
    ctx.rotate(bean.rotation);
    ctx.globalAlpha = bean.alpha;

    const rx = bean.radiusX;
    const ry = bean.radiusY;

    // Soft Contact Shadow on Floor when near bottom
    if (bean.y > this.height - 80) {
      const shadowDist = (this.height - bean.y) / 80;
      ctx.fillStyle = `rgba(30, 12, 6, ${0.4 * (1 - shadowDist)})`;
      ctx.beginPath();
      ctx.ellipse(0, ry + 4, rx * 1.1, ry * 0.4, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // 1. Outer Roasted Coffee Bean Body (Oval with organic curve)
    const grad = ctx.createRadialGradient(-rx * 0.25, -ry * 0.25, rx * 0.1, 0, 0, rx * 1.1);
    grad.addColorStop(0, '#5E2B15');   // Roasted warm center
    grad.addColorStop(0.5, '#3D1A0C');  // Deep mahogany
    grad.addColorStop(0.85, '#240F06'); // Dark chocolate rim
    grad.addColorStop(1, '#140703');    // Shadow edge

    ctx.fillStyle = grad;
    ctx.beginPath();
    
    // Custom Bean Silhouette
    ctx.moveTo(-rx, 0);
    ctx.bezierCurveTo(-rx, -ry * 1.15, rx, -ry * 1.15, rx, 0);
    ctx.bezierCurveTo(rx, ry * 1.15, -rx, ry * 1.15, -rx, 0);
    ctx.closePath();
    ctx.fill();

    // Subtle Outer Bevel Outline
    ctx.strokeStyle = 'rgba(255, 200, 150, 0.12)';
    ctx.lineWidth = 0.8;
    ctx.stroke();

    // 2. Central Characteristic Wavy Crease Line (S-curve fold)
    ctx.strokeStyle = '#0E0402';
    ctx.lineWidth = Math.max(1.2, rx * 0.16);
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(-rx * 0.75, 0);
    ctx.bezierCurveTo(-rx * 0.25, ry * 0.35, rx * 0.25, -ry * 0.35, rx * 0.75, 0);
    ctx.stroke();

    // 3. Inner Pale Chaff Line inside the Crease
    ctx.strokeStyle = 'rgba(215, 180, 140, 0.45)';
    ctx.lineWidth = Math.max(0.6, rx * 0.06);
    ctx.beginPath();
    ctx.moveTo(-rx * 0.65, 0);
    ctx.bezierCurveTo(-rx * 0.2, ry * 0.28, rx * 0.2, -ry * 0.28, rx * 0.65, 0);
    ctx.stroke();

    // 4. Specular Studio Light Sheen Highlight
    const sheenGrad = ctx.createLinearGradient(-rx * 0.4, -ry * 0.6, rx * 0.2, -ry * 0.1);
    sheenGrad.addColorStop(0, 'rgba(255, 235, 210, 0.25)');
    sheenGrad.addColorStop(1, 'rgba(255, 235, 210, 0.0)');
    ctx.fillStyle = sheenGrad;
    ctx.beginPath();
    ctx.ellipse(-rx * 0.25, -ry * 0.35, rx * 0.45, ry * 0.25, -Math.PI / 8, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  render() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    
    // Sort by depth (far beans rendered behind, near beans in front)
    const sorted = [...this.beans].sort((a, b) => a.depth - b.depth);
    for (let i = 0; i < sorted.length; i++) {
      this.drawBean(sorted[i]);
    }
  }

  startLoop() {
    const loop = () => {
      if (!this.isVisible) return;
      this.update();
      this.render();
      this.animFrameId = requestAnimationFrame(loop);
    };
    this.animFrameId = requestAnimationFrame(loop);
  }

  stopLoop() {
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
  }
}

window.CoffeeBeansCanvas = CoffeeBeansCanvas;
