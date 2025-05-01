// Meteor Shower
const fps = 60;
const mspf = Math.floor(1000 / fps);
const colours = ["#4a86e8", "#a64aeb", "#00ffff", "#ffffff"];

let width = window.innerWidth || document.documentElement.clientWidth;
let height = window.innerHeight || document.documentElement.clientHeight;
let canvas;
let ctx;
let scale = window.devicePixelRatio || 1;

window.addEventListener('resize', () => {
    width = (window.innerWidth || document.documentElement.clientWidth) * scale;
    height = (window.innerHeight || document.documentElement.clientHeight) * scale;
    if (canvas) {
        canvas.width = width;
        canvas.height = height;
    }
});

let meteors = [];
let disabled = false;
let focused = true;
let lastTime = performance.now();
let pointerX, pointerY;
let velocity = { x: 0, y: 0, tx: 0, ty: 0 };

function createMeteor() {
    const side = Math.floor(Math.random() * 4);
    let startX, startY;
    const endX = pointerX || width/2;
    const endY = pointerY || height/2;
    const speed = 400 + Math.random() * 200;

    switch(side) {
        case 0: startX = -20; startY = Math.random() * height; break;
        case 1: startX = width + 20; startY = Math.random() * height; break;
        case 2: startX = Math.random() * width; startY = -20; break;
        case 3: startX = Math.random() * width; startY = height + 20; break;
    }

    const dx = endX - startX;
    const dy = endY - startY;
    const distance = Math.sqrt(dx*dx + dy*dy);
    const duration = distance / speed;

    return {
        x: startX,
        y: startY,
        dx: dx / duration,
        dy: dy / duration,
        trail: [],
        alpha: 1.0,
        color: colours[Math.floor(Math.random() * colours.length)],
        size: 2 + Math.random() * 3
    };
}

function updateMeteors(dt) {
    // 添加速度惯性效果
    velocity.tx *= 0.96;
    velocity.ty *= 0.96;
    velocity.x += (velocity.tx - velocity.x) * 0.8;
    velocity.y += (velocity.ty - velocity.y) * 0.8;

    // 生成新流星
    if(Math.random() < 0.03) {
        meteors.push(createMeteor());
    }

    // 更新现有流星
    for(let i = meteors.length-1; i >= 0; i--) {
        const m = meteors[i];
        
        m.x += (m.dx + velocity.x) * dt;
        m.y += (m.dy + velocity.y) * dt;
        m.alpha -= 0.4 * dt;

        // 添加轨迹点
        m.trail.push({x: m.x, y: m.y});
        if(m.trail.length > 15) m.trail.shift();

        // 移除过期流星
        if(m.alpha <= 0 || m.x < -100 || m.x > width+100 || m.y < -100 || m.y > height+100) {
            meteors.splice(i, 1);
        }
    }
}

function drawMeteor(m) {
    if(m.trail.length < 2) return;

    // 绘制拖尾
    ctx.beginPath();
    ctx.moveTo(m.trail[0].x, m.trail[0].y);
    for(let i=1; i<m.trail.length; i++) {
        ctx.lineTo(m.trail[i].x, m.trail[i].y);
    }
    ctx.lineWidth = m.size;
    ctx.strokeStyle = m.color;
    ctx.lineCap = 'round';
    ctx.globalAlpha = m.alpha;
    ctx.stroke();

    // 绘制头部光晕
    ctx.beginPath();
    ctx.arc(m.x, m.y, m.size*1.2, 0, Math.PI*2);
    ctx.fillStyle = m.color;
    ctx.globalAlpha = m.alpha*0.8;
    ctx.fill();
}

function initCanvas() {
    if(canvas) return;

    canvas = document.createElement('canvas');
    canvas.style = `
        position: fixed;
        top: 0;
        left: 0;
        pointer-events: none;
        z-index: 255;
    `;
    if((document.documentElement.dataset.darkreaderMode || "").startsWith('filter')) {
        canvas.style.filter = 'invert(1) hue-rotate(180deg)';
    }
    document.body.appendChild(canvas);
    
    canvas.width = width;
    canvas.height = height;
    ctx = canvas.getContext('2d');
    
    // 绑定事件
    canvas.onmousemove = e => {
        pointerX = e.clientX * scale;
        pointerY = e.clientY * scale;
    };
    canvas.ontouchmove = e => {
        pointerX = e.touches[0].clientX * scale;
        pointerY = e.touches[0].clientY * scale;
        e.preventDefault();
    };
    document.onmouseleave = () => {
        pointerX = null;
        pointerY = null;
    };
}

function draw() {
    if(!ctx) return;
    
    ctx.clearRect(0, 0, width, height);
    ctx.globalAlpha = 1.0;
    
    // 绘制所有流星
    meteors.forEach(m => drawMeteor(m));
}

function loop() {
    const now = performance.now();
    const dt = (now - lastTime) / 1000;

    initCanvas();
    updateMeteors(dt);
    draw();

    lastTime = now;
    if(focused && !disabled) {
        setTimeout(loop, mspf);
    }
}

// 窗口事件
window.addEventListener('focus', () => {
    focused = true;
    lastTime = performance.now();
    loop();
});

window.addEventListener('blur', () => focused = false);

window.addEventListener('keydown', e => {
    if(e.ctrlKey && e.key === 's') {
        e.preventDefault();
        disabled = !disabled;
        canvas.style.display = disabled ? 'none' : 'block';
        if(!disabled) loop();
    }
});

// 启动动画
loop();