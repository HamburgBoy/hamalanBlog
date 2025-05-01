// meteor.js
(function() {
    // ====================== 配置项 ======================
    const defaultConfig = {
        container: "#sky",         // 容器选择器
        spawnRate: 200,          // 生成间隔(ms)
        minSpeed: 2000,            // 最小动画时长
        maxSpeed: 3500,           // 最大动画时长
        minSize: 0.4,             // 最小尺寸
        maxSize: 0.7,             // 最大尺寸
        maxStars: 35,             // 最大存在数量
        color: "rgba(255,255,255,0.9)", // 流星颜色
        zIndex: 10000             // 层级
    };

    // 合并自定义配置
    const config = {
        ...defaultConfig,
        ...(window.METEOR_CONFIG || {})
    };

    // ====================== 核心实现 ======================
    let intervalId = null;
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
            transform: 'rotate(-45deg)',
            transformOrigin: '0 0',
            filter: 'blur(1px)',
            boxShadow: '0 0 15px rgba(255, 255, 255, 0.4)'
        });

        star.appendChild(tail);
        return star;
    }

    function animateStar(star, startX, startY, duration) {
        const startTime = Date.now();
        const endX = startX - 400 + Math.random() * 100;
        const endY = startY + 250 + Math.random() * 50;

        function update() {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);

            star.style.left = `${startX + (endX - startX) * progress}px`;
            star.style.top = `${startY + (endY - startY) * progress}px`;
            star.style.opacity = Math.min(progress * 3, 0.8) * (1 - progress);

            progress < 1 ? requestAnimationFrame(update) : star.remove();
        }
        requestAnimationFrame(update);
    }

    function spawnMeteor() {
        if (container.children.length > config.maxStars) return;

        const star = createStar();
        const startX = window.innerWidth + 100;
        const startY = -50 + Math.random() * 200;
        const scale = config.minSize + Math.random() * (config.maxSize - config.minSize);
        const duration = config.minSpeed + Math.random() * (config.maxSpeed - config.minSpeed);

        Object.assign(star.style, {
            left: `${startX}px`,
            top: `${startY}px`,
            transform: `scale(${scale})`
        });

        container.appendChild(star);
        animateStar(star, startX, startY, duration);
    }

    function init() {
        // 清理旧实例
        if (intervalId) clearInterval(intervalId);
        
        // 重置容器尺寸
        Object.assign(container.style, {
            width: '100vw',
            height: '100vh'
        });

        // 启动生成器
        intervalId = setInterval(spawnMeteor, config.spawnRate);

        // 性能优化：页面不可见时暂停
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                clearInterval(intervalId);
            } else {
                intervalId = setInterval(spawnMeteur, config.spawnRate);
            }
        });

        // 窗口resize时重置
        window.addEventListener('resize', () => {
            clearInterval(intervalId);
            intervalId = setInterval(spawnMeteor, config.spawnRate);
        });
    }

    // ====================== 自动初始化 ======================
    if (document.readyState === 'complete') {
        init();
    } else {
        window.addEventListener('load', init);
    }

    // ====================== 公开API ======================
    window.MeteorAnimation = {
        destroy: () => {
            clearInterval(intervalId);
            container.remove();
        },
        restart: () => {
            init();
        }
    };
})();