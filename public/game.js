const output = document.getElementById('game-output');
const choicesContainer = document.getElementById('choices-container');

async function startGame() {
    try {
        const response = await fetch('/api/start', { method: 'POST' });
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

    // 1.5 Mostrar Imagen Dinámica
    const imageContainer = document.getElementById('game-image-container');
    imageContainer.innerHTML = ''; // Limpiar anterior

    const encodedPrompt = encodeURIComponent(`cinematic shot, dark ominous sci-fi submarine atmosphere, underwater, 8k, highly detailed, ${data.texto_descriptivo.substring(0, 100)}`);
    // Random seed to ensure image changes but stays consistent per view if we wanted, 
    // but here random is fine or time based to avoid cache.
    const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=512&height=512&nologo=true&seed=${Math.random()}`;

    const img = document.createElement('img');
    img.id = 'game-image';
    img.src = imageUrl;
    img.alt = "Visualización de la escena";
    img.onerror = () => { img.style.display = 'none'; }; // Hide if fails
    imageContainer.appendChild(img);

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
window.onload = startGame;
