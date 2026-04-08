const fs = require('fs');
const https = require('https');

const dataPath = 'c:/Users/syeda/OneDrive/Desktop/FIRST WEB IN ANTIGRAVITY/nexus-realm/backend/data/content.json';
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

// A small helper to check if a YouTube video allows embedding
function checkEmbeddable(videoId) {
    return new Promise((resolve) => {
        https.get(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`, (res) => {
            if (res.statusCode === 200) {
                resolve(true);
            } else {
                resolve(false);
            }
        }).on('error', () => resolve(false));
    });
}

function extractId(url) {
    if (!url) return null;
    return url.split('embed/')[1]?.split('?')[0];
}

async function verifyAll() {
    console.log("Checking embed status for all current IDs...");
    
    let allGood = true;

    for (let category of ['anime', 'movies', 'games']) {
        for (let item of data[category]) {
            let currentId = extractId(item.videoUrl);
            let isEmbeddable = false;
            
            if (currentId) {
                isEmbeddable = await checkEmbeddable(currentId);
            }
            
            if (!isEmbeddable) {
                console.log(`[${item.id}] ${item.title}: ID ${currentId} fails OEmbed check or is missing.`);
                allGood = false;
            } else {
                console.log(`[${item.id}] ${item.title}: ID ${currentId} OK`);
            }
        }
    }
    
    if (allGood) {
        console.log("All current IDs are embeddable.");
    }
}

verifyAll();
