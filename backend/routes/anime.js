const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs').promises;
const DATA_PATH = path.join(__dirname, '../data/content.json');

router.get('/', async (req, res) => {
    try {
        const data = JSON.parse(await fs.readFile(DATA_PATH, 'utf8'));
        res.json(data.anime);
    } catch (err) {
        res.status(500).json({ message: 'Error reading news' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const data = JSON.parse(await fs.readFile(DATA_PATH, 'utf8'));
        const anime = data.anime.find(a => a.id === parseInt(req.params.id));
        if (anime) {
            res.json(anime);
        } else {
            res.status(404).json({ message: 'Anime not found' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Error reading media' });
    }
});

module.exports = router;
