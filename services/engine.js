const fs = require('fs');
const path = require('path');

let storyData = {};
let currentSession = {
    currentNodeId: null
};

const dataDir = path.join(__dirname, '../data');

function loadGameData() {
    try {
        storyData = JSON.parse(fs.readFileSync(path.join(dataDir, 'story.json'), 'utf8'));
        resetGame();
        console.log("Datos de la historia cargados.");
        return true;
    } catch (err) {
        console.error("Error cargando story.json:", err);
        return false;
    }
}

function resetGame() {
    currentSession.currentNodeId = storyData.start_node;
}

function getIntro() {
    return getNodeData(currentSession.currentNodeId);
}

function processAction(choiceIndex) {
    const currentNode = storyData.nodes[currentSession.currentNodeId];

    // Validar nodo actual
    if (!currentNode) return { error: "Nodo inválido" };

    // Validar si es final
    if (currentNode.type === 'ending') {
        return getNodeData(currentSession.currentNodeId); // Ya terminó
    }

    // Validar índice de opción
    if (choiceIndex < 0 || choiceIndex >= currentNode.choices.length) {
        return { error: "Opción inválida" };
    }

    // Avanzar al siguiente nodo
    const nextNodeId = currentNode.choices[choiceIndex].next;
    currentSession.currentNodeId = nextNodeId;

    return getNodeData(nextNodeId);
}

// Helper para formatear respuesta
function getNodeData(nodeId) {
    const node = storyData.nodes[nodeId];
    if (!node) return { texto_descriptivo: "Error fatal: Nodo de historia no encontrado." };

    const response = {
        texto_descriptivo: node.text,
        resultado: node.result || "neutral",
        es_final: node.type === 'ending',
        acciones_sugeridas: [] // Ahora son opciones estrictas
    };

    if (node.choices) {
        // Mapear solo los textos de las opciones
        response.opciones = node.choices.map(c => c.text);
    } else {
        response.opciones = []; // Sin opciones si es final
    }

    return response;
}

module.exports = { loadGameData, processAction, getIntro };
