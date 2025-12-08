const fs = require('fs');
const path = require('path');

let storyData = {};
let currentSession = {
    currentNodeId: null
};

const storiesDir = path.join(__dirname, '../data/stories');

function getStories() {
    try {
        if (!fs.existsSync(storiesDir)) {
            console.error("Directorio de historias no encontrado: " + storiesDir);
            return [];
        }
        const files = fs.readdirSync(storiesDir).filter(file => file.endsWith('.json'));
        const stories = files.map(file => {
            try {
                const content = JSON.parse(fs.readFileSync(path.join(storiesDir, file), 'utf8'));
                // Usa el ID del archivo si no hay ID en el JSON, o el nombre del archivo
                const id = content.id || file.replace('.json', '');
                return {
                    id: id,
                    title: content.title || "Historia Sin Título",
                    description: content.description || "Sin descripción disponible.",
                    theme: content.theme || "generic"
                };
            } catch (e) {
                console.error(`Error leyendo ${file}:`, e);
                return null;
            }
        }).filter(s => s !== null);
        return stories;
    } catch (err) {
        console.error("Error leyendo directorio de historias:", err);
        return [];
    }
}

function loadGameData(storyId) {
    try {
        // Encontrar el archivo basado en el ID
        const files = fs.readdirSync(storiesDir).filter(file => file.endsWith('.json'));
        let targetFile = null;

        if (storyId) {
            // Buscar por ID dentro del JSON o nombre de archivo
            targetFile = files.find(file => {
                const content = JSON.parse(fs.readFileSync(path.join(storiesDir, file), 'utf8'));
                return content.id === storyId || file.replace('.json', '') === storyId;
            });
        }

        // Fallback: Cargar el primero si no se especifica o no se encuentra
        if (!targetFile) {
            targetFile = files.find(f => f === 'deep_sea.json') || files[0];
        }

        if (!targetFile) throw new Error("No se encontraron historias.");

        storyData = JSON.parse(fs.readFileSync(path.join(storiesDir, targetFile), 'utf8'));
        resetGame();
        console.log(`Historia cargada: ${storyData.title} (${storyData.id})`);
        return true;
    } catch (err) {
        console.error("Error cargando historia:", err);
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
    if (!storyData.nodes) return { error: "No hay historia cargada" };

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
        acciones_sugeridas: [],
        story_title: storyData.title || "Historia Desconocida"
    };

    if (node.choices) {
        // Mapear solo los textos de las opciones
        response.opciones = node.choices.map(c => c.text);
    } else {
        response.opciones = []; // Sin opciones si es final
    }

    return response;
}

module.exports = { loadGameData, processAction, getIntro, getStories };
