/* ============================================================
   Edward van Niekerk Portfolio — script.js
   INL261 · Group 15
   ============================================================ */

 

/* ====== STARFIELD ====== */
const canvas = document.getElementById('starfield');
const ctx = canvas.getContext('2d');
let W, H, stars = [];

 

function resize() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

 

function mkStar() {
  return {
    x: Math.random() * W,
    y: -10,
    len: 10 + Math.random() * 25,
    speed: 1.5 + Math.random() * 3,
    size: 0.5 + Math.random() * 1.5,
    opacity: 0.3 + Math.random() * 0.7,
    glow: Math.random() > 0.7
  };
}

 

/* Seed initial stars spread across the full canvas height */
for (let i = 0; i < 60; i++) {
  const s = mkStar();
  s.y = Math.random() * H;
  stars.push(s);
}

 

function drawStars() {
  ctx.clearRect(0, 0, W, H);

 

  /* Dark green background gradient */
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, '#060d07');
  bg.addColorStop(1, '#0a120a');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

 

  stars.forEach((s, i) => {
    s.y += s.speed;

 

    /* Trailing line */
    const grad = ctx.createLinearGradient(s.x, s.y - s.len, s.x, s.y);
    grad.addColorStop(0, 'transparent');
    grad.addColorStop(1, `rgba(61,214,140,${s.opacity})`);
    ctx.beginPath();
    ctx.moveTo(s.x, s.y - s.len);
    ctx.lineTo(s.x, s.y);
    ctx.strokeStyle = grad;
    ctx.lineWidth = s.size;
    ctx.stroke();

 

    /* Head dot */
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.size + 0.5, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(61,214,140,${s.opacity})`;
    ctx.fill();

 

    /* Radial glow for larger stars */
    if (s.glow) {
      const glow = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, 8);
      glow.addColorStop(0, `rgba(61,214,140,${s.opacity * 0.5})`);
      glow.addColorStop(1, 'transparent');
      ctx.beginPath();
      ctx.arc(s.x, s.y, 8, 0, Math.PI * 2);
      ctx.fillStyle = glow;
      ctx.fill();
    }

 

    /* Recycle star when it falls off screen */
    if (s.y > H + 20) {
      stars[i] = mkStar();
    }
  });

 

  requestAnimationFrame(drawStars);
}
drawStars();

 

/* ====== SCROLL REVEAL ====== */
const revEls = document.querySelectorAll('.reveal');
const obs = new IntersectionObserver((entries) => {
  entries.forEach((e, idx) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('visible'), idx * 60);
    }
  });
}, { threshold: 0.12 });
revEls.forEach(el => obs.observe(el));

 

/* ====== QUOTE CAROUSEL ====== */
let current = 0;
const slides = document.querySelectorAll('.quote-slide');
const dots = document.querySelectorAll('.dot');

 

function goSlide(n) {
  slides[current].classList.remove('active');
  dots[current].classList.remove('active');
  current = n;
  slides[current].classList.add('active');
  dots[current].classList.add('active');
}

 

/* Auto-advance every 5 seconds */
setInterval(() => {
  goSlide((current + 1) % slides.length);
}, 5000);

 

/* ====== CONTACT FORM ====== */
function submitForm() {
  const name  = document.getElementById('fname').value.trim();
  const email = document.getElementById('femail').value.trim();
  const msg   = document.getElementById('fmsg').value.trim();

 

  if (!name || !email || !msg) {
    alert('Please fill in all fields.');
    return;
  }

 

  const form = document.getElementById('contactForm');
  form.style.opacity = '0.4';
  form.style.pointerEvents = 'none';
  document.getElementById('formMsg').style.display = 'block';
}

 

/* ====== ACTIVE NAV LINK ON SCROLL ====== */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

 

window.addEventListener('scroll', () => {
  const pos = window.scrollY + 120;
  sections.forEach(s => {
    if (pos >= s.offsetTop && pos < s.offsetTop + s.offsetHeight) {
      navLinks.forEach(a => (a.style.color = ''));
      const active = document.querySelector(`.nav-links a[href="#${s.id}"]`);
      if (active) active.style.color = '#3dd68c';
    }
  });
});
