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

// 替换流星的创建和动画逻辑
setInterval(function() {
    const obj = addChild("#sky", "div", 2, "star");

    for (let i = 0; i < obj.children.length; i++) {
        const top = -50 + Math.random() * 200 + "px",
            left = 200 + Math.random() * 1200 + "px",
            scale = 0.3 + Math.random() * 0.5;
        const timer = 1000 + Math.random() * 1000;

        obj.children[i].style.top = top;
        obj.children[i].style.left = left;
        obj.children[i].style.transform = `scale(${scale})`;

        requestAnimation({
            ele: obj.children[i],
            attr: ["top", "left", "opacity"],
            value: [150, -150, .8],
            time: timer,
            flag: false,
            fn: function() {
                requestAnimation({
                    ele: obj.children[i],
                    attr: ["top", "left", "opacity"],
                    value: [150, -150, 0],
                    time: timer,
                    flag: false,
                    fn: () => {
                        obj.parent.removeChild(obj.children[i]);
                    }
                });
            }
        });
    }

}, 1000);

function draw() {
    if (!ctx) return;

    // 清除画布，避免透明度叠加导致页面变黑
    ctx.clearRect(0, 0, width, height);

    particles.forEach(p => {
        ctx.beginPath();
        ctx.moveTo(p.trail[0].x, p.trail[0].y); // 从拖尾的起点开始
        p.trail.forEach((pos, i) => {
            ctx.lineTo(pos.x, pos.y); // 连续绘制拖尾
        });

        const gradient = ctx.createLinearGradient(p.trail[0].x, p.trail[0].y, p.trail[p.trail.length - 1].x, p.trail[p.trail.length - 1].y);
        gradient.addColorStop(0, `${p.color.replace(/\d+\.?\d*\)$/, '1)')}`); // 起点颜色
        gradient.addColorStop(1, `${p.color.replace(/\d+\.?\d*\)$/, '0)')}`); // 终点颜色

        ctx.strokeStyle = gradient;
        ctx.lineWidth = p.trail[0].width; // 使用起点宽度
        ctx.lineCap = 'round';
        ctx.stroke();

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

    // 添加调试日志
    console.log('Canvas added to document:', document.body.contains(canvas));
    console.log('Canvas context initialized:', !!ctx);
    
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

// 启动动画
requestFrame();