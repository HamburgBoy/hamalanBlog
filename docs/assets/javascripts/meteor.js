const canvas = document.getElementById('meteorCanvas');
const ctx = canvas.getContext('2d');

// 初始化画布尺寸
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Meteor {
    constructor() {
        // 初始化参数
        this.reset();
        // 添加曲线运动参数
        this.curve = Math.random() * 0.02;
        this.curvePhase = Math.random() * Math.PI * 2;
    }

    reset() {
        // 生成位置（右上方区域）
        this.x = canvas.width * 0.7 + Math.random() * canvas.width * 0.3;
        this.y = 0;
        
        // 运动参数（速度降低30%-50%）
        this.speed = Math.random() * 2 + 1; // 原速度的1/3
        this.angle = Math.PI/4 + (Math.random()-0.5)*0.2; // 添加随机角度偏移
        
        // 外观参数
        this.length = 80 + Math.random() * 70; // 增加长度
        this.opacity = 1;
        this.lineWidth = 1.5 + Math.random(); // 增加线宽
        this.color = `hsl(${200 + Math.random()*40}, 80%, 70%)`; // 蓝青色系
    }

    update(deltaTime) {
        // 使用时间差保持速度稳定
        const baseSpeed = this.speed * deltaTime * 60;
        
        // 添加曲线运动
        this.x += baseSpeed * Math.cos(this.angle) + Math.sin(this.curvePhase) * 15;
        this.y += baseSpeed * Math.sin(this.angle);
        this.curvePhase += this.curve;
        
        // 透明度衰减
        this.opacity -= 0.005;
        
        // 自动重置条件
        if (this.x < -100 || 
            this.y > canvas.height + 100 ||
            this.opacity < 0.1) {
            this.reset();
        }
    }

    draw() {
        // 创建拖尾渐变
        const gradient = ctx.createLinearGradient(
            this.x,
            this.y,
            this.x - this.length * Math.cos(this.angle),
            this.y - this.length * Math.sin(this.angle)
        );
        gradient.addColorStop(0, `hsla(200, 80%, 70%, ${this.opacity})`);
        gradient.addColorStop(1, `hsla(200, 80%, 90%, 0)`);

        // 绘制流星
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(
            this.x - this.length * Math.cos(this.angle),
            this.y - this.length * Math.sin(this.angle)
        );
        ctx.strokeStyle = gradient;
        ctx.lineWidth = this.lineWidth;
        ctx.lineCap = 'round';
        ctx.stroke();
    }
}

// 初始化流星数组
const meteors = Array.from({length: 15}, () => new Meteor());

// 动画循环
let lastTime = 0;
function animate(timestamp) {
    const deltaTime = timestamp - lastTime;
    lastTime = timestamp;

    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'; // 添加残影效果
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    meteors.forEach(meteor => {
        meteor.update(deltaTime);
        meteor.draw();
    });

    requestAnimationFrame(animate);
}

// 启动动画
animate(0);