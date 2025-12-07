const express = require('express');
const router = express.Router();
const engine = require('../services/engine');

// Cargar al inicio
engine.loadGameData();

router.post('/start', (req, res) => {
    // Al llamar a start, reiniciamos la sesión interna
    engine.loadGameData();
    const data = engine.getIntro();
    res.json(data);
});

router.post('/action', (req, res) => {
    const { choiceIndex } = req.body; // Esperamos un índice numérico (0, 1, 2)
    const response = engine.processAction(choiceIndex);
    res.json(response);
});

module.exports = router;
