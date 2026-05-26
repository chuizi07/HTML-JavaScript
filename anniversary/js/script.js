// ── 配置：修改这里的时间 ──
const WEDDING_DATE = new Date('2023-06-18T00:00:00');     // 结婚日期
const NEXT_ANNIVERSARY = new Date('2026-06-18T00:00:00');   // 下一个纪念日

// ── 数字动画 ──
function animateNumber(el, target) {
  const current = parseInt(el.textContent) || 0;
  if (current === target) return;
  const diff = target - current;
  const step = Math.ceil(Math.abs(diff) / 20);
  el.textContent = current + (diff > 0 ? step : -step);
  if (Math.abs(diff) > step) {
    requestAnimationFrame(() => setTimeout(() => animateNumber(el, target), 30));
  } else {
    el.textContent = target;
  }
}

// ── 计时器：在一起的天数 ──
function updateTimer() {
  const now = new Date();
  const diff = now - WEDDING_DATE;
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);

  animateNumber(document.getElementById('days'), days);
  animateNumber(document.getElementById('hours'), hours);
  animateNumber(document.getElementById('minutes'), minutes);
  animateNumber(document.getElementById('seconds'), seconds);
}

// ── 倒计时：下一个纪念日 ──
function updateCountdown() {
  const now = new Date();
  const diff = NEXT_ANNIVERSARY - now;
  if (diff <= 0) return;
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);

  animateNumber(document.getElementById('cd-days'), days);
  animateNumber(document.getElementById('cd-hours'), hours);
  animateNumber(document.getElementById('cd-minutes'), minutes);
  animateNumber(document.getElementById('cd-seconds'), seconds);
}

setInterval(updateTimer, 1000);
setInterval(updateCountdown, 1000);
updateTimer();
updateCountdown();

// ── 时间线滚动动画 ──
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.2 });

document.querySelectorAll('.timeline-item').forEach(el => observer.observe(el));

// ── 爱心粒子背景 ──
(function() {
  const canvas = document.getElementById('hearts');
  const ctx = canvas.getContext('2d');
  let W, H;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const hearts = [];

  function drawHeart(x, y, size, alpha, color) {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = color;
    ctx.beginPath();
    const topCurveHeight = size * 0.3;
    ctx.moveTo(x, y + topCurveHeight);
    ctx.bezierCurveTo(x, y, x - size / 2, y, x - size / 2, y + topCurveHeight);
    ctx.bezierCurveTo(x - size / 2, y + (size + topCurveHeight) / 2, x, y + (size + topCurveHeight) / 2, x, y + size);
    ctx.bezierCurveTo(x, y + (size + topCurveHeight) / 2, x + size / 2, y + (size + topCurveHeight) / 2, x + size / 2, y + topCurveHeight);
    ctx.bezierCurveTo(x + size / 2, y, x, y, x, y + topCurveHeight);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  function spawnHeart() {
    const colors = ['#ff6b9d', '#ffd700', '#ff69b4', '#ffb347', '#ff4d6d'];
    hearts.push({
      x: Math.random() * W,
      y: H + 20,
      size: Math.random() * 15 + 5,
      speed: Math.random() * 1 + 0.3,
      alpha: Math.random() * 0.5 + 0.1,
      color: colors[Math.floor(Math.random() * colors.length)],
      sway: Math.random() * 0.02 - 0.01,
      swayOffset: Math.random() * Math.PI * 2
    });
  }

  let spawnTimer = 0;

  function loop() {
    requestAnimationFrame(loop);
    ctx.clearRect(0, 0, W, H);

    spawnTimer++;
    if (spawnTimer % 8 === 0) spawnHeart();

    for (let i = hearts.length - 1; i >= 0; i--) {
      const h = hearts[i];
      h.y -= h.speed;
      h.x += Math.sin(h.swayOffset + h.y * 0.01) * 0.5;
      drawHeart(h.x, h.y, h.size, h.alpha, h.color);
      if (h.y < -30) hearts.splice(i, 1);
    }
  }
  loop();
})();

// ── 密码验证 ──
(function() {
  var PASSWORD = '1122';
  var input = '';
  var dots = document.querySelectorAll('#dots .dot');
  var keys = document.querySelectorAll('.key');
  var screen = document.getElementById('passwordScreen');

  function updateDots() {
    for (var i = 0; i < dots.length; i++) {
      dots[i].className = 'dot';
      if (i < input.length) dots[i].classList.add('filled');
    }
  }

  function shakeDots() {
    for (var i = 0; i < dots.length; i++) {
      dots[i].className = 'dot';
      if (i < input.length) dots[i].classList.add('error');
    }
  }

  function unlock() {
    screen.classList.add('hidden');
  }

  keys.forEach(function(key) {
    key.addEventListener('click', function() {
      var val = this.getAttribute('data-key');

      if (val === 'clear') {
        input = '';
        updateDots();
        return;
      }

      if (val === 'delete') {
        input = input.slice(0, -1);
        updateDots();
        return;
      }

      if (input.length >= 4) return;

      input += val;
      updateDots();

      if (input.length === 4) {
        if (input === PASSWORD) {
          setTimeout(unlock, 300);
        } else {
          shakeDots();
          var wrong = input;
          setTimeout(function() {
            input = '';
            updateDots();
          }, 800);
        }
      }
    });
  });
})();

// ── 音乐控制 ──
(function() {
  const btn = document.getElementById('musicBtn');
  const audio = document.getElementById('bgMusic');
  if (!audio || !btn) return;

  btn.addEventListener('click', function() {
    if (audio.paused) {
      audio.play().catch(function() {});
      btn.classList.add('playing');
    } else {
      audio.pause();
      btn.classList.remove('playing');
    }
  });

  audio.addEventListener('ended', function() {
    btn.classList.remove('playing');
  });
})();
