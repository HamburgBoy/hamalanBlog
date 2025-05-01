// Meteor
const fps = 60;
const mspf = Math.floor(1000 / fps);
const colours = ["#fff1c1", "#7fbfff", "#ff66b2", "#be8cff"];

let width = window.innerWidth * devicePixelRatio;
let height = window.innerHeight * devicePixelRatio;
let canvas;
let ctx;
let particles = [];
let disabled = false;
let focused = true;
let lastTime = performance.now();

function createMeteor() {
    // 从右上方区域生成（屏幕右侧70%-100%，顶部0%-30%）
    const startX = width * (0.7 + Math.random() * 0.3);
    const startY = height * Math.random() * 0.3;
    
    // 随机目标方向（左下方区域）
    const targetX = width * Math.random() * 0.3;
    const targetY = height * (0.7 + Math.random() * 0.3);
    
    // 抛物线运动参数
    const speed = 0.8 + Math.random() * 0.4;
    const dx = targetX - startX;
    const dy = targetY - startY;
    const distance = Math.sqrt(dx*dx + dy*dy);
    const duration = distance / (speed * 100);
    
    return {
        x: startX,
        y: startY,
        vx: dx / duration,
        vy: dy / duration,
        life: 1,
        size: 4 + Math.random() * 3,  // 增大尺寸范围
        color: colours[Math.floor(Math.random() * colours.length)],
        trail: [],
        curve: Math.random() * 0.02  // 随机曲线参数
    };
}

function update(dt) {
    // 增加流星生成概率
    if (Math.random() < 0.08) {
        particles.push(createMeteor());
    }

    particles.forEach(p => {
        // 添加自然曲线运动
        p.x += p.vx * dt * 1000 + Math.sin(p.y * p.curve) * 20;
        p.y += p.vy * dt * 1000;
        p.life -= 0.15 * dt;

        // 动态轨迹点
        p.trail.push({
            x: p.x - p.vx * 3,
            y: p.y - p.vy * 3,
            alpha: p.life,
            width: p.size * 0.8
        });
        
        // 控制轨迹长度
        if (p.trail.length > 25) p.trail.shift();
        
        // 动态调整轨迹宽度
        p.trail.forEach(point => {
            point.width *= 0.96;
            point.alpha *= 0.92;
        });
    });

    // 粒子回收
    particles = particles.filter(p => p.life > 0.1 && 
        p.x > -500 && p.x < width + 500 && 
        p.y > -500 && p.y < height + 500);
}

function draw() {
    if (!ctx) return;
    
    ctx.clearRect(0, 0, width, height);
    
    particles.forEach(p => {
        // 绘制渐变拖尾
        p.trail.forEach((pos, i) => {
            if (!p.trail[i + 1]) return;
            
            const gradient = ctx.createLinearGradient(
                pos.x, pos.y,
                p.trail[i + 1].x, p.trail[i + 1].y
            );
            gradient.addColorStop(0, `${p.color}${Math.floor(pos.alpha * 255).toString(16)}`);
            gradient.addColorStop(1, `${p.color}00`);
            
            ctx.beginPath();
            ctx.moveTo(pos.x, pos.y);
            ctx.lineTo(p.trail[i + 1].x, p.trail[i + 1].y);
            ctx.strokeStyle = gradient;
            ctx.lineWidth = pos.width;
            ctx.lineCap = 'round';
            ctx.stroke();
        });

        // 绘制头部（带光晕效果）
        const gradient = ctx.createRadialGradient(
            p.x, p.y, 0, 
            p.x, p.y, p.size * 2
        );
        gradient.addColorStop(0, `${p.color}ff`);
        gradient.addColorStop(1, `${p.color}00`);
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 1.5, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.globalAlpha = p.life * 0.8;
        ctx.fill();
    });
    ctx.globalAlpha = 1.0;
}

// 初始化画布（保持不变）
function initCanvas() { /* 同之前版本 */ }

// 动画循环（保持不变）
const requestFrame = () => setTimeout(loop, mspf);
function loop() { /* 同之前版本 */ }

// 事件监听（保持不变）
window.addEventListener('focus', () => { /* 同之前版本 */ });
window.addEventListener('blur', () => focused = false);
window.addEventListener('keydown', e => { /* 同之前版本 */ });

// 启动动画
requestFrame();