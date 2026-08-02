document.addEventListener('DOMContentLoaded', () => {
    const allImages = [
        { file: 'airplane.png', name: 'Самолёт'  },
        { file: 'aist.png',     name: 'Аист'     },
        { file: 'bus.png',      name: 'Автобус'  },
        { file: 'busi.png',     name: 'Бусы'     },
        { file: 'chasi.png',    name: 'Часы'     },
        { file: 'dog.png',      name: 'Собака'   },
        { file: 'kaktus.png',   name: 'Кактус'   },
        { file: 'kapusta.png',  name: 'Капуста'  },
        { file: 'kassa.png',    name: 'Касса'    },
        { file: 'kokos.png',    name: 'Кокос'    },
        { file: 'koleso.png',   name: 'Колесо'   },
        { file: 'kolyaska.png', name: 'Коляска'  },
        { file: 'kosa.png',     name: 'Коса'     },
        { file: 'maska.png',    name: 'Маска'    },
        { file: 'noski.png',    name: 'Носки'    },
        { file: 'posuda.png',   name: 'Посуда'   },
        { file: 'pylesos.png',  name: 'Пылесос'  },
        { file: 'sani.png',     name: 'Сани'     },
        { file: 'sapogi.png',   name: 'Сапоги'   },
        { file: 'sok.png',      name: 'Сок'      },
        { file: 'soup.png',     name: 'Суп'      },
        { file: 'sova.png',     name: 'Сова'     },
        { file: 'sumka.png',    name: 'Сумка'    },
        { file: 'sunduk.png',   name: 'Сундук'   }
    ];

    const IMAGES_PER_GAME = 6;

    // Загрузка звука
    const clickSound = new Audio('sounds/click.mp3');
    clickSound.preload = 'auto';

    function getRandomItems(arr, count) {
        const copy = arr.slice();
        const result = [];
        for (let i = 0; i < count && copy.length > 0; i++) {
            const randomIndex = Math.floor(Math.random() * copy.length);
            result.push(copy.splice(randomIndex, 1)[0]);
        }
        return result;
    }

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

    function generateFigures() {
        const container = document.getElementById('figuresContainer');
        if (!container) return;

        const selected = getRandomItems(allImages, IMAGES_PER_GAME);
        const html = selected.map(createFigureHTML).join('');
        
        const canvas = document.getElementById('dots');
        container.innerHTML = '';
        container.appendChild(canvas);
        container.insertAdjacentHTML('beforeend', html);

        if (typeof gsap !== 'undefined') {
            gsap.from('.figures__figure', {
                duration: 0.6,
                scale: 0.8,
                opacity: 0,
                stagger: 0.15,
                ease: 'back.out(1.7)'
            });
        }
    }

    generateFigures();

    const refreshBtn = document.getElementById('refreshBtn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', () => {
            // Воспроизведение звука
            clickSound.currentTime = 0; // Сброс к началу
            clickSound.play().catch(e => console.log('Audio play failed:', e));

            // Анимация кнопки
            if (typeof gsap !== 'undefined') {
                gsap.to(refreshBtn, {
                    scale: 0.95,
                    duration: 0.1,
                    yoyo: true,
                    repeat: 1
                });
            }

            // Генерация новых картинок
            generateFigures();
        });
    }
});
