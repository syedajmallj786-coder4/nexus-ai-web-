const fs = require('fs');
const https = require('https');
const path = require('path');

const dataPath = path.join(__dirname, 'data/content.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

const animeDir = path.join(__dirname, '../frontend/img/anime');
const gamesDir = path.join(__dirname, '../frontend/img/games');

if (!fs.existsSync(animeDir)) fs.mkdirSync(animeDir, { recursive: true });
if (!fs.existsSync(gamesDir)) fs.mkdirSync(gamesDir, { recursive: true });

const animeImages = {
    101: "https://cdn.myanimelist.net/images/anime/1286/99889.jpg",
    102: "https://cdn.myanimelist.net/images/anime/10/47347.jpg",
    103: "https://cdn.myanimelist.net/images/anime/6/73245.jpg",
    104: "https://cdn.myanimelist.net/images/anime/1171/109222.jpg",
    105: "https://cdn.myanimelist.net/images/anime/13/17405.jpg",
    106: "https://cdn.myanimelist.net/images/anime/1607/117271.jpg",
    107: "https://cdn.myanimelist.net/images/anime/9/86828.jpg",
    108: "https://cdn.myanimelist.net/images/anime/1498/134443.jpg",
    109: "https://cdn.myanimelist.net/images/anime/3/40451.jpg",
    110: "https://cdn.myanimelist.net/images/anime/11/39717.jpg"
};

const gameImages = {
    301: "https://images.igdb.com/igdb/image/upload/t_cover_big/co498s.jpg",
    302: "LOCAL_GENERATED", 
    303: "https://images.igdb.com/igdb/image/upload/t_cover_big/co2961.jpg",
    304: "https://images.igdb.com/igdb/image/upload/t_cover_big/co7vax.jpg",
    305: "https://images.igdb.com/igdb/image/upload/t_cover_big/co20of.jpg",
    306: "https://images.igdb.com/igdb/image/upload/t_cover_big/co2lbd.jpg",
    307: "https://images.igdb.com/igdb/image/upload/t_cover_big/co2mdf.jpg",
    308: "https://images.igdb.com/igdb/image/upload/t_cover_big/co8p1z.jpg",
    309: "https://images.igdb.com/igdb/image/upload/t_cover_big/co6tms.jpg",
    310: "https://images.igdb.com/igdb/image/upload/t_cover_big/co2lb7.jpg"
};

async function downloadImage(url, filepath) {
    return new Promise((resolve, reject) => {
        https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
            if (res.statusCode === 200) {
                const stream = fs.createWriteStream(filepath);
                res.pipe(stream);
                stream.on('finish', () => {
                    stream.close();
                    resolve();
                });
            } else if (res.statusCode === 301 || res.statusCode === 302) {
                downloadImage(res.headers.location, filepath).then(resolve).catch(reject);
            } else {
                res.resume();
                reject(new Error(`Status ${res.statusCode}`));
            }
        }).on('error', reject);
    });
}

async function run() {
    let changed = false;

    // Anime
    for (const anime of data.anime) {
        if (animeImages[anime.id]) {
            const filename = `anime_${anime.id}.jpg`;
            const filepath = path.join(__dirname, '../frontend/img/anime', filename);
            try {
                process.stdout.write(`Downloading Anime ${anime.title}... `);
                await downloadImage(animeImages[anime.id], filepath);
                console.log("Success!");
                anime.image = `./img/anime/${filename}`;
                changed = true;
            } catch (e) {
                console.log(`Failed: ${e.message}`);
            }
        }
    }

    // Games
    for (const game of data.games) {
        if (gameImages[game.id]) {
            const ext = gameImages[game.id].split('.').pop().split('?')[0];
            const filename = `game_${game.id}.${ext === 'png' ? 'png' : 'jpg'}`;
            const filepath = path.join(__dirname, '../frontend/img/games', filename);
            try {
                process.stdout.write(`Downloading Game ${game.title}... `);
                await downloadImage(gameImages[game.id], filepath);
                console.log("Success!");
                game.image = `./img/games/${filename}`;
                changed = true;
            } catch (e) {
                console.log(`Failed: ${e.message}`);
            }
        }
    }

    if (changed) {
        fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
        console.log("Updated content.json with local image paths.");
    }
}

run();
