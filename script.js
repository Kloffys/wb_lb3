// --- Отримуємо елементи ---
const galleryList = document.getElementById('galleryList');
const btnUp = document.getElementById('btnUp');
const btnDown = document.getElementById('btnDown');
const widthInput = document.getElementById('widthInput');
const heightInput = document.getElementById('heightInput');
const borderInput = document.getElementById('borderInput');
const altInput = document.getElementById('altInput');
const applyBtn = document.getElementById('applyBtn');
const resetBtn = document.getElementById('resetBtn');

let selectedFigure = null;

// --- Початкова ініціалізація даних ---
galleryList.querySelectorAll('figure').forEach(fig => {
    const img = fig.querySelector('img');

    // Зберігаємо початкові параметри
    img.dataset.originalWidth = img.dataset.width || img.naturalWidth;
    img.dataset.originalHeight = img.dataset.height || img.naturalHeight;
    img.dataset.originalBorder = img.dataset.border || '2';
    img.dataset.originalAlt = img.getAttribute('alt') || '';
});

// --- Вибір зображення ---
galleryList.querySelectorAll('figure').forEach(fig => {
    fig.addEventListener('click', () => selectFigure(fig));

    function selectFigure(fig) {
        if (selectedFigure === fig) return;
        if (selectedFigure) selectedFigure.classList.remove('selected');
        selectedFigure = fig;
        selectedFigure.classList.add('selected');
        loadCurrentValues();
        selectedFigure.focus();
    }

    function loadCurrentValues() {
        if (!selectedFigure) {
            widthInput.value = '';
            heightInput.value = '';
            borderInput.value = '';
            altInput.value = '';
            return;
        }

        const img = selectedFigure.querySelector('img');
        const w = parseInt(img.style.width) || parseInt(img.dataset.width) || parseInt(img.dataset.originalWidth);
        const h = parseInt(img.style.height) || parseInt(img.dataset.height) || parseInt(img.dataset.originalHeight);
        const b = parseInt(img.style.borderWidth) || parseInt(img.dataset.border) || parseInt(img.dataset.originalBorder);
        const alt = img.getAttribute('alt') || img.dataset.originalAlt;

        widthInput.value = w;
        heightInput.value = h;
        borderInput.value = b;
        altInput.value = alt;
    }

    // --- Переміщення ---
    function moveSelectedUp() {
        if (!selectedFigure) return;
        const prev = selectedFigure.previousElementSibling;
        if (!prev) return;
        galleryList.insertBefore(selectedFigure, prev);
        selectedFigure.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    function moveSelectedDown() {
        if (!selectedFigure) return;
        const next = selectedFigure.nextElementSibling;
        if (!next) return;
        galleryList.insertBefore(next, selectedFigure);
        selectedFigure.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    btnUp.addEventListener('click', moveSelectedUp);
    btnDown.addEventListener('click', moveSelectedDown);

    document.addEventListener('keydown', (e) => {
        if (!e.ctrlKey) return;
        if (e.key === 'ArrowUp') { e.preventDefault(); moveSelectedUp(); }
        if (e.key === 'ArrowDown') { e.preventDefault(); moveSelectedDown(); }
    });

    // --- Застосування параметрів ---
    applyBtn.addEventListener('click', () => {
        if (!selectedFigure) {
            alert('Спочатку виберіть зображення.');
            return;
        }

        const img = selectedFigure.querySelector('img');
        const w = parseInt(widthInput.value);
        const h = parseInt(heightInput.value);
        const b = parseInt(borderInput.value);
        const alt = altInput.value;

        if (!Number.isNaN(w) && w > 0) img.style.width = w + 'px';
        if (!Number.isNaN(h) && h > 0) img.style.height = h + 'px';
        if (!Number.isNaN(b) && b >= 0) img.style.borderWidth = b + 'px';
        img.setAttribute('alt', alt);

        img.dataset.width = w || img.dataset.width || img.dataset.originalWidth;
        img.dataset.height = h || img.dataset.height || img.dataset.originalHeight;
        img.dataset.border = b || img.dataset.border || img.dataset.originalBorder;

        selectedFigure.animate([{ transform: 'scale(0.995)' }, { transform: 'scale(1)' }], {
            duration: 160,
            easing: 'ease-out'
        });
    });

    // --- Скидання значень ---
    resetBtn.addEventListener('click', () => {
        if (!selectedFigure) return;
        const img = selectedFigure.querySelector('img');

        // Повертаємо до початкових параметрів
        img.style.width = img.dataset.originalWidth + 'px';
        img.style.height = img.dataset.originalHeight + 'px';
        img.style.borderWidth = img.dataset.originalBorder + 'px';
        img.setAttribute('alt', img.dataset.originalAlt);

        // Оновлюємо поля вводу
        widthInput.value = img.dataset.originalWidth;
        heightInput.value = img.dataset.originalHeight;
        borderInput.value = img.dataset.originalBorder;
        altInput.value = img.dataset.originalAlt;

        selectedFigure.animate([{ transform: 'scale(0.98)' }, { transform: 'scale(1)' }], {
            duration: 150,
            easing: 'ease-out'
        });
    });

    // --- Початкова ініціалізація ---
    const first = galleryList.querySelector('figure');
    if (first) selectFigure(first);

    // --- Подвійний клік: відкрити у новій вкладці ---
    galleryList.addEventListener('dblclick', (e) => {
        const fig = e.target.closest('figure');
        if (!fig) return;
        const img = fig.querySelector('img');
        window.open(img.src, '_blank');
    });

    // --- Додаткові атрибути для доступності ---
    galleryList.setAttribute('role', 'list');
    galleryList.querySelectorAll('figure').forEach(f => f.setAttribute('role', 'listitem'));
