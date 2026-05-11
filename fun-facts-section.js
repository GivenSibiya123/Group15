document.addEventListener('DOMContentLoaded', () => {

/* ── 1. CUSTOM CURSOR ── */
const cursor = document.getElementById('cursor');
const ring   = document.getElementById('cursorRing');

document.addEventListener('mousemove', e => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top  = e.clientY + 'px';
  ring.style.left   = e.clientX + 'px';
  ring.style.top    = e.clientY + 'px';
});

document.querySelectorAll('.card').forEach(c => {
  c.addEventListener('mouseenter', () => {
    ring.style.width   = '60px';
    ring.style.height  = '60px';
    ring.style.opacity = '1';
  });
  c.addEventListener('mouseleave', () => {
    ring.style.width   = '36px';
    ring.style.height  = '36px';
    ring.style.opacity = '0.5';
  });
});


/* ── 2. FLOATING PARTICLES ── */
const pc  = document.getElementById('particles');
const ctx = pc.getContext('2d');

pc.width  = window.innerWidth;
pc.height = window.innerHeight;

window.addEventListener('resize', () => {
  pc.width  = window.innerWidth;
  pc.height = window.innerHeight;
});

const pts = Array.from({ length: 55 }, () => ({
  x:  Math.random() * pc.width,
  y:  Math.random() * pc.height,
  r:  Math.random() * 1.8 + 0.4,
  dx: (Math.random() - 0.5) * 0.4,
  dy: (Math.random() - 0.5) * 0.4,
  o:  Math.random() * 0.5 + 0.1
}));

function animPts() {
  ctx.clearRect(0, 0, pc.width, pc.height);
  pts.forEach(p => {
    p.x += p.dx;
    p.y += p.dy;
    if (p.x < 0 || p.x > pc.width)  p.dx *= -1;
    if (p.y < 0 || p.y > pc.height) p.dy *= -1;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(249,115,22,${p.o})`;
    ctx.fill();
  });
  requestAnimationFrame(animPts);
}

animPts();


/* ── 3. TYPING EFFECT ── */
const words = ['extraordinary', 'inspiring', 'structured', 'legendary', 'one of a kind'];
let wi = 0, ci = 0, deleting = false;
const typedEl = document.getElementById('typed-word');

function type() {
  const word = words[wi];
  typedEl.textContent = deleting ? word.slice(0, ci--) : word.slice(0, ci++);

  if (!deleting && ci > word.length) {
    deleting = true;
    setTimeout(type, 1400);
    return;
  }
  if (deleting && ci < 0) {
    deleting = false;
    wi = (wi + 1) % words.length;
    ci = 0;
  }
  setTimeout(type, deleting ? 60 : 100);
}

setTimeout(type, 800);


/* ── 4. ANIMATED COUNTERS ── */
const counters = document.querySelectorAll('.stat-number');

const countObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const target = +e.target.dataset.target;
    const dur    = 1500;
    let start    = null;

    function step(ts) {
      if (!start) start = ts;
      const p = Math.min((ts - start) / dur, 1);
      e.target.textContent = Math.floor(p * target);
      if (p < 1) requestAnimationFrame(step);
      else e.target.textContent = target;
    }

    requestAnimationFrame(step);
    countObs.unobserve(e.target);
  });
}, { threshold: 0.5 });

counters.forEach(c => countObs.observe(c));


/* ── 5. RIPPLE ON CARD CLICK ── */
document.querySelectorAll('.card').forEach(card => {
  card.addEventListener('click', function(e) {
    const r    = document.createElement('span');
    r.className = 'ripple';
    const size  = Math.max(this.offsetWidth, this.offsetHeight);
    r.style.cssText = `width:${size}px; height:${size}px; left:${e.offsetX - size / 2}px; top:${e.offsetY - size / 2}px`;
    this.appendChild(r);
    setTimeout(() => r.remove(), 620);
    this.classList.toggle('revealed');
  });

  card.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      card.classList.toggle('revealed');
    }
  });
});


/* ── 6. CONFETTI ON QUOTE HOVER ── */
const cc   = document.getElementById('confetti');
const cctx = cc.getContext('2d');

cc.width  = window.innerWidth;
cc.height = window.innerHeight;

let confettis  = [];
let confRunning = false;

function spawnConfetti() {
  for (let i = 0; i < 60; i++) {
    confettis.push({
      x:    Math.random() * cc.width,
      y:    -10,
      r:    Math.random() * 6 + 3,
      color: ['#f97316', '#2a6e4a', '#f5f5f0', '#fbbf24'][Math.floor(Math.random() * 4)],
      dx:   (Math.random() - 0.5) * 4,
      dy:   Math.random() * 3 + 2,
      rot:  Math.random() * 360,
      drot: (Math.random() - 0.5) * 6
    });
  }
}

function animConfetti() {
  if (!confRunning) return;
  cctx.clearRect(0, 0, cc.width, cc.height);
  confettis = confettis.filter(c => c.y < cc.height + 20);
  confettis.forEach(c => {
    c.x   += c.dx;
    c.y   += c.dy;
    c.rot += c.drot;
    cctx.save();
    cctx.translate(c.x, c.y);
    cctx.rotate(c.rot * Math.PI / 180);
    cctx.fillStyle = c.color;
    cctx.fillRect(-c.r / 2, -c.r / 2, c.r, c.r);
    cctx.restore();
  });
  if (confettis.length) requestAnimationFrame(animConfetti);
  else confRunning = false;
}

document.querySelector('.bottom-quote').addEventListener('mouseenter', () => {
  spawnConfetti();
  if (!confRunning) {
    confRunning = true;
    animConfetti();
  }
});


/* ── 7. SCROLL FADE-IN ── */
const obs = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 100);
      obs.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.fade-in').forEach(el => obs.observe(el));

}); // end DOMContentLoaded
