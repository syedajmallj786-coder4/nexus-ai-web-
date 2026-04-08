const fs = require('fs');
const https = require('https');
const path = require('path');

const imgDir = 'c:/Users/syeda/OneDrive/Desktop/FIRST WEB IN ANTIGRAVITY/nexus-realm/frontend/img/posters';

const finalTargets = {
    207: "https://www.themoviedb.org/t/p/w600_and_h900_bestv2/d5NXSklXo0qyIYkgV94XAgMIck1.jpg",
    209: "https://www.themoviedb.org/t/p/w600_and_h900_bestv2/62HCnUTziyWcpZ1pwwzO1gDqwA8.jpg",
    210: "https://www.themoviedb.org/t/p/w600_and_h900_bestv2/vZloFAK7NmvMGKE7VkF5UqZIG1v.jpg"
};

async function download(url, filename) {
    return new Promise((resolve, reject) => {
        const filepath = path.join(imgDir, filename);
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
                // Follow redirect
                download(res.headers.location, filename).then(resolve).catch(reject);
            } else {
                res.resume();
                reject(new Error(`Status ${res.statusCode}`));
            }
        }).on('error', reject);
    });
}

async function run() {
    for (const [id, url] of Object.entries(finalTargets)) {
        const filename = `movie_${id}.jpg`;
        try {
            process.stdout.write(`Downloading ${filename}... `);
            await download(url, filename);
            console.log("Success!");
        } catch (e) {
            console.log(`Failed: ${e.message}`);
        }
    }
}

run();
