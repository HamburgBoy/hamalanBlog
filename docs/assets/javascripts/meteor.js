// Meteor
const fps = 30;
const mspf = Math.floor(1000 / fps);
const colours = ["#92c5ff", "#4a86e8", "#a64aeb", "#00ffff"];

let width = window.innerWidth * devicePixelRatio;
let height = window.innerHeight * devicePixelRatio;
let canvas;
let ctx;
let particles = [];
let disabled = false;
let focused = true;
let lastTime = performance.now();

function createMeteor() {
    const side = Math.floor(Math.random() * 4); // 0:left 1:right 2:top 3:bottom
    const speed = 0.4 + Math.random() * 0.4;
    
    return {
        x: side === 0 ? -100 : 
           side === 1 ? width + 100 : 
           Math.random() * width,
        y: side === 2 ? -100 : 
           side === 3 ? height + 100 : 
           Math.random() * height,
        vx: (side === 0 ? 1 : side === 1 ? -1 : 0) * speed,
        vy: (side === 2 ? 1 : side === 3 ? -1 : 0) * speed,
        life: 1,
        size: 1.5 + Math.random() * 2,
        color: colours[Math.floor(Math.random() * colours.length)],
        trail: []
    };
}

function update(dt) {
    // Add new meteors
    if (Math.random() < 0.03) {
        particles.push(createMeteor());
    }

    // Update existing meteors
    particles.forEach(p => {
        p.x += p.vx * dt * 1000;
        p.y += p.vy * dt * 1000;
        p.life -= 0.2 * dt;

        // Add trail points
        p.trail.push({x: p.x, y: p.y, alpha: p.life});
        if (p.trail.length > 12) p.trail.shift();
    });

    // Remove expired particles
    particles = particles.filter(p => p.life > 0 && 
        p.x > -200 && p.x < width + 200 && 
        p.y > -200 && p.y < height + 200);
}

function draw() {
    if (!ctx) return;
    
    ctx.clearRect(0, 0, width, height);
    
    particles.forEach(p => {
        // Draw trail
        p.trail.forEach((pos, i) => {
            const ratio = i / p.trail.length;
            ctx.beginPath();
            ctx.moveTo(pos.x, pos.y);
            if (p.trail[i + 1]) {
                ctx.lineTo(p.trail[i + 1].x, p.trail[i + 1].y);
            }
            ctx.strokeStyle = p.color;
            ctx.lineWidth = p.size * (1 - ratio);
            ctx.globalAlpha = pos.alpha * 0.8;
            ctx.stroke();
        });

        // Draw head
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 0.8, 0, Math.PI * 2);
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
    
    // Dark mode adaptation
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        canvas.style.filter = 'brightness(1.5)';
    }
    
    ctx = canvas.getContext('2d');
    canvas.width = width;
    canvas.height = height;
    
    // Handle window resize
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

// Control events
window.addEventListener('focus', () => {
    focused = true;
    lastTime = performance.now();
    requestFrame();
});

window.addEventListener('blur', () => focused = false);

window.addEventListener('keydown', e => {
    if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        disabled = !disabled;
        canvas.style.display = disabled ? 'none' : 'block';
        if (!disabled) requestFrame();
    }
});

// Start animation
requestFrame();