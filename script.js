/* ═══════════════════════════════════════════════════
   script.js — Elite Eid Mubarak · All Interactions
═══════════════════════════════════════════════════ */
'use strict';

/* ─────────────────────────────────────────
   1. LOADER
───────────────────────────────────────── */
(function initLoader() {
  const bar    = document.getElementById('lpBar');
  const loader = document.getElementById('loader');
  if (!loader) return;

  let p = 0;
  const tick = setInterval(() => {
    p += Math.random() * 14;
    if (p >= 100) { p = 100; clearInterval(tick); }
    bar.style.width = p + '%';
  }, 90);

  window.addEventListener('load', () => {
    p = 100;
    bar.style.width = '100%';
    setTimeout(() => loader.classList.add('hide'), 460);
  });
})();

/* ─────────────────────────────────────────
   2. CUSTOM CURSOR (desktop only)
───────────────────────────────────────── */
(function initCursor() {
  if (!window.matchMedia('(hover:hover)').matches) return;

  const core = document.getElementById('cursorCore');
  const halo = document.getElementById('cursorHalo');
  if (!core || !halo) return;

  let mx = innerWidth / 2, my = innerHeight / 2;
  let hx = mx, hy = my;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    core.style.left = mx + 'px';
    core.style.top  = my + 'px';
  });

  (function lerp() {
    hx += (mx - hx) * 0.1;
    hy += (my - hy) * 0.1;
    halo.style.left = hx + 'px';
    halo.style.top  = hy + 'px';
    requestAnimationFrame(lerp);
  })();

  // Hover expand
  document.querySelectorAll(
    '.glass-dark, .glass-ultra, .glass-parchment, .moon-wrap, .portrait-frame, .photo-ph'
  ).forEach(el => {
    el.addEventListener('mouseenter', () => halo.classList.add('expand'));
    el.addEventListener('mouseleave', () => halo.classList.remove('expand'));
  });

  document.addEventListener('mousedown', () => halo.classList.add('press'));
  document.addEventListener('mouseup',   () => halo.classList.remove('press'));
})();

/* ─────────────────────────────────────────
   3. CANVAS — STARFIELD + AURORA
───────────────────────────────────────── */
(function initCanvas() {
  const cv = document.getElementById('bgCanvas');
  if (!cv) return;
  const cx = cv.getContext('2d');

  let W, H, stars = [], nebulae = [];

  function resize() {
    W = cv.width  = innerWidth;
    H = cv.height = innerHeight;
    buildStars();
    buildNebulae();
  }

  function buildStars() {
    stars = [];
    const n = Math.min(320, Math.floor(W * H / 4500));
    for (let i = 0; i < n; i++) {
      stars.push({
        x    : Math.random() * W,
        y    : Math.random() * H,
        r    : Math.random() * 1.6 + 0.2,
        phase: Math.random() * Math.PI * 2,
        spd  : Math.random() * 0.008 + 0.002,
        hue  : 36 + Math.random() * 24,
      });
    }
  }

  function buildNebulae() {
    nebulae = [];
    const configs = [
      { hue:220, sat:55, x:.5,  y:.25, rx:.55, ry:.28 },
      { hue:280, sat:40, x:.8,  y:.65, rx:.35, ry:.22 },
      { hue:180, sat:35, x:.15, y:.7,  rx:.30, ry:.20 },
      { hue:40,  sat:30, x:.5,  y:.45, rx:.45, ry:.35 },
    ];
    configs.forEach(c => {
      nebulae.push({
        ...c,
        phase: Math.random() * Math.PI * 2,
        spd  : 0.0015 + Math.random() * 0.002,
      });
    });
  }

  resize();
  window.addEventListener('resize', resize);

  let t = 0;
  (function draw() {
    cx.clearRect(0, 0, W, H);

    // Sky gradient
    const sky = cx.createLinearGradient(0, 0, 0, H);
    sky.addColorStop(0, 'rgba(2,4,10,1)');
    sky.addColorStop(.5, 'rgba(5,3,14,1)');
    sky.addColorStop(1,  'rgba(8,4,16,1)');
    cx.fillStyle = sky;
    cx.fillRect(0, 0, W, H);

    // Nebulae
    nebulae.forEach(n => {
      const dx = Math.sin(t * n.spd + n.phase) * 28;
      const g  = cx.createRadialGradient(
        n.x * W + dx, n.y * H, 0,
        n.x * W + dx, n.y * H, n.rx * W
      );
      g.addColorStop(0,   `hsla(${n.hue},${n.sat}%,25%,0.065)`);
      g.addColorStop(.45, `hsla(${n.hue+20},${n.sat*.7}%,18%,0.04)`);
      g.addColorStop(1,   'transparent');
      cx.fillStyle = g;
      cx.beginPath();
      cx.ellipse(n.x*W+dx, n.y*H, n.rx*W, n.ry*H, 0, 0, Math.PI*2);
      cx.fill();
    });

    // Warm core glow
    const core = cx.createRadialGradient(W*.5, H*.32, 0, W*.5, H*.32, H*.55);
    core.addColorStop(0, 'rgba(42,28,6,0.13)');
    core.addColorStop(1, 'transparent');
    cx.fillStyle = core;
    cx.fillRect(0, 0, W, H);

    // Stars
    stars.forEach(s => {
      const a = .14 + .68 * Math.abs(Math.sin(s.phase + t * s.spd));
      cx.beginPath();
      cx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      cx.fillStyle = `hsla(${s.hue},70%,87%,${a})`;
      cx.fill();

      // Occasional star cross-sparkle
      if (s.r > 1.2) {
        cx.globalAlpha = a * .28;
        cx.fillStyle = `hsla(${s.hue},60%,95%,1)`;
        cx.fillRect(s.x - s.r * 3, s.y - .5, s.r * 6, 1);
        cx.fillRect(s.x - .5, s.y - s.r * 3, 1, s.r * 6);
        cx.globalAlpha = 1;
      }
    });

    t++;
    requestAnimationFrame(draw);
  })();
})();

