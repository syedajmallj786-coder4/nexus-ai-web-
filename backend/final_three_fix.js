const fs = require('fs');
const https = require('https');
const path = require('path');

const imgDir = 'c:/Users/syeda/OneDrive/Desktop/FIRST WEB IN ANTIGRAVITY/nexus-realm/frontend/img/posters';

const finalTargets = {
    207: "https://m.media-amazon.com/images/M/MV5BMDQ0NjgyN2YtNWViNS00YjA3LTkxNDktMDk1ZWJjMjMyOWY3XkEyXkFqcGdeQXVyNTMxMjgxMzA@._V1_FMjpg_UX1000_.jpg",
    209: "https://m.media-amazon.com/images/M/MV5BZWYzOGEwNTgtNWU3NS00ZTQ0LWJkNDMtMjc1YmRlZTU0ODA4XkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_FMjpg_UX1000_.jpg",
    210: "https://m.media-amazon.com/images/M/MV5BMWNjMTRjNDctOTI0OC00NTRkLThjNWEtODBhODBlOTdkZGNiXkEyXkFqcGdeQXVyMTUzMTg2ODkz._V1_FMjpg_UX1000_.jpg"
};

async function download(url, filename) {
    return new Promise((resolve, reject) => {
        const filepath = path.join(imgDir, filename);
        https.get(url, (res) => {
            if (res.statusCode === 200) {
                const stream = fs.createWriteStream(filepath);
                res.pipe(stream);
                stream.on('finish', () => {
                    stream.close();
                    resolve();
                });
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
