const fs = require('fs');
const https = require('https');
const path = require('path');

const dataPath = path.join(__dirname, 'data/content.json');
const imgDir = path.join(__dirname, '../frontend/img/posters');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

// High quality static poster URLs that we will download locally
const posterUrls = {
    201: "https://m.media-amazon.com/images/I/81ai6zx6eXL._AC_SY879_.jpg", // Avengers
    202: "https://m.media-amazon.com/images/I/912AErFSBHL._AC_SY879_.jpg", // Inception
    203: "https://m.media-amazon.com/images/I/A1JVqNMI7UL._AC_SY879_.jpg", // Interstellar
    204: "https://m.media-amazon.com/images/I/818hyvdVfvL._AC_SY879_.jpg", // The Dark Knight
    205: "https://m.media-amazon.com/images/I/71c2LvwNWDL._AC_SY879_.jpg", // Spider-Man
    206: "https://m.media-amazon.com/images/I/41kTVLeW1CL._AC_SY879_.jpg", // Avatar
    207: "https://m.media-amazon.com/images/I/815Z+H+xJYL._AC_SY879_.jpg", // Dune
    208: "https://m.media-amazon.com/images/I/81Z1mH7m2ZL._AC_SY879_.jpg", // Oppenheimer
    209: "https://m.media-amazon.com/images/I/71rJ-Oq8i-L._AC_SY879_.jpg", // Top Gun
    210: "https://m.media-amazon.com/images/I/81Vq6Z3xVcL._AC_SY879_.jpg"  // John Wick 4
};

async function downloadImage(url, filepath) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            if (res.statusCode === 200) {
                res.pipe(fs.createWriteStream(filepath))
                   .on('error', reject)
                   .once('close', () => resolve(filepath));
            } else {
                // Consume response data to free up memory
                res.resume();
                reject(new Error(`Request Failed With a Status Code: ${res.statusCode}`));
            }
        });
    });
}

async function run() {
    let changed = false;

    for (let movie of data.movies) {
        if (posterUrls[movie.id]) {
            const filename = `movie_${movie.id}.jpg`;
            const filepath = path.join(imgDir, filename);
            
            try {
                console.log(`Downloading ${movie.title}...`);
                await downloadImage(posterUrls[movie.id], filepath);
                
                // Update the JSON to point to the local file
                const newUrl = `./img/posters/${filename}`;
                if (movie.image !== newUrl) {
                    movie.image = newUrl;
                    changed = true;
                    console.log(`[SUCCESS] Patched ${movie.title} to local image.`);
                }
            } catch (e) {
                console.error(`[ERROR] Failed to download for ${movie.title}:`, e.message);
            }
        }
    }

    if (changed) {
        fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
        console.log("content.json updated with local paths!");
    } else {
        console.log("No changes made.");
    }
}

run();
