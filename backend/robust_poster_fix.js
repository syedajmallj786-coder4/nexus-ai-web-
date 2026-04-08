const fs = require('fs');
const https = require('https');
const path = require('path');

const dataPath = 'c:/Users/syeda/OneDrive/Desktop/FIRST WEB IN ANTIGRAVITY/nexus-realm/backend/data/content.json';
const imgDir = 'c:/Users/syeda/OneDrive/Desktop/FIRST WEB IN ANTIGRAVITY/nexus-realm/frontend/img/posters';

const posters = [
    {
        id: 205,
        title: "Spider-Man No Way Home",
        urls: [
            "https://upload.wikimedia.org/wikipedia/en/0/00/Spider-Man_No_Way_Home_poster.jpg",
            "https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1R80vC08p2l7s.jpg"
        ]
    },
    {
        id: 207,
        title: "Dune",
        urls: [
            "https://upload.wikimedia.org/wikipedia/en/8/8e/Dune_%282021_film%29_poster.jpg",
            "https://image.tmdb.org/t/p/w500/d5NXSklXo0qyIYkgV94XAgMIck1.jpg"
        ]
    },
    {
        id: 209,
        title: "Top Gun Maverick",
        urls: [
            "https://upload.wikimedia.org/wikipedia/en/7/71/Top_Gun_Maverick_poster.jpg",
            "https://image.tmdb.org/t/p/w500/62HCnUTziyWcpZ1pwwzO1gDqwA8.jpg"
        ]
    },
    {
        id: 210,
        title: "John Wick 4",
        urls: [
            "https://upload.wikimedia.org/wikipedia/en/2/25/John_Wick_Chapter_4_poster.jpg",
            "https://image.tmdb.org/t/p/w500/vZloFAK7NmvMGKE7VkF5UqZIG1v.jpg"
        ]
    }
];

async function download(url, filepath) {
    return new Promise((resolve, reject) => {
        const options = {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Referer': 'https://www.google.com/'
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
                download(res.headers.location, filepath).then(resolve).catch(reject);
            } else {
                res.resume();
                reject(new Error(`Status ${res.statusCode}`));
            }
        }).on('error', reject);
    });
}

async function run() {
    console.log("Starting final attempt at poster downloads...");
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    let changed = false;

    for (const movieInfo of posters) {
        const filename = `movie_${movieInfo.id}.jpg`;
        const filepath = path.join(imgDir, filename);
        let success = false;

        for (const url of movieInfo.urls) {
            try {
                process.stdout.write(`Trying ${url}... `);
                await download(url, filepath);
                console.log("SUCCESS!");
                success = true;
                break;
            } catch (e) {
                console.log(`Failed: ${e.message}`);
            }
        }

        if (success) {
            const movie = data.movies.find(m => m.id === movieInfo.id);
            if (movie) {
                const localPath = `./img/posters/${filename}`;
                if (movie.image !== localPath) {
                    movie.image = localPath;
                    changed = true;
                }
            }
        }
    }

    if (changed) {
        fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
        console.log("content.json updated successfully.");
    } else {
        console.log("No changes made to content.json.");
    }
}

run();
