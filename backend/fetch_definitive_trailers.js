const fs = require('fs');
const ytSearch = require('yt-search');

const dataPath = 'c:/Users/syeda/OneDrive/Desktop/FIRST WEB IN ANTIGRAVITY/nexus-realm/backend/data/content.json';
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

async function findTrailer(title, category) {
    let query = `${title} official trailer IGN`;
    if (category === 'anime') query = `${title} trailer crunchyroll sub`;

    const r = await ytSearch(query);
    const videos = r.videos;
    
    // Fallback if no IGN/Crunchyroll
    if (videos.length === 0 && category !== 'games') {
        const fall = await ytSearch(`${title} trailer`);
        return fall.videos.length > 0 ? fall.videos[0].videoId : null;
    }
    
    return videos.length > 0 ? videos[0].videoId : null;
}

async function updateAll() {
    console.log("Fetching definitive un-restricted trailer IDs...");
    let updated = 0;
    
    for (let category of ['anime', 'movies', 'games']) {
        for (let item of data[category]) {
            try {
                const id = await findTrailer(item.title, category);
                if (id) {
                    const newUrl = `https://www.youtube.com/embed/${id}`;
                    if (item.videoUrl !== newUrl) {
                        console.log(`[${category}] ${item.title}: swapped to -> ${id}`);
                        item.videoUrl = newUrl;
                        updated++;
                    } else {
                        console.log(`[${category}] ${item.title}: ID ${id} is already in place.`);
                    }
                } else {
                    console.log(`[${category}] ${item.title}: Could not find video.`);
                }
            } catch (e) {
                console.error(`Error searching ${item.title}:`, e);
            }
        }
    }
    
    if (updated > 0) {
        fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
        console.log(`Updated ${updated} trailers definitively.`);
    } else {
        console.log("No new updates made.");
    }
}

updateAll();
