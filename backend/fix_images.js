const fs = require('fs');

const dataPath = 'c:/Users/syeda/OneDrive/Desktop/FIRST WEB IN ANTIGRAVITY/nexus-realm/backend/data/content.json';
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

// The IMDB links we used earlier are blocking external hotlinks with 403 Forbidden errors. 
// We need to swap them to reliable TMDB (The Movie Database) or Wikipedia image URLs.

const newImageUrls = {
    201: "https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg", // Avengers Endgame
    202: "https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkYSBPA8g8zZcf10.jpg", // Inception
    203: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MvrIdlsR.jpg", // Interstellar
    204: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg", // The Dark Knight
    205: "https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1R80vC08p2l7s.jpg", // Spider-Man No Way Home
    206: "https://image.tmdb.org/t/p/w500/jRXYjXNqOewc7xNCwX5627Qo8s1.jpg", // Avatar
    207: "https://image.tmdb.org/t/p/w500/d5NXSklXo0qyIYkgV94XAgMIck1.jpg", // Dune
    208: "https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg", // Oppenheimer
    209: "https://image.tmdb.org/t/p/w500/62HCnUTziyWcpZ1pwwzO1gDqwA8.jpg", // Top Gun Maverick
    210: "https://image.tmdb.org/t/p/w500/vZloFAK7NmvMGKE7VkF5UqZIG1v.jpg", // John Wick 4
    // We will also swap Minecraft and GTA 6 just in case those amazon links die too
    304: "https://upload.wikimedia.org/wikipedia/en/2/20/Grand_Theft_Auto_VI_logo.png", // GTA 6
    306: "https://upload.wikimedia.org/wikipedia/en/5/51/Minecraft_cover.png" // Minecraft
};

let changed = false;

for (let category of ['movies', 'games']) {
    for (let item of data[category]) {
        if (newImageUrls[item.id]) {
            item.image = newImageUrls[item.id];
            changed = true;
            console.log(`Updated image for ${item.title}`);
        }
    }
}

if (changed) {
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
    console.log("Successfully updated content.json with stable image links.");
} else {
    console.log("No images needed updating.");
}
