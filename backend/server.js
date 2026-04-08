const express = require('express');
const cors = require('cors');
const animeRoutes = require('./routes/anime');
const moviesRoutes = require('./routes/movies');
const gamesRoutes = require('./routes/games');
const path = require('path');
const fs = require('fs').promises;

const DATA_PATH = path.join(__dirname, 'data', 'content.json');

// Helper to get fresh data
async function getContentData() {
    try {
        const data = await fs.readFile(DATA_PATH, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error('Error reading content data:', err);
        return { anime: [], movies: [], games: [] };
    }
}

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Serve static frontend files
app.use(express.static(path.join(__dirname, '../frontend')));

// Routes
app.use('/api/anime', animeRoutes);
app.use('/api/movies', moviesRoutes);
app.use('/api/games', gamesRoutes);

// Global Search Route
app.get('/api/search', async (req, res) => {
    const query = req.query.q?.toLowerCase() || '';
    if (!query) {
        return res.json([]);
    }
    
    const contentData = await getContentData();
    const results = [
        ...contentData.anime,
        ...contentData.movies,
        ...contentData.games
    ].filter(item => 
        item.title.toLowerCase().includes(query) || 
        item.genre.some(g => g.toLowerCase().includes(query))
    );
    
    res.json(results);
});

// Featured Route
app.get('/api/featured', async (req, res) => {
    const contentData = await getContentData();
    const featured = {
        anime: contentData.anime.filter(item => item.featured),
        movies: contentData.movies.filter(item => item.featured),
        games: contentData.games.filter(item => item.featured)
    };
    res.json(featured);
});

app.listen(PORT, () => {
    console.log(`NEXUS REALM Server running on port ${PORT}`);
});
