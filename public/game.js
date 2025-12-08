const output = document.getElementById('game-output');
const choicesContainer = document.getElementById('choices-container');

async function startGame(storyId) {
    try {
        const response = await fetch('/api/start', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ storyId: storyId })
        });
        const data = await response.json();
        renderScene(data);
    } catch (e) {
        output.innerHTML = "<div class='text-block' style='color:red'>Error de conexión. Asegúrate de que el servidor está corriendo.</div>";
    }
}

async function sendChoice(index) {
    try {
        const response = await fetch('/api/action', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ choiceIndex: index })
        });
        const data = await response.json();
        renderScene(data);
    } catch (e) {
        console.error(e);
    }
}

function renderScene(data) {
    // 0. Actualizar título del header con el nombre de la historia
    if (data.story_title) {
        const headerTitle = document.querySelector('header h1');
        if (headerTitle) {
            headerTitle.textContent = data.story_title.toUpperCase();
        }
    }

    // 1. Mostrar Texto Narrativo
    const textBlock = document.createElement('div');
    textBlock.className = 'text-block';

    // Si es final, colorear
    if (data.es_final) {
        if (data.resultado === 'fallo') {
            textBlock.classList.add('result-failure');
        } else {
            textBlock.classList.add('result-success');
        }
    }

    textBlock.innerHTML = data.texto_descriptivo.replace(/\n/g, '<br>');
    output.innerHTML = ''; // Limpiar anterior para esta versión (o podríamos acumular)
    // Para CYOA, a veces es mejor limpiar o dejar historial. Vamos a limpiar para estilo "pantalla de escena".
    output.appendChild(textBlock);
    output.scrollTop = 0; // Force scroll to top for new text

    // 1.5 Mostrar Imagen Dinámica con Placeholder
    const imageContainer = document.getElementById('game-image-container');
    imageContainer.innerHTML = ''; // Limpiar anterior

    // Crear placeholder que se muestra inmediatamente
    const placeholder = document.createElement('div');
    placeholder.className = 'image-placeholder';
    placeholder.innerHTML = '<div class="loading-spinner-img">⏳ Generando imagen...</div>';
    imageContainer.appendChild(placeholder);

    // Usar el tema de la historia para generar imágenes apropiadas
    const storyTheme = data.story_theme || 'dark atmospheric';
    const sceneDescription = data.texto_descriptivo.substring(0, 150);
    const encodedPrompt = encodeURIComponent(`cinematic shot, ${storyTheme}, 8k, highly detailed, ${sceneDescription}`);
    const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=512&height=512&nologo=true&seed=${Math.random()}`;

    const img = document.createElement('img');
    img.id = 'game-image';
    img.src = imageUrl;
    img.alt = "Visualización de la escena";
    img.style.opacity = '0'; // Empieza invisible

    img.onload = () => {
        // Cuando carga, quitar placeholder y mostrar imagen con fade-in
        placeholder.remove();
        imageContainer.appendChild(img);
        setTimeout(() => { img.style.opacity = '1'; }, 10);
    };

    img.onerror = () => {
        placeholder.remove(); // Quitar placeholder si falla
    };

    // 2. Generar Botones
    choicesContainer.innerHTML = '';

    if (data.es_final) {
        const btn = document.createElement('button');
        btn.className = 'choice-btn';
        btn.textContent = "Reiniciar Misión";
        btn.onclick = startGame;
        choicesContainer.appendChild(btn);
    } else {
        data.opciones.forEach((texto, index) => {
            const btn = document.createElement('button');
            btn.className = 'choice-btn';
            btn.textContent = `${index + 1}. ${texto}`; // Añadir número
            btn.onclick = () => sendChoice(index);
            choicesContainer.appendChild(btn);
        });
    }
}

// Iniciar juego
// Iniciar juego (ahora controlado por eventos)
// window.onload = startGame; // Ya no inicia automáticamente

document.addEventListener('DOMContentLoaded', () => {
    const introScreen = document.getElementById('intro-screen');
    const rulesScreen = document.getElementById('rules-screen');
    const storySelectionScreen = document.getElementById('story-selection-screen');
    const gameContainer = document.getElementById('game-container');
    const btnShowRules = document.getElementById('btn-show-rules');
    const btnToSelection = document.getElementById('btn-to-selection');
    const btnBackToMenu = document.getElementById('btn-back-to-menu');
    const storiesList = document.getElementById('stories-list');

    let selectedStoryId = null;

    // Transición: Portada -> Reglas
    btnShowRules.addEventListener('click', () => {
        introScreen.classList.add('hidden');
        rulesScreen.classList.remove('hidden');
    });

    // Transición: Reglas -> Selección de Historia
    btnToSelection.addEventListener('click', async () => {
        rulesScreen.classList.add('hidden');
        storySelectionScreen.classList.remove('hidden');
        await loadStories();
    });

    // Transición: Juego -> Selección de Historia (Volver al menú)
    btnBackToMenu.addEventListener('click', () => {
        gameContainer.classList.add('hidden');
        storySelectionScreen.classList.remove('hidden');
    });

    // Cargar historias disponibles
    async function loadStories() {
        try {
            const response = await fetch('/api/stories');
            const stories = await response.json();

            storiesList.innerHTML = '';

            if (stories.length === 0) {
                storiesList.innerHTML = '<div class="loading-spinner">No hay historias disponibles.</div>';
                return;
            }


            stories.forEach(story => {
                const card = document.createElement('div');
                card.className = 'story-card story-card-loading';
                card.onclick = () => selectStory(story.id);

                const encodedTheme = encodeURIComponent(`cinematic ${story.theme} dark atmospheric 8k highly detailed`);
                const imageUrl = `https://image.pollinations.ai/prompt/${encodedTheme}?width=600&height=400&nologo=true&seed=${story.id}`;

                // Precargar imagen de fondo
                const bgImage = new Image();
                bgImage.onload = () => {
                    card.style.backgroundImage = `url('${imageUrl}')`;
                    card.classList.remove('story-card-loading');
                };
                bgImage.src = imageUrl;

                card.innerHTML = `
                    <h3 class="story-title">${story.title}</h3>
                    <p class="story-desc">${story.description}</p>
                    <div class="story-theme">🎭 ${story.theme}</div>
                `;

                storiesList.appendChild(card);
            });
        } catch (e) {
            console.error('Error cargando historias:', e);
            storiesList.innerHTML = '<div class="loading-spinner">Error al cargar las historias.</div>';
        }
    }

    // Seleccionar historia e iniciar juego
    async function selectStory(storyId) {
        selectedStoryId = storyId;
        storySelectionScreen.classList.add('hidden');
        gameContainer.classList.remove('hidden');
        await startGame(storyId);
    }
});
