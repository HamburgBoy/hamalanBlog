// meteor.js
(function() {
    // ====================== 配置项 ======================
    const defaultConfig = {
        container: "#sky",         // 容器选择器
        spawnRate: 500,           // 生成间隔(ms)
        minSpeed: 1000,           // 最小动画时长
        maxSpeed: 2000,           // 最大动画时长
        minSize: 0.4,             // 最小尺寸
        maxSize: 0.7,             // 最大尺寸
        maxStars: 40,             // 最大存在数量
        color: "rgba(255,255,255,0.9)", // 流星颜色
        zIndex: 10000,            // 层级
        horizontalSpread: 1.5,    // 水平扩散系数
        boundaryOffset: 500       // 移出边界距离
    };

    // 合并自定义配置
    const config = {
        ...defaultConfig,
        ...(window.METEOR_CONFIG || {})
    };

    // ====================== 核心实现 ======================
    let intervalId = null;
    let screenWidth = window.innerWidth;
    let screenHeight = window.innerHeight;
    const container = createContainer();

    // 创建容器元素
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

    // 创建流星元素
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

    // 流星动画控制器
    function animateStar(star, startX, startY, duration) {
        const startTime = Date.now();
        // 随机终点：左外或下外区域
        const endX = -config.boundaryOffset - Math.random() * 200;
        const endY = screenHeight + config.boundaryOffset;

        function update() {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // 抛物线运动
            star.style.left = `${startX + (endX - startX) * progress}px`;
            star.style.top = `${startY + (endY - startY) * progress}px`;
            
            // 正弦曲线透明度变化
            star.style.opacity = Math.sin(progress * Math.PI) * 0.8;

            // 持续运行直到移出边界
            if (parseFloat(star.style.left) > -config.boundaryOffset * 2 || 
                parseFloat(star.style.top) < screenHeight + config.boundaryOffset * 2) {
                requestAnimationFrame(update);
            } else {
                star.remove();
            }
        }
        requestAnimationFrame(update);
    }

    // 生成新流星
    function spawnMeteor() {
        // 生成位置计算
        const startX = Math.random() * screenWidth * config.horizontalSpread - 
                      screenWidth * (config.horizontalSpread - 1) / 2;
        const startY = -config.boundaryOffset - Math.random() * 50;
        const scale = config.minSize + Math.random() * (config.maxSize - config.minSize);
        const duration = config.minSpeed + Math.random() * (config.maxSpeed - config.minSpeed);

        const star = createStar();
        Object.assign(star.style, {
            left: `${startX}px`,
            top: `${startY}px`,
            transform: `scale(${scale})`
        });

        container.appendChild(star);
        animateStar(star, startX, startY, duration);
    }

    // 窗口大小变化处理
    function handleResize() {
        screenWidth = window.innerWidth;
        screenHeight = window.innerHeight;
        clearInterval(intervalId);
        intervalId = setInterval(spawnMeteor, config.spawnRate);
    }

    // 初始化动画系统
    function init() {
        // 清理旧实例
        if (intervalId) clearInterval(intervalId);
        
        // 设置容器尺寸
        Object.assign(container.style, {
            width: '100vw',
            height: '100vh'
        });

        // 启动生成器
        intervalId = setInterval(spawnMeteor, config.spawnRate);

        // 页面可见性变化处理
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                clearInterval(intervalId);
            } else {
                intervalId = setInterval(spawnMeteor, config.spawnRate);
            }
        });

        // 窗口尺寸变化监听
        window.addEventListener('resize', handleResize);
    }

    // ====================== 自动初始化 ======================
    if (document.readyState === 'complete') {
        init();
    } else {
        window.addEventListener('load', init);
    }

    // ====================== 公开API ======================
    window.MeteorAnimation = {
        // 销毁动画
        destroy: () => {
            clearInterval(intervalId);
            container.remove();
            window.removeEventListener('resize', handleResize);
            document.removeEventListener('visibilitychange', handleResize);
        },
        
        // 重新启动动画
        restart: () => {
            init();
        },
        
        // 更新配置
        updateConfig: (newConfig) => {
            Object.assign(config, newConfig);
            handleResize();
        }
    };
})();