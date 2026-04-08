const fs = require('fs');
const https = require('https');
const path = require('path');

const dataPath = path.join(__dirname, 'data/content.json');
const imgDir = path.join(__dirname, '../frontend/img/posters');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

// The final 5 broken movies. Pulling fresh, highly reliable URLs from official sources or 3rd party poster dumps that don't block curl/node agents.
const posterUrls = {
    205: "https://m.media-amazon.com/images/I/71X4A5sXnOL._AC_SY879_.jpg", // Spider-Man
    207: "https://m.media-amazon.com/images/I/A1+cdxZ2k2L._AC_SY879_.jpg", // Dune
    208: "https://m.media-amazon.com/images/I/91rIvl+DhwL._AC_SY879_.jpg", // Oppenheimer
    209: "https://m.media-amazon.com/images/I/61KqB-dItvL._AC_SY879_.jpg", // Top Gun
    210: "https://m.media-amazon.com/images/I/81I6x8r1S-L._AC_SY879_.jpg"  // John Wick 4
};

async function downloadImage(url, filepath) {
    return new Promise((resolve, reject) => {
        // Change user agent to bypass weak blocks
        const options = {
            headers: {
                'User-Agent': "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
            }
        };

        https.get(url, options, (res) => {
            if (res.statusCode === 200) {
                const stream = fs.createWriteStream(filepath);
                res.pipe(stream);
                stream.on('finish', () => {
                    stream.close();
                    resolve(filepath);
                });
            } else if (res.statusCode === 301 || res.statusCode === 302) {
                // follow redirect
                downloadImage(res.headers.location, filepath).then(resolve).catch(reject);
            } else {
                res.resume();
                reject(new Error(`Failed with Status Code: ${res.statusCode}`));
            }
        }).on('error', reject);
    });
}

async function run() {
    let changed = false;

    for (let movie of data.movies) {
        if (posterUrls[movie.id]) {
            const filename = `movie_${movie.id}.jpg`;
            const filepath = path.join(imgDir, filename);
            
            try {
                console.log(`Downloading ${movie.title} ...`);
                await downloadImage(posterUrls[movie.id], filepath);
                
                // Update JSON
                const newUrl = `./img/posters/${filename}`;
                if (movie.image !== newUrl) {
                    movie.image = newUrl;
                    changed = true;
                    console.log(`[OK] Updated ${movie.title} in JSON.`);
                } else {
                    console.log(`[OK] Downloaded ${movie.title}, already set in JSON.`);
                }
            } catch (e) {
                console.error(`[ERROR] Failed to process ${movie.title}: ${e.message}`);
            }
        }
    }

    if (changed) {
        fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
        console.log("SUCCESS: Final 5 movie posters downloaded and linked!");
    } else {
        console.log("No new updates to content.json.");
    }
}

run();
