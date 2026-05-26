// 获取canvas元素和上下文
var canvas = document.getElementById('canvas'),
    ctx = canvas.getContext('2d'),
    // 全屏尺寸
    cw = window.innerWidth,
    ch = window.innerHeight,
    // 烟花和粒子集合
    fireworks = [],
    particles = [],
    // 基础色相
    hue = 120,
    // 点击发射限制器
    limiterTotal = 5,
    limiterTick = 0,
    // 自动发射定时器
    timerTotal = 80,
    timerTick = 0,
    mousedown = false,
    mx,
    my;

// 设置canvas尺寸
canvas.width = cw;
canvas.height = ch;

// 兼容写法的requestAnimationFrame
window.requestAnimFrame = (function() {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        function(callback) {
            window.setTimeout(callback, 1000 / 60);
        };
})();

// 范围内随机数
function random(min, max) {
    return Math.random() * (max - min) + min;
}

// 计算两点距离
function calculateDistance(p1x, p1y, p2x, p2y) {
    var xDistance = p1x - p2x,
        yDistance = p1y - p2y;
    return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
}

// 烟花类（上升阶段）
function Firework(sx, sy, tx, ty) {
    this.x = sx;
    this.y = sy;
    this.sx = sx;
    this.sy = sy;
    this.tx = tx;
    this.ty = ty;
    this.distanceToTarget = calculateDistance(sx, sy, tx, ty);
    this.distanceTraveled = 0;
    // 轨迹坐标集合
    this.coordinates = [];
    this.coordinateCount = 3;
    while (this.coordinateCount--) {
        this.coordinates.push([this.x, this.y]);
    }
    this.angle = Math.atan2(ty - sy, tx - sx);
    this.speed = 2;
    this.acceleration = 1.05;
    this.brightness = random(50, 70);
    this.targetRadius = 1;
}

// 更新烟花位置
Firework.prototype.update = function(index) {
    this.coordinates.pop();
    this.coordinates.unshift([this.x, this.y]);

    // 目标指示器脉冲效果
    if (this.targetRadius < 8) {
        this.targetRadius += 0.3;
    } else {
        this.targetRadius = 1;
    }

    // 加速
    this.speed *= this.acceleration;

    var vx = Math.cos(this.angle) * this.speed,
        vy = Math.sin(this.angle) * this.speed;
    this.distanceTraveled = calculateDistance(this.sx, this.sy, this.x + vx, this.y + vy);

    // 到达目标点则爆炸
    if (this.distanceTraveled >= this.distanceToTarget) {
        createParticles(this.tx, this.ty);
        fireworks.splice(index, 1);
    } else {
        this.x += vx;
        this.y += vy;
    }
};

// 绘制烟花轨迹
Firework.prototype.draw = function() {
    ctx.beginPath();
    ctx.moveTo(this.coordinates[this.coordinates.length - 1][0], this.coordinates[this.coordinates.length - 1][1]);
    ctx.lineTo(this.x, this.y);
    ctx.strokeStyle = 'hsl(' + hue + ', 100%, ' + this.brightness + '%)';
    ctx.stroke();

    // 目标点脉冲圆圈
    ctx.beginPath();
    ctx.arc(this.tx, this.ty, this.targetRadius, 0, Math.PI * 2);
    ctx.stroke();
};

// 粒子类（爆炸阶段）
function Particle(x, y) {
    this.x = x;
    this.y = y;
    this.coordinates = [];
    this.coordinateCount = 5;
    while (this.coordinateCount--) {
        this.coordinates.push([this.x, this.y]);
    }
    this.angle = random(0, Math.PI * 2);
    this.speed = random(1, 10);
    this.friction = 0.95;
    this.gravity = 1;
    this.hue = random(hue - 20, hue + 20);
    this.brightness = random(50, 80);
    this.alpha = 1;
    this.decay = random(0.015, 0.03);
}

// 更新粒子状态
Particle.prototype.update = function(index) {
    this.coordinates.pop();
    this.coordinates.unshift([this.x, this.y]);
    this.speed *= this.friction;
    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed + this.gravity;
    this.alpha -= this.decay;

    if (this.alpha <= this.decay) {
        particles.splice(index, 1);
    }
};

// 绘制粒子
Particle.prototype.draw = function() {
    ctx.beginPath();
    ctx.moveTo(this.coordinates[this.coordinates.length - 1][0], this.coordinates[this.coordinates.length - 1][1]);
    ctx.lineTo(this.x, this.y);
    ctx.strokeStyle = 'hsla(' + this.hue + ', 100%, ' + this.brightness + '%, ' + this.alpha + ')';
    ctx.stroke();
};

// 创建爆炸粒子群
function createParticles(x, y) {
    var particleCount = 30;
    while (particleCount--) {
        particles.push(new Particle(x, y));
    }
}

// 主循环
function loop() {
    requestAnimFrame(loop);

    // 色相渐变，让烟花颜色不断变化
    hue += 0.5;

    // 使用destination-out实现拖尾效果
    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, cw, ch);
    // 切换为lighter混合模式实现发光叠加
    ctx.globalCompositeOperation = 'lighter';

    // 更新和绘制烟花
    var i = fireworks.length;
    while (i--) {
        fireworks[i].draw();
        fireworks[i].update(i);
    }

    // 更新和绘制粒子
    var i = particles.length;
    while (i--) {
        particles[i].draw();
        particles[i].update(i);
    }

    // 自动发射烟花
    if (timerTick >= timerTotal) {
        if (!mousedown) {
            fireworks.push(new Firework(cw / 2, ch, random(0, cw), random(0, ch / 2)));
            timerTick = 0;
        }
    } else {
        timerTick++;
    }

    // 鼠标按住时连续发射
    if (limiterTick >= limiterTotal) {
        if (mousedown) {
            fireworks.push(new Firework(cw / 2, ch, mx, my));
            limiterTick = 0;
        }
    } else {
        limiterTick++;
    }
}

// 鼠标事件
canvas.addEventListener('mousemove', function(e) {
    mx = e.pageX - canvas.offsetLeft;
    my = e.pageY - canvas.offsetTop;
});

canvas.addEventListener('mousedown', function(e) {
    e.preventDefault();
    mousedown = true;
});

canvas.addEventListener('mouseup', function(e) {
    e.preventDefault();
    mousedown = false;
});

// 窗口大小变化时重新设置
window.addEventListener('resize', function() {
    cw = canvas.width = window.innerWidth;
    ch = canvas.height = window.innerHeight;
});

// 页面加载后开始动画
window.onload = loop;
