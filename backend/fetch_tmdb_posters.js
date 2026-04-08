const fs = require('fs');
const https = require('https');
const path = require('path');

const dataPath = path.join(__dirname, 'data/content.json');
const imgDir = path.join(__dirname, '../frontend/img/posters');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

// TMDB allows server-side fetches but blocks direct browser <img> tags. Let's pull from them using Node.
const posterUrls = {
    205: "https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1R80vC08p2l7s.jpg", // Spider-Man No Way Home
    207: "https://image.tmdb.org/t/p/w500/d5NXSklXo0qyIYkgV94XAgMIck1.jpg", // Dune
    208: "https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg", // Oppenheimer
    209: "https://image.tmdb.org/t/p/w500/62HCnUTziyWcpZ1pwwzO1gDqwA8.jpg", // Top Gun Maverick
    210: "https://image.tmdb.org/t/p/w500/vZloFAK7NmvMGKE7VkF5UqZIG1v.jpg"  // John Wick 4
};

async function downloadImage(url, filepath) {
    return new Promise((resolve, reject) => {
        const options = {
            headers: { 'User-Agent': "Node.js Downloader" }
        };
        https.get(url, options, (res) => {
            if (res.statusCode === 200) {
                const stream = fs.createWriteStream(filepath);
                res.pipe(stream);
                stream.on('finish', () => resolve(filepath));
            } else {
                res.resume();
                reject(new Error(`Failed with Status ${res.statusCode}`));
            }
        }).on('error', reject);
    });
}

async function run() {
    let changed = false;

    // Filter to just the 5 failing movies
    for (let movie of data.movies) {
        if (posterUrls[movie.id]) {
            const filename = `movie_${movie.id}.jpg`;
            const filepath = path.join(imgDir, filename);
            
            try {
                process.stdout.write(`Downloading ${movie.title}... `);
                await downloadImage(posterUrls[movie.id], filepath);
                console.log("SUCCESS!");
                
                const newUrl = `./img/posters/${filename}`;
                if (movie.image !== newUrl) {
                    movie.image = newUrl;
                    changed = true;
                }
            } catch (e) {
                console.log(`ERROR: ${e.message}`);
            }
        }
    }

    if (changed) {
        fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
        console.log("Final 5 local poster URLs written to content.json!");
    } else {
        console.log("Files downloaded, but content.json paths were already correct.");
    }
}

run();
