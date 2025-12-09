const output = document.getElementById('game-output');
const choicesContainer = document.getElementById('choices-container');

// Variable global para recordar la historia actual
let currentStoryId = null;

async function startGame(storyId) {
    try {
        // Guardar el ID de la historia actual
        currentStoryId = storyId;

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

    // Añadir texto de la historia
    let storyText = data.texto_descriptivo.replace(/\n/g, '<br>');

    // Si no es final, añadir pregunta
    if (!data.es_final && data.opciones && data.opciones.length > 0) {
        storyText += '<br><strong class="decision-prompt">¿Qué decisión tomas?</strong>';
    }

    textBlock.innerHTML = storyText;
    output.innerHTML = ''; // Limpiar anterior para esta versión (o podríamos acumular)
    // Para CYOA, a veces es mejor limpiar o dejar historial. Vamos a limpiar para estilo "pantalla de escena".
    output.appendChild(textBlock);
    output.scrollTop = 0; // Force scroll to top for new text

    // 1.5 Mostrar Imagen
    const imageContainer = document.getElementById('game-image-container');
    imageContainer.innerHTML = ''; // Limpiar anterior

    // Crear placeholder
    const placeholder = document.createElement('div');
    placeholder.className = 'image-placeholder';
    placeholder.innerHTML = '<div class="loading-spinner-img">⏳ Cargando escena...</div>';
    imageContainer.appendChild(placeholder);

    const img = document.createElement('img');
    img.id = 'game-image';
    img.alt = "Visualización de la escena";
    img.style.opacity = '0'; // Empieza invisible

    // Lógica de carga con fallback
    const localImageUrl = `/images/${currentStoryId}/${data.id}.jpg`;

    // Generación dinámica (fallback)
    const storyTheme = data.story_theme || 'dark atmospheric';
    const sceneDescription = data.texto_descriptivo.substring(0, 150);
    const encodedPrompt = encodeURIComponent(`cinematic shot, ${storyTheme}, 8k, highly detailed, ${sceneDescription}`);
    // Usamos seed basado en nodeId para que si se regenera sea consistente, o random si se prefiere variedad
    // Para consistencia con lo 'pre-generado', usaría el nodeId como seed, pero Math.random añade variedad.
    // Usemos Math.random() para el fallback dinámico para mantener comportamiento original.
    const dynamicImageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=512&height=512&nologo=true&seed=${Math.random()}`;

    // Intentar cargar local primero
    img.src = localImageUrl;

    img.onload = () => {
        // Éxito cargando (ya sea local o dinámica)
        placeholder.remove();
        imageContainer.appendChild(img);
        setTimeout(() => { img.style.opacity = '1'; }, 10);
    };

    img.onerror = () => {
        // Si falla la local, intentar la dinámica
        if (img.src.includes(localImageUrl)) {
            console.log("Imagen local no encontrada, generando dinámicamente...");
            img.src = dynamicImageUrl;
        } else {
            // Si falla también la dinámica
            placeholder.innerHTML = '❌ Error cargando imagen';
        }
    };

    // 2. Generar Botones
    choicesContainer.innerHTML = '';

    if (data.es_final) {
        const btn = document.createElement('button');
        btn.className = 'choice-btn';
        btn.textContent = "Reiniciar Misión";
        btn.onclick = () => startGame(currentStoryId); // Reiniciar la misma historia
        choicesContainer.appendChild(btn);
    } else {
        data.opciones.forEach((texto, index) => {
            const btn = document.createElement('button');
            btn.className = 'choice-btn';
            btn.textContent = texto; // Sin número
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

                // Determine difficulty level for styling
                const difficulty = story.difficulty; // No default value
                let diffClass = '';
                if (difficulty) {
                    if (difficulty.toUpperCase() === 'MORTAL') diffClass = 'difficulty-mortal';
                    else if (difficulty.toUpperCase() === 'DIFÍCIL' || difficulty.toUpperCase() === 'DIFICIL') diffClass = 'difficulty-hard';
                    else if (difficulty.toUpperCase() === 'NORMAL') diffClass = 'difficulty-normal';
                }

                // Add difficulty class to card only if it exists
                if (diffClass) {
                    card.classList.add(diffClass);
                }

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
