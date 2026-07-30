document.addEventListener('DOMContentLoaded', () => {
    // Массив всех доступных картинок: файл + русское название
    const allImages = [
        { file: 'bus.png',       name: 'Автобус'  },
        { file: 'pineapple.png', name: 'Ананас'   },
        { file: 'cactus.png',    name: 'Кактус'   },
        { file: 'cabbage.png',   name: 'Капуста'  },
        { file: 'stroller.png',  name: 'Коляска'  },
        { file: 'sumka.png',     name: 'Сумка'    },
        { file: 'sok.png',       name: 'Сок'      },
        { file: 'coconut.png',   name: 'Кокос'    },
        { file: 'posuda.png',    name: 'Посуда'   },
        { file: 'sunduk.png',    name: 'Сундук'   },
        { file: 'maska.png',     name: 'Маска'    }
    ];

    const IMAGES_PER_GAME = 6; // сколько картинок показывать за раз

    // Алгоритм Фишера-Йетса для случайного выбора N элементов
    function getRandomItems(arr, count) {
        const copy = arr.slice(); // копия, чтобы не менять оригинал
        const result = [];
        for (let i = 0; i < count && copy.length > 0; i++) {
            const randomIndex = Math.floor(Math.random() * copy.length);
            result.push(copy.splice(randomIndex, 1)[0]);
        }
        return result;
    }

    // Генерируем HTML для одной картинки
    function createFigureHTML(item, index) {
        return `
            <figure class="figures__figure">
                <img id="character${index + 1}" 
                     src="img/figur/${item.file}" 
                     class="figures__img" 
                     alt="${item.name}">
                <figcaption class="figures__par">${item.name}</figcaption>
            </figure>
        `;
    }

    // Выбираем 6 случайных картинок и вставляем в контейнер
    const container = document.getElementById('figuresContainer');
    if (container) {
        const selected = getRandomItems(allImages, IMAGES_PER_GAME);
        const html = selected.map(createFigureHTML).join('');
        // Вставляем НОВОЕ содержимое, но сохраняем canvas
        const canvas = document.getElementById('dots');
        container.innerHTML = '';
        container.appendChild(canvas);
        container.insertAdjacentHTML('beforeend', html);
    }
});