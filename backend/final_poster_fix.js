const fs = require('fs');
const https = require('https');
const path = require('path');

const dataPath = 'c:/Users/syeda/OneDrive/Desktop/FIRST WEB IN ANTIGRAVITY/nexus-realm/backend/data/content.json';
const imgDir = 'c:/Users/syeda/OneDrive/Desktop/FIRST WEB IN ANTIGRAVITY/nexus-realm/frontend/img/posters';

const postersToFetch = {
    205: "https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1R80vC08p2l7s.jpg", // Spider-Man No Way Home
    207: "https://image.tmdb.org/t/p/w500/d5NXSklXo0qyIYkgV94XAgMIck1.jpg", // Dune
    209: "https://image.tmdb.org/t/p/w500/62HCnUTziyWcpZ1pwwzO1gDqwA8.jpg", // Top Gun Maverick
    210: "https://image.tmdb.org/t/p/w500/vZloFAK7NmvMGKE7VkF5UqZIG1v.jpg"  // John Wick 4
};

async function downloadImage(url, filename) {
    return new Promise((resolve, reject) => {
        const filepath = path.join(imgDir, filename);
        const options = {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        };

        https.get(url, options, (res) => {
            if (res.statusCode === 200) {
                const stream = fs.createWriteStream(filepath);
                res.pipe(stream);
                stream.on('finish', () => {
                    stream.close();
                    resolve();
                });
            } else if (res.statusCode === 301 || res.statusCode === 302) {
                // Follow redirect
                downloadImage(res.headers.location, filename).then(resolve).catch(reject);
            } else {
                res.resume();
                reject(new Error(`Status Code: ${res.statusCode}`));
            }
        }).on('error', reject);
    });
}

async function fix() {
    console.log("Starting final image fetch...");
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    let changed = false;

    for (const [idStr, url] of Object.entries(postersToFetch)) {
        const id = parseInt(idStr);
        const filename = `movie_${id}.jpg`;
        try {
            process.stdout.write(`Downloading ${filename}... `);
            await downloadImage(url, filename);
            console.log("Success!");

            // Update JSON
            const movie = data.movies.find(m => m.id === id);
            if (movie) {
                const localPath = `./img/posters/${filename}`;
                if (movie.image !== localPath) {
                    movie.image = localPath;
                    changed = true;
                }
            }
        } catch (e) {
            console.log(`Failed: ${e.message}`);
        }
    }

    // Double check all movies point to local posters if they exist
    for (let movie of data.movies) {
        const localFile = `movie_${movie.id}.jpg`;
        if (fs.existsSync(path.join(imgDir, localFile))) {
            const localPath = `./img/posters/${localFile}`;
            if (movie.image !== localPath) {
                movie.image = localPath;
                changed = true;
                console.log(`Linked ${movie.title} to existing local poster.`);
            }
        }
    }

    if (changed) {
        fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
        console.log("Updated content.json with correct local paths.");
    } else {
        console.log("All paths were already set correctly.");
    }
}

fix();