/* ─────────────────────────────────────────
   4. FLOATING PARTICLES
───────────────────────────────────────── */
(function initParticles() {
  const set = ['🌸','✨','💫','🌹','⭐','🌺','◆','✦','🌼'];
  for (let i = 0; i < 24; i++) {
    const el = document.createElement('div');
    el.className = 'particle';
    el.textContent = set[i % set.length];
    const drift = (Math.random() - .5) * 170;
    el.style.cssText =
      `left:${Math.random()*100}%;top:-30px;` +
      `font-size:${10+Math.random()*8}px;` +
      `--pd:${drift}px;--ps:${Math.random()*720}deg;` +
      `animation-duration:${11+Math.random()*13}s;` +
      `animation-delay:${Math.random()*16}s;opacity:0;`;
    document.body.appendChild(el);
  }
})();

/* ─────────────────────────────────────────
   5. MOON BURST
───────────────────────────────────────── */
(function initMoon() {
  const moon = document.getElementById('moonWrap');
  if (!moon) return;

  const glyphs = ['💕','💖','🌙','✨','💫','🌹','💗','❤️','🌸','⭐','🌺','◆','💛'];

  function burst(x, y) {
    const count = 22;
    for (let i = 0; i < count; i++) {
      const b     = document.createElement('div');
      b.className = 'hburst';
      b.textContent = glyphs[Math.floor(Math.random() * glyphs.length)];
      const angle = (Math.PI * 2 / count) * i;
      const dist  = 72 + Math.random() * 110;
      b.style.cssText =
        `left:${x}px;top:${y}px;` +
        `--hx:${Math.cos(angle)*dist}px;--hy:${Math.sin(angle)*dist}px;` +
        `animation-delay:${Math.random()*.12}s;font-size:${12+Math.random()*10}px;`;
      document.body.appendChild(b);
      setTimeout(() => b.remove(), 1800);
    }
  }

  moon.addEventListener('click', e => burst(e.clientX, e.clientY));
  moon.addEventListener('touchend', e => {
    const t = e.changedTouches[0];
    burst(t.clientX, t.clientY);
  }, { passive: true });
})();

/* ─────────────────────────────────────────
   6. PHOTO UPLOAD
───────────────────────────────────────── */
(function initPhoto() {
  const input = document.getElementById('photoInput');
  if (!input) return;
  input.addEventListener('change', function () {
    if (!this.files[0]) return;
    const url = URL.createObjectURL(this.files[0]);
    const img = document.createElement('img');
    img.className = 'photo-img';
    img.src = url;
    const ph = document.getElementById('photoPH');
    if (ph) ph.parentNode.replaceChild(img, ph);
  });
})();

/* ─────────────────────────────────────────
   7. SCROLL REVEAL
───────────────────────────────────────── */
(function initScrollReveal() {
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      en.target.classList.add('visible');
      io.unobserve(en.target);
    });
  }, { threshold: .14 });

  // General reveal elements
  document.querySelectorAll('[data-reveal]').forEach(el => io.observe(el));

  // Quote cards — stagger
  document.querySelectorAll('[data-qcard]').forEach((el, i) => {
    el.style.transitionDelay = (i * 0.12) + 's';
    io.observe(el);
  });

  // Dua cards — stagger
  document.querySelectorAll('[data-dcard]').forEach((el, i) => {
    el.style.transitionDelay = (i * 0.1) + 's';
    io.observe(el);
  });

  // Letter paragraphs
  document.querySelectorAll('.letter-p').forEach((el, i) => {
    el.style.transitionDelay = (i * 0.19) + 's';
    io.observe(el);
  });

  // Letter from block
  const lf = document.querySelector('[data-lf]');
  if (lf) io.observe(lf);

  // Poem lines
  document.querySelectorAll('[data-pline]').forEach((el, i) => {
    el.style.transitionDelay = (i * 0.16) + 's';
    io.observe(el);
  });

  // Section headers
  document.querySelectorAll('.sec-header').forEach(el => io.observe(el));
})();

/* ─────────────────────────────────────────
   8. SUBTLE PARALLAX ON HERO BG TEXT
───────────────────────────────────────── */
(function initParallax() {
  const bg = document.querySelector('.hero-bg-text');
  if (!bg) return;
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const sy = window.scrollY;
      bg.style.transform = `translate(-50%, calc(-50% + ${sy * 0.18}px))`;
      ticking = false;
    });
  }, { passive: true });
})();

/* ─────────────────────────────────────────
   9. SECTION AMBIENT GLOW ON SCROLL
───────────────────────────────────────── */
(function initSectionGlow() {
  const sections = document.querySelectorAll('.section');
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        en.target.style.setProperty('--section-fade-in', '1');
      }
    });
  }, { threshold: .05 });
  sections.forEach(s => io.observe(s));
})();

/* ─────────────────────────────────────────
   10. SMOOTH TOUCH SCROLL ENHANCEMENT
───────────────────────────────────────── */
(function touchSmooth() {
  document.documentElement.style.scrollBehavior = 'smooth';
  // Improve momentum on iOS
  document.body.style.webkitOverflowScrolling = 'touch';
})();