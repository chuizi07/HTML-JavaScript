// 生日主题星星 - 金色和粉色
const stars = () => {
  const count = 200;
  const section = document.querySelector('.section');
  const colors = ['#ffd700', '#ff6b9d', '#fff', '#ffb347', '#ff69b4'];
  for (let i = 0; i < count; i++) {
    const star = document.createElement('i');
    const x = Math.floor(Math.random() * window.innerWidth);
    const y = Math.floor(Math.random() * window.innerHeight);
    const size = Math.random() * 4;
    star.style.left = x + 'px';
    star.style.top = y + 'px';
    star.style.width = 1 + size + 'px';
    star.style.height = 1 + size + 'px';
    star.style.background = colors[Math.floor(Math.random() * colors.length)];
    const duration = Math.random() * 2;
    star.style.animationDuration = 2 + duration + 's';
    star.style.animationDelay = duration + 's';
    section.appendChild(star);
  }
};
stars();

// Canvas 烟花 + 彩纸效果
const canvas = document.createElement('canvas');
canvas.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:5;';
document.querySelector('.section').appendChild(canvas);

const ctx = canvas.getContext('2d');
let W, H;
function resize() {
  canvas.width = W = canvas.clientWidth;
  canvas.height = H = canvas.clientHeight;
}
resize();
window.addEventListener('resize', resize);

function random(min, max) { return Math.random() * (max - min) + min; }

const fireworks = [];
const particles = [];
const confetti = [];

class Trail {
  constructor(x, targetY, hue) {
    this.x = x; this.y = H; this.targetY = targetY; this.speed = random(8, 14);
    this.hue = hue; this.trail = []; this.alive = true;
  }
  update() {
    this.trail.push({ x: this.x, y: this.y });
    if (this.trail.length > 15) this.trail.shift();
    this.y -= this.speed;
    if (this.y <= this.targetY) { this.explode(); this.alive = false; }
  }
  draw() {
    for (let i = 0; i < this.trail.length; i++) {
      ctx.beginPath();
      ctx.arc(this.trail[i].x, this.trail[i].y, 2, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${this.hue},100%,70%,${i / this.trail.length * 0.6})`;
      ctx.fill();
    }
    ctx.beginPath(); ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(${this.hue},80%,95%,1)`; ctx.fill();
  }
  explode() {
    const count = Math.floor(random(80, 150));
    for (let i = 0; i < count; i++) {
      const angle = random(0, Math.PI * 2);
      const speed = random(1, 8);
      const life = random(60, 120);
      particles.push({
        x: this.x, y: this.y,
        vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
        hue: this.hue + random(-30, 30), life, maxLife: life,
        trail: [], trailLength: Math.floor(random(4, 8)), size: random(1.5, 3),
        alive: true
      });
    }
  }
}

// 彩纸粒子
function spawnConfetti(x, y) {
  for (let i = 0; i < 30; i++) {
    const angle = random(0, Math.PI * 2);
    const speed = random(2, 6);
    confetti.push({
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 2,
      rotation: random(0, 360),
      rotSpeed: random(-10, 10),
      width: random(4, 8),
      height: random(2, 4),
      hue: random(0, 360),
      life: random(80, 150),
      maxLife: 150
    });
  }
}

function launch() {
  const x = random(W * 0.15, W * 0.85);
  const targetY = random(H * 0.1, H * 0.4);
  const hue = random(0, 360);
  fireworks.push(new Trail(x, targetY, hue));
}

let autoTimer = 0;
let confettiTimer = 0;

function loop() {
  requestAnimationFrame(loop);
  ctx.globalCompositeOperation = 'source-over';
  ctx.fillStyle = 'rgba(0,0,0,0.12)';
  ctx.fillRect(0, 0, W, H);
  ctx.globalCompositeOperation = 'lighter';

  autoTimer++;
  if (autoTimer >= random(30, 60)) {
    autoTimer = 0;
    launch();
  }

  // 随机洒落彩纸
  confettiTimer++;
  if (confettiTimer >= 20) {
    confettiTimer = 0;
    spawnConfetti(random(W * 0.2, W * 0.8), random(H * 0.05, H * 0.3));
  }

  for (let i = fireworks.length - 1; i >= 0; i--) {
    fireworks[i].update(); fireworks[i].draw();
    if (!fireworks[i].alive) fireworks.splice(i, 1);
  }
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.trail.push({ x: p.x, y: p.y });
    if (p.trail.length > p.trailLength) p.trail.shift();
    p.vx *= 0.98; p.vy *= 0.98; p.vy += 0.06;
    p.x += p.vx; p.y += p.vy; p.life--;
    if (p.life <= 0) { p.alive = false; }
    if (p.alive) {
      const progress = p.life / p.maxLife;
      for (let j = 0; j < p.trail.length; j++) {
        const t = j / p.trail.length;
        ctx.beginPath();
        ctx.arc(p.trail[j].x, p.trail[j].y, p.size * t * 0.6, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue},100%,60%,${t * progress * 0.4})`;
        ctx.fill();
      }
      ctx.beginPath(); ctx.arc(p.x, p.y, p.size * progress, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${p.hue},100%,60%,${progress})`; ctx.fill();
    } else {
      particles.splice(i, 1);
    }
  }

  // 绘制彩纸
  ctx.globalCompositeOperation = 'source-over';
  for (let i = confetti.length - 1; i >= 0; i--) {
    const c = confetti[i];
    c.vx *= 0.99;
    c.vy += 0.05;
    c.x += c.vx;
    c.y += c.vy;
    c.rotation += c.rotSpeed;
    c.life--;
    if (c.life <= 0 || c.y > H + 20) {
      confetti.splice(i, 1);
      continue;
    }
    const alpha = Math.min(1, c.life / (c.maxLife * 0.3));
    ctx.save();
    ctx.translate(c.x, c.y);
    ctx.rotate(c.rotation * Math.PI / 180);
    ctx.globalAlpha = alpha;
    ctx.fillStyle = `hsl(${c.hue}, 80%, 65%)`;
    ctx.fillRect(-c.width / 2, -c.height / 2, c.width, c.height);
    ctx.restore();
  }
}
loop();
