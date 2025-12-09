const fs = require('fs');
const path = require('path');
const https = require('https');

const storiesDir = path.join(__dirname, '../data/stories');
const imagesDir = path.join(__dirname, '../public/images');

// Asegurar directorio de imágenes
if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
}

async function downloadImage(url, filepath, attempt = 1) {
    return new Promise((resolve, reject) => {
        const request = https.get(url, (response) => {
            if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
                // Handle redirect
                return downloadImage(response.headers.location, filepath, attempt).then(resolve).catch(reject);
            }

            if (response.statusCode !== 200) {
                if (attempt <= 3) {
                    console.log(`     -> Error ${response.statusCode}. Retrying (${attempt}/3)...`);
                    setTimeout(() => {
                        downloadImage(url, filepath, attempt + 1).then(resolve).catch(reject);
                    }, 2000 * attempt);
                    return;
                }
                return reject(new Error(`Status code ${response.statusCode}`));
            }

            const file = fs.createWriteStream(filepath);
            response.pipe(file);
            file.on('finish', () => {
                file.close();
                // Check correct size (min 1KB)
                try {
                    const stats = fs.statSync(filepath);
                    if (stats.size < 1000) {
                        fs.unlinkSync(filepath);
                        if (attempt <= 3) {
                            console.log(`     -> File too small (${stats.size}b). Retrying (${attempt}/3)...`);
                            setTimeout(() => {
                                downloadImage(url, filepath, attempt + 1).then(resolve).catch(reject);
                            }, 2000 * attempt);
                        } else {
                            reject(new Error("File too small after retries"));
                        }
                    } else {
                        resolve();
                    }
                } catch (e) {
                    reject(e);
                }
            });
        });

        request.on('error', (err) => {
            if (attempt <= 3) {
                console.log(`     -> Network error. Retrying (${attempt}/3)...`);
                setTimeout(() => {
                    downloadImage(url, filepath, attempt + 1).then(resolve).catch(reject);
                }, 2000 * attempt);
            } else {
                fs.unlink(filepath, () => { });
                reject(err);
            }
        });
    });
}

function getStories() {
    try {
        return fs.readdirSync(storiesDir)
            .filter(file => file.endsWith('.json'))
            .map(file => {
                const content = JSON.parse(fs.readFileSync(path.join(storiesDir, file), 'utf8'));
                return {
                    id: content.id || file.replace('.json', ''),
                    theme: content.theme || "generic",
                    nodes: content.nodes // Objeto con todos los nodos
                };
            });
    } catch (e) {
        console.error("Error leyendo historias:", e);
        return [];
    }
}

async function generateImages() {
    const stories = getStories();
    console.log(`Encontradas ${stories.length} historias.`);

    for (const story of stories) {
        console.log(`\nProcesando historia: ${story.id}`);
        const storyImagesDir = path.join(imagesDir, story.id);

        if (!fs.existsSync(storyImagesDir)) {
            fs.mkdirSync(storyImagesDir, { recursive: true });
        }

        // Generar imagen para cada nodo
        for (const [nodeId, node] of Object.entries(story.nodes)) {
            const imagePath = path.join(storyImagesDir, `${nodeId}.jpg`);

            // Si ya existe, verificar tamaño
            if (fs.existsSync(imagePath)) {
                try {
                    const stats = fs.statSync(imagePath);
                    if (stats.size > 1000) {
                        console.log(`  [SKIP] Bajada válida para nodo: ${nodeId}`);
                        continue;
                    }
                    console.log(`  [RETRY] Imagen corrupta o pequeña para nodo: ${nodeId}`);
                } catch (e) {
                    console.log(`  [RETRY] Error leyendo stats para nodo: ${nodeId}`);
                }
            }

            console.log(`  [GENERATE] Generando imagen para nodo: ${nodeId}...`);

            // Construir prompt igual que el frontend
            const storyTheme = story.theme;
            const sceneDescription = node.text.substring(0, 150);
            const encodedPrompt = encodeURIComponent(`cinematic shot, ${storyTheme}, 8k, highly detailed, ${sceneDescription}`);
            const seed = Math.floor(Math.random() * 1000000); // Semilla fija para consistencia si se quisiera, o random
            const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=512&height=512&nologo=true&seed=${seed}`;

            try {
                await downloadImage(imageUrl, imagePath);
                console.log(`     -> Guardada en ${imagePath}`);
                // Pequeña pausa para no saturar API
                await new Promise(r => setTimeout(r, 1000));
            } catch (err) {
                console.error(`     -> ERROR descargando imagen: ${err.message}`);
            }
        }
    }
    console.log("\nGeneración completa.");
}

generateImages();
