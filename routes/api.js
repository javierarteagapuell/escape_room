const express = require('express');
const router = express.Router();
const engine = require('../services/engine');

// Cargar al inicio (default)
engine.loadGameData();

router.get('/stories', (req, res) => {
    const stories = engine.getStories();
    res.json(stories);
});

router.post('/start', (req, res) => {
    const { storyId } = req.body;
    // Al llamar a start, reiniciamos la sesión interna con la historia elegida
    engine.loadGameData(storyId);
    const data = engine.getIntro();
    res.json(data);
});

router.post('/action', (req, res) => {
    const { choiceIndex } = req.body; // Esperamos un índice numérico (0, 1, 2)
    const response = engine.processAction(choiceIndex);
    res.json(response);
});

module.exports = router;
