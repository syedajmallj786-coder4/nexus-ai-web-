const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs').promises;
const DATA_PATH = path.join(__dirname, '../data/content.json');

router.get('/', async (req, res) => {
    try {
        const data = JSON.parse(await fs.readFile(DATA_PATH, 'utf8'));
        res.json(data.games);
    } catch (err) {
        res.status(500).json({ message: 'Error reading library' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const data = JSON.parse(await fs.readFile(DATA_PATH, 'utf8'));
        const game = data.games.find(g => g.id === parseInt(req.params.id));
        if (game) {
            res.json(game);
        } else {
            res.status(404).json({ message: 'Game not found' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Error reading title' });
    }
});

module.exports = router;
