document.addEventListener('DOMContentLoaded', () => {
    const dots = document.getElementById('dots');
    if (!dots) return;

    const ctx = dots.getContext('2d');
    const torchArea = document.getElementById('torch');

    let canvasWidth = 0;
    let canvasHeight = 0;
    let mx = 0;
    let my = 0;
    const LIGHT_RADIUS = 60; // ⚡ Радиус 60px

    function setupCanvas() {
        //  Размеры canvas берём от torchArea (родителя), чтобы canvas покрывал всю область
        const rect = torchArea.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;

        canvasWidth = rect.width;
        canvasHeight = rect.height;

        dots.width = canvasWidth * dpr;
        dots.height = canvasHeight * dpr;
        dots.style.width = canvasWidth + 'px';
        dots.style.height = canvasHeight + 'px';

        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.scale(dpr, dpr);

        mx = canvasWidth / 2;
        my = canvasHeight / 2;
    }

    function render() {
        ctx.globalCompositeOperation = 'source-over';
        ctx.fillStyle = 'rgba(10, 10, 25, 0.97)';
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);

        ctx.globalCompositeOperation = 'destination-out';

        const gradient = ctx.createRadialGradient(mx, my, 0, mx, my, LIGHT_RADIUS);
        gradient.addColorStop(0, 'rgba(0, 0, 0, 1)');
        gradient.addColorStop(0.6, 'rgba(0, 0, 0, 0.9)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(mx, my, LIGHT_RADIUS, 0, Math.PI * 2);
        ctx.fill();

        ctx.globalCompositeOperation = 'source-over';

        requestAnimationFrame(render);
    }

    function updatePosition(clientX, clientY) {
        // ⚡ ВАЖНО: координаты считаем относительно самого canvas, а не torchArea
        // Это исправляет баг с отступом ~10 см на широких экранах
        const rect = dots.getBoundingClientRect();
        mx = clientX - rect.left;
        my = clientY - rect.top;
    }

    // ===== DESKTOP: МЫШЬ =====
    window.addEventListener('mousemove', (e) => {
        updatePosition(e.clientX, e.clientY);
    });

    // ===== MOBILE: КАСАНИЯ (ваш подход — события на torchArea) =====
    torchArea.addEventListener('touchstart', (e) => {
        if (e.touches.length > 0) {
            updatePosition(e.touches[0].clientX, e.touches[0].clientY);
        }
    }, { passive: true });

    torchArea.addEventListener('touchmove', (e) => {
        if (e.touches.length > 0) {
            updatePosition(e.touches[0].clientX, e.touches[0].clientY);
            e.preventDefault();
        }
    }, { passive: false });

    // ===== RESIZE =====
    window.addEventListener('resize', setupCanvas);
    window.addEventListener('orientationchange', () => {
        setTimeout(setupCanvas, 100);
    });

    setupCanvas();
    requestAnimationFrame(render);
});
