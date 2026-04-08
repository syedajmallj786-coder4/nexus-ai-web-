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

const alternateIds = {
    // Anime
    101: "VQGCKyvncz4", // Demon Slayer
    102: "MGRm4IzK1SQ", // AOT
    103: "MCb13lbVGE0", // One Piece
    104: "O6qVQXMZXJI", // JJK
    105: "-G9BqkgZXBE", // Naruto
    106: "hJ81qL2Qy1Y", // DBZ
    107: "NlJZ-YgAt-c", // Death Note
    108: "vGuQeQ5VgZA", // Tokyo Ghoul
    109: "iTWgA1WJgKE", // Bleach
    110: "6ohYX4GMI7g", // SAO
    // Movies
    201: "ee1172yeqyE", // Avengers Endgame (IGN or similar upload)
    202: "8hP9D6kZseM", // Inception
    203: "2LqzF5WauAw", // Interstellar
    204: "EXeTwQWrcwY", // Dark Knight
    205: "JfVOs4VSpmA", // Spider-Man NWH
    206: "5PSNL1qE6VY", // Avatar
    207: "n9xhKvMDcgI", // Dune
    208: "uYPbbksJxIg", // Oppenheimer
    209: "giXco2jaZ_4", // Top Gun
    210: "qEVUtrk8_B4",  // John Wick 4
    // Games
    301: "E3Huy2cdih0", // Elden Ring
    302: "hzj2dZpOhW8", // GOW
    303: "8X2kIfS6fb8", // CP2077
    304: "QdBZY2fkU-0", // GTA 6
    305: "qPNiIeKMHkQ", // TLOU2
    306: "MmB9b5njVbA", // Minecraft
    307: "e_E9W2vsRbQ", // Valorant
    308: "pBRKwJpKLAw", // FIFA 25
    309: "mHDEDDrGYig", // COD
    310: "2gUtfBtcDQA"  // Fortnite
};

async function verifyAll() {
    let changed = false;

    for (let category of ['anime', 'movies', 'games']) {
        for (let item of data[category]) {
            let currentId = extractId(item.videoUrl);
            let isEmbeddable = false;
            
            if (currentId) {
                isEmbeddable = await checkEmbeddable(currentId);
            }
            
            if (!isEmbeddable) {
                console.log(`[${item.id}] ${item.title}: ID ${currentId} fails OEmbed check or is missing.`);
                
                let altId = alternateIds[item.id];
                if (altId && altId !== currentId) {
                    console.log(`Testing alternative: ${altId}`);
                    let altOk = await checkEmbeddable(altId);
                    if (altOk) {
                        item.videoUrl = `https://www.youtube.com/embed/${altId}`;
                        console.log(`Swapped ${item.title} to alternate ID: ${altId}`);
                        changed = true;
                    } else {
                        console.log(`Alternate ID ${altId} also fails.`);
                    }
                }
            } else {
                console.log(`[${item.id}] ${item.title}: ID ${currentId} OK`);
            }
        }
    }
    
    if (changed) {
        fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
        console.log("Updated content.json with working embed IDs.");
    } else {
        console.log("No changes needed.");
    }
}

verifyAll();
