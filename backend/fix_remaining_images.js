const fs = require('fs');

const dataPath = 'c:/Users/syeda/OneDrive/Desktop/FIRST WEB IN ANTIGRAVITY/nexus-realm/backend/data/content.json';
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

// TMDB also heavily rate-limits/blocks hotlinking. We need guaranteed static assets like Wikipedia 
// or well-known promotional CDNs for these specific broken movie posters.

const guaranteedImageUrls = {
    // Failing TMDB replacements:
    202: "https://upload.wikimedia.org/wikipedia/en/2/2e/Inception_%282010%29_theatrical_poster.jpg", // Inception
    203: "https://upload.wikimedia.org/wikipedia/en/b/bc/Interstellar_film_poster.jpg", // Interstellar
    205: "https://upload.wikimedia.org/wikipedia/en/0/00/Spider-Man_No_Way_Home_poster.jpg", // Spider-Man
    206: "https://upload.wikimedia.org/wikipedia/en/d/d6/Avatar_%282009_film%29_poster.jpg", // Avatar
    207: "https://upload.wikimedia.org/wikipedia/en/8/8e/Dune_%282021_film%29_poster.jpg", // Dune
};

let changed = false;

for (let category of ['movies']) {
    for (let item of data[category]) {
        if (guaranteedImageUrls[item.id]) {
            item.image = guaranteedImageUrls[item.id];
            changed = true;
            console.log(`[FIXED] Updated image for ${item.title}`);
        }
    }
}

if (changed) {
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
    console.log("Successfully patched content.json with Wikipedia image links.");
} else {
    console.log("No images needed updating.");
}
