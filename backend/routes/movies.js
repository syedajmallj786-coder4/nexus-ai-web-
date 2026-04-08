const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs').promises;
const DATA_PATH = path.join(__dirname, '../data/content.json');

router.get('/', async (req, res) => {
    try {
        const data = JSON.parse(await fs.readFile(DATA_PATH, 'utf8'));
        res.json(data.movies);
    } catch (err) {
        res.status(500).json({ message: 'Error reading stream' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const data = JSON.parse(await fs.readFile(DATA_PATH, 'utf8'));
        const movie = data.movies.find(m => m.id === parseInt(req.params.id));
        if (movie) {
            res.json(movie);
        } else {
            res.status(404).json({ message: 'Movie not found' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Error reading cinematic' });
    }
});

module.exports = router;
