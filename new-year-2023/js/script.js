const stars = () => {
  const count = 200;
  const section = document.querySelector('.section');
  for (let i = 0; i < count; i++) {
    const star = document.createElement('i');
    const x = Math.floor(Math.random() * window.innerWidth);
    const y = Math.floor(Math.random() * window.innerHeight);
    const size = Math.random() * 4;
    star.style.left = x + 'px';
    star.style.top = y + 'px';
    star.style.width = 1 + size + 'px';
    star.style.height = 1 + size + 'px';
    const duration = Math.random() * 2;
    star.style.animationDuration = 2 + duration + 's';
    star.style.animationDelay = duration + 's';
    section.appendChild(star);
  }
};
stars();

// 新增：烟花粒子效果
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

function launch() {
  fireworks.push(new Trail(random(W * 0.15, W * 0.85), random(H * 0.1, H * 0.4), random(0, 360)));
}

let autoTimer = 0;

function loop() {
  requestAnimationFrame(loop);
  ctx.globalCompositeOperation = 'source-over';
  ctx.fillStyle = 'rgba(0,0,0,0.12)';
  ctx.fillRect(0, 0, W, H);
  ctx.globalCompositeOperation = 'lighter';

  autoTimer++;
  if (autoTimer >= random(30, 60)) { autoTimer = 0; launch(); }

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
}
loop();
