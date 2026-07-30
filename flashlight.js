document.addEventListener('DOMContentLoaded', () => {
    const dots = document.getElementById('dots');
    if (!dots) return;

    const ctx = dots.getContext('2d');
    const torchArea = document.getElementById('torch');

    let canvasWidth = 0;
    let canvasHeight = 0;
    let mx = 0;
    let my = 0;
    const LIGHT_RADIUS = 130; // радиус луча фонарика

    function setupCanvas() {
        // Используем размеры контейнера, а не окна — чтобы маска работала только над игровым полем
        const rect = torchArea.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;

        canvasWidth = rect.width;
        canvasHeight = rect.height;

        dots.width = canvasWidth * dpr;
        dots.height = canvasHeight * dpr;
        dots.style.width = canvasWidth + 'px';
        dots.style.height = canvasHeight + 'px';

        ctx.setTransform(1, 0, 0, 1, 0, 0); // сброс
        ctx.scale(dpr, dpr);

        // Центрируем курсор, чтобы при загрузке фонарик был в центре
        mx = canvasWidth / 2;
        my = canvasHeight / 2;
    }

    function render() {
        // 1. Полностью затемняем область
        ctx.globalCompositeOperation = 'source-over';
        ctx.fillStyle = 'rgba(10, 10, 25, 0.97)';
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);

        // 2. "Вырезаем" круг света в позиции курсора
        ctx.globalCompositeOperation = 'destination-out';

        const gradient = ctx.createRadialGradient(mx, my, 0, mx, my, LIGHT_RADIUS);
        gradient.addColorStop(0, 'rgba(0, 0, 0, 1)');
        gradient.addColorStop(0.6, 'rgba(0, 0, 0, 0.9)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(mx, my, LIGHT_RADIUS, 0, Math.PI * 2);
        ctx.fill();

        // 3. Возвращаем обычный режим рисования
        ctx.globalCompositeOperation = 'source-over';

        requestAnimationFrame(render);
    }

    // Преобразуем координаты курсора в координаты canvas
    function updatePosition(clientX, clientY) {
        const rect = torchArea.getBoundingClientRect();
        mx = clientX - rect.left;
        my = clientY - rect.top;
    }

    // Мышь
    window.addEventListener('mousemove', (e) => {
        updatePosition(e.clientX, e.clientY);
    });

    // Касания (мобильные)
    torchArea.addEventListener('touchstart', (e) => {
        if (e.touches.length > 0) {
            updatePosition(e.touches[0].clientX, e.touches[0].clientY);
        }
    }, { passive: true });

    torchArea.addEventListener('touchmove', (e) => {
        if (e.touches.length > 0) {
            updatePosition(e.touches[0].clientX, e.touches[0].clientY);
            // Предотвращаем скролл страницы при вождении пальца по игровому полю
            e.preventDefault();
        }
    }, { passive: false });

    // При ресайзе / повороте экрана — пересчитываем размеры
    window.addEventListener('resize', setupCanvas);
    window.addEventListener('orientationchange', () => {
        setTimeout(setupCanvas, 100);
    });

    // Старт
    setupCanvas();
    requestAnimationFrame(render);
});