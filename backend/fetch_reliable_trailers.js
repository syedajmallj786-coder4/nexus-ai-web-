const fs = require('fs');
const https = require('https');

function searchYouTube(query) {
    return new Promise((resolve, reject) => {
        const url = `https://pipedapi.kavin.rocks/search?q=${encodeURIComponent(query)}&filter=videos`;
        https.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(data);
                    if (parsed && parsed.items && parsed.items.length > 0) {
                        // Find a video from a reliable channel or just the first video
                        const video = parsed.items.find(item => item.uploaderName && (item.uploaderName.includes('IGN') || item.uploaderName.includes('GameSpot') || item.uploaderName.includes('Rotten Tomatoes') || item.uploaderName.includes('KinoCheck') || item.uploaderName.includes('Crunchyroll'))) || parsed.items[0];
                        resolve(video.url.split('?v=')[1]);
                    } else {
                        resolve(null);
                    }
                } catch (e) {
                    resolve(null); // Silent fail
                }
            });
        }).on('error', () => resolve(null));
    });
}

const dataPath = 'c:/Users/syeda/OneDrive/Desktop/FIRST WEB IN ANTIGRAVITY/nexus-realm/backend/data/content.json';
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

async function fixAll() {
    let changed = false;
    console.log("Starting reliable embed search...");
    for (let category of ['anime', 'movies', 'games']) {
        for (let item of data[category]) {
            let query = `${item.title} trailer IGN`;
            if (category === 'anime') query = `${item.title} trailer Crunchyroll`;
            if (category === 'movies') query = `${item.title} trailer Rotten Tomatoes`;
            
            console.log(`Searching for: ${query}`);
            let id = await searchYouTube(query);
            
            if (!id && category !== 'games') {
                // fallback search
                id = await searchYouTube(`${item.title} trailer IGN`);
            }
            
            if (!id) {
                id = await searchYouTube(`${item.title} trailer official`);
            }

            if (id) {
                const newUrl = `https://www.youtube.com/embed/${id}`;
                if (item.videoUrl !== newUrl) {
                    item.videoUrl = newUrl;
                    changed = true;
                    console.log(`[SUCCESS] ${item.title} -> ${id}`);
                } else {
                    console.log(`[OK] ${item.title} already has this ID.`);
                }
            } else {
                console.log(`[FAILED] Could not find a reliable trailer for ${item.title}`);
            }
            // Add a small delay
            await new Promise(r => setTimeout(r, 1000));
        }
    }

    if (changed) {
        fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
        console.log("All IDs updated successfully in content.json!");
    } else {
        console.log("No changes necessary.");
    }
}

fixAll();
