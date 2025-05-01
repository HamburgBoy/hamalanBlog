// meteor.js
(function() {
    const defaultConfig = {
        container: "#sky",
        spawnRate: 100,
        minSpeed: 8000,
        maxSpeed: 15000,
        minSize: 0.4,
        maxSize: 0.7,
        maxStars: 40,
        color: "rgba(255,255,255,0.9)",
        zIndex: 10000,
        boundaryOffset: 100
    };

    const config = { ...defaultConfig, ...(window.METEOR_CONFIG || {}) };
    let intervalId = null;
    let screenWidth = window.innerWidth;
    let screenHeight = window.innerHeight;
    const container = createContainer();

    function createContainer() {
        let el = document.querySelector(config.container);
        if (!el) {
            el = document.createElement('div');
            el.id = config.container.replace('#', '');
            Object.assign(el.style, {
                position: 'fixed',
                top: '0',
                left: '0',
                width: '100vw',
                height: '100vh',
                pointerEvents: 'none',
                zIndex: config.zIndex,
                overflow: 'hidden'
            });
            document.body.appendChild(el);
        }
        return el;
    }

    function createStar() {
        const star = document.createElement('div');
        Object.assign(star.style, {
            position: 'absolute',
            opacity: '0',
            willChange: 'transform, opacity'
        });

        const tail = document.createElement('div');
        Object.assign(tail.style, {
            position: 'absolute',
            border: 'solid',
            borderWidth: '2px 0 2px 80px',
            borderColor: `transparent transparent transparent ${config.color}`,
            borderRadius: '2px 0 0 2px',
            transform: 'rotate(-45deg)', // 改回45度
            transformOrigin: '0 0',
            filter: 'blur(1px)',
            boxShadow: '0 0 15px rgba(255, 255, 255, 0.4)'
        });

        star.appendChild(tail);
        return star;
    }

    function animateStar(star, startX, startY, direction) {
        const startTime = Date.now();
        const speed = config.minSpeed + Math.random() * (config.maxSpeed - config.minSpeed);
        
        // 根据方向计算终点
        let endX, endY;
        if (direction === 'top') {
            endX = startX - screenWidth * 1.5;
            endY = startY + screenHeight * 1.5;
        } else { // right
            endX = startX - screenWidth * 1.5;
            endY = startY + screenHeight * 1.5;
        }

        function update() {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / speed, 1);

            star.style.left = `${startX + (endX - startX) * progress}px`;
            star.style.top = `${startY + (endY - startY) * progress}px`;
            star.style.opacity = Math.sin(progress * Math.PI) * 0.8;

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                star.remove();
            }
        }
        requestAnimationFrame(update);
    }

    function spawnMeteor() {
        if (container.children.length >= config.maxStars) return;

        const star = createStar();
        const direction = Math.random() < 0.5 ? 'top' : 'right'; // 随机生成方向
        
        // 设置初始位置
        let startX, startY;
        if (direction === 'top') {
            startX = Math.random() * screenWidth * 1.5 - screenWidth * 0.1;
            startY = -config.boundaryOffset;
        } else {
            startX = screenWidth + config.boundaryOffset;
            startY = Math.random() * screenHeight * 1.2 - screenHeight * 0.4;
        }

        const scale = config.minSize + Math.random() * (config.maxSize - config.minSize);
        Object.assign(star.style, {
            left: `${startX}px`,
            top: `${startY}px`,
            transform: `scale(${scale})`
        });

        container.appendChild(star);
        animateStar(star, startX, startY, direction);
    }

    function handleResize() {
        screenWidth = window.innerWidth;
        screenHeight = window.innerHeight;
        clearInterval(intervalId);
        intervalId = setInterval(spawnMeteor, config.spawnRate);
    }

    function init() {
        handleResize();
        window.addEventListener('resize', handleResize);
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) clearInterval(intervalId);
            else intervalId = setInterval(spawnMeteor, config.spawnRate);
        });
    }

    if (document.readyState === 'complete') init();
    else window.addEventListener('load', init);

    window.MeteorAnimation = {
        destroy: () => {
            clearInterval(intervalId);
            container.remove();
            window.removeEventListener('resize', handleResize);
            document.removeEventListener('visibilitychange', handleResize);
        },
        restart: () => init(),
        updateConfig: (newConfig) => {
            Object.assign(config, newConfig);
            handleResize();
        }
    };
})();