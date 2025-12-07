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
