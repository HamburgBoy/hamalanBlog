// Meteor Shower
const fps = 30;
const mspf = Math.floor(1000 / fps);

let width = window.innerWidth || document.documentElement.clientWidth;
let height = window.innerHeight || document.documentElement.clientHeight;
let canvas;
let ctx;

window.addEventListener('resize', () => {
    width = window.innerWidth || document.documentElement.clientWidth;
    height = window.innerHeight || document.documentElement.clientHeight;
    if (canvas) {
        canvas.width = width;
        canvas.height = height;
    }
});

let meteors = [];
let disabled = false;
let focused = true;
let lastTime = performance.now();

function createMeteor() {
    const side = Math.floor(Math.random() * 4); // 0:top 1:right 2:bottom 3:left
    let startX, startY;
    const endX = width * Math.random();
    const endY = height * Math.random();
    const speed = 400 + Math.random() * 200; // 400-600 pixels/sec

    switch(side) {
        case 0: // Top
            startX = Math.random() * width;
            startY = -20;
            break;
        case 1: // Right
            startX = width + 20;
            startY = Math.random() * height;
            break;
        case 2: // Bottom
            startX = Math.random() * width;
            startY = height + 20;
            break;
        case 3: // Left
            startX = -20;
            startY = Math.random() * height;
            break;
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
        color: `hsl(${200 + Math.random()*40}, 80%, 70%)` // Blueish colors
    };
}

function updateMeteors(dt) {
    // Add new meteors randomly
    if(Math.random() < 0.02) {
        meteors.push(createMeteor());
    }

    // Update existing meteors
    for(let i = meteors.length-1; i >= 0; i--) {
        const meteor = meteors[i];
        
        meteor.x += meteor.dx * dt;
        meteor.y += meteor.dy * dt;
        meteor.alpha -= 0.4 * dt;

        // Add current position to trail (max 15 points)
        meteor.trail.push({x: meteor.x, y: meteor.y});
        if(meteor.trail.length > 15) meteor.trail.shift();

        // Remove expired meteors
        if(meteor.alpha <= 0 || 
           meteor.x < -100 || meteor.x > width+100 || 
           meteor.y < -100 || meteor.y > height+100) {
            meteors.splice(i, 1);
        }
    }
}

function drawMeteor(meteor) {
    if(meteor.trail.length < 2) return;

    // Draw trail with gradient
    const gradient = ctx.createLinearGradient(
        meteor.trail[0].x, meteor.trail[0].y,
        meteor.trail[meteor.trail.length-1].x, 
        meteor.trail[meteor.trail.length-1].y
    );
    gradient.addColorStop(0, `${meteor.color}00`);     // Transparent start
    gradient.addColorStop(0.2, meteor.color);         // Solid color
    gradient.addColorStop(1, `${meteor.color}00`);     // Transparent end

    ctx.beginPath();
    ctx.moveTo(meteor.trail[0].x, meteor.trail[0].y);
    for(let i=1; i<meteor.trail.length; i++) {
        ctx.lineTo(meteor.trail[i].x, meteor.trail[i].y);
    }
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Draw head
    ctx.beginPath();
    ctx.arc(meteor.x, meteor.y, 3, 0, Math.PI*2);
    ctx.fillStyle = meteor.color;
    ctx.fill();
}

function getContext() {
    if(canvas) return ctx;

    canvas = document.createElement('canvas');
    canvas.id = 'meteor-canvas';
    canvas.width = width;
    canvas.height = height;
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
    ctx = canvas.getContext('2d');
    return ctx;
}

function draw() {
    const ctx = getContext();
    ctx.clearRect(0, 0, width, height);
    
    // Draw all meteors
    meteors.forEach(meteor => {
        ctx.globalAlpha = meteor.alpha;
        drawMeteor(meteor);
    });
    ctx.globalAlpha = 1.0;
}

function loop() {
    const now = performance.now();
    const dt = (now - lastTime) / 1000; // in seconds

    updateMeteors(dt);
    draw();

    lastTime = now;
    if(focused && !disabled) {
        setTimeout(loop, mspf);
    }
}

// Event listeners
window.addEventListener('focus', () => {
    focused = true;
    lastTime = performance.now();
    loop();
});

window.addEventListener('blur', () => {
    focused = false;
});

window.addEventListener('keydown', e => {
    if(e.ctrlKey && e.key === 's') {
        e.preventDefault();
        disabled = !disabled;
        canvas.style.display = disabled ? 'none' : 'block';
        if(!disabled) {
            lastTime = performance.now();
            loop();
        }
    }
});

// Start animation
loop();