// Meteor
const fps = 60;
const mspf = Math.floor(1000 / fps);
const colours = ["rgba(255, 255, 255, 0.8)", "rgba(200, 200, 255, 0.8)"];

let width = window.innerWidth * devicePixelRatio;
let height = window.innerHeight * devicePixelRatio;
let canvas;
let ctx;
let particles = [];
let disabled = false;
let focused = true;
let lastTime = performance.now();

function createMeteor() {
    const angle = Math.PI / 3; 
    const speed = 0.5 + Math.random() * 1.5; 
    
    return {
        x: Math.random() * width * 1.2 - width * 0.1,
        y: -50,
        vx: -Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        size: 2 + Math.random() * 2,
        color: colours[Math.floor(Math.random() * colours.length)],
        trail: []
    };
}

function update(dt) {
    if (particles.length < 30) {
        particles.push(createMeteor());
    }

    particles.forEach(p => {
        p.x += p.vx * dt * 1000;
        p.y += p.vy * dt * 1000;
        p.life -= 0.02 * dt;

        p.trail.push({
            x: p.x,
            y: p.y,
            alpha: 1,
            width: p.size
        });
        if (p.trail.length > 10) p.trail.shift();
        
        p.trail.forEach((point, index) => {
            const ratio = index / p.trail.length;
            point.alpha = 1 - ratio * 0.8;
            point.width = p.size * (1 - ratio);
        });
    });

    particles = particles.filter(p => p.life > 0 && 
        p.x > -500 && p.x < width + 500 && 
        p.y > -500 && p.y < height + 500);
}

function draw() {
    if (!ctx) return;
    
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, width, height);
    
    particles.forEach(p => {
        p.trail.forEach((pos, i) => {
            if (i === 0) return;
            
            const prev = p.trail[i - 1];
            const gradient = ctx.createLinearGradient(prev.x, prev.y, pos.x, pos.y);
            gradient.addColorStop(0, `${p.color.slice(0, -1)} ${pos.alpha})`);
            gradient.addColorStop(1, `${p.color.slice(0, -1)} 0)`);
            
            ctx.beginPath();
            ctx.moveTo(prev.x, prev.y);
            ctx.lineTo(pos.x, pos.y);
            ctx.strokeStyle = gradient;
            ctx.lineWidth = pos.width;
            ctx.lineCap = 'round';
            ctx.stroke();
        });

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.life;
        ctx.fill();
    });
    ctx.globalAlpha = 1.0;
}

function initCanvas() {
    if (canvas) return;
    
    canvas = document.createElement('canvas');
    canvas.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        pointer-events: none;
        z-index: 2147483647;
    `;
    document.body.appendChild(canvas);
    
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        canvas.style.filter = 'brightness(1.8) saturate(1.2)';
    }
    
    ctx = canvas.getContext('2d');
    canvas.width = width;
    canvas.height = height;
    
    window.addEventListener('resize', () => {
        width = window.innerWidth * devicePixelRatio;
        height = window.innerHeight * devicePixelRatio;
        canvas.width = width;
        canvas.height = height;
    });
}

const requestFrame = () => setTimeout(loop, mspf);

function loop() {
    const now = performance.now();
    const dt = (now - lastTime) / 1000;
    
    initCanvas();
    update(dt);
    draw();
    
    lastTime = now;
    if (focused && !disabled) requestFrame();
}

window.addEventListener('focus', () => {
    focused = true;
    lastTime = performance.now();
    requestFrame();
});

window.addEventListener('blur', () => {
    focused = false;
});

window.addEventListener('keydown', e => {
    if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        disabled = !disabled;
        canvas.style.display = disabled ? 'none' : 'block';
        if (!disabled) requestFrame();
    }
});

// 启动动画
requestFrame();