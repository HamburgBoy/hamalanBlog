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
    const sky = document.querySelector("#sky");
    if (!sky) return;

    for (let i = 0; i < 2; i++) {
        const star = document.createElement("div");
        star.className = "star";

        // 设置初始位置和大小
        const top = -50 + Math.random() * 200;
        const left = 200 + Math.random() * 1200;
        const scale = 0.3 + Math.random() * 0.5;
        const timer = 1000 + Math.random() * 1000;

        star.style.position = "absolute";
        star.style.opacity = "0";
        star.style.zIndex = "10000";
        star.style.top = `${top}px`;
        star.style.left = `${left}px`;
        star.style.transform = `scale(${scale})`;

        // 动态添加伪元素样式
        const afterStyle = document.createElement("style");
        afterStyle.innerHTML = `
            .star::after {
                content: "";
                display: block;
                border: solid;
                border-width: 2px 0 2px 80px;
                border-color: transparent transparent transparent rgba(255, 255, 255, 1);
                border-radius: 2px 0 0 2px;
                transform: rotate(-45deg);
                transform-origin: 0 0 0;
                box-shadow: 0 0 20px rgba(255, 255, 255, .3);
            }
        `;
        document.head.appendChild(afterStyle);

        sky.appendChild(star);

        // 动画逻辑
        requestAnimation({
            ele: star,
            
            attr: ["top", "left", "opacity"],
            value: [150, -150, .8],
            time: timer,
            flag: false,
            fn: function() {
                requestAnimation({
                    ele: star,
                    attr: ["top", "left", "opacity"],
                    value: [150, -150, 0],
                    time: timer,
                    flag: false,
                    fn: () => {
                        sky.removeChild(star);
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
        // 移除拖尾绘制逻辑，直接使用 CSS 样式
        const star = document.createElement("div");
        star.className = "star";

        // 设置流星的初始位置和大小
        star.style.position = "absolute";
        star.style.opacity = "0";
        star.style.zIndex = "10000";
        star.style.top = `${p.y}px`;
        star.style.left = `${p.x}px`;
        star.style.transform = `scale(${p.size})`;

        document.querySelector("#sky").appendChild(star);

        // 动画逻辑
        requestAnimation({
            ele: star,
            attr: ["top", "left", "opacity"],
            value: [p.y + 150, p.x - 150, 0],
            time: 1000 + Math.random() * 1000,
            flag: false,
            fn: () => {
                star.parentElement.removeChild(star);
            }
        });
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