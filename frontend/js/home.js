// NEXUS REALM - Home Page Scripts

document.addEventListener('DOMContentLoaded', () => {

    // 1. Fetch Featured Content for Carousel
    fetch(`${API_URL}/featured`)
        .then(res => res.json())
        .then(data => {
            const track = document.getElementById('featuredCarousel');
            if(!track) return;
            
            const featuredItems = [...data.anime, ...data.movies, ...data.games];
            if(featuredItems.length === 0) return;

            featuredItems.forEach((item, idx) => {
                const slide = document.createElement('div');
                slide.className = `carousel-slide ${idx === 0 ? 'active' : ''}`;
                slide.innerHTML = `
                    <img src="${item.image}" alt="${item.title}">
                    <div class="slide-content">
                        <span class="badge badge-trending">Featured</span>
                        <h2>${item.title}</h2>
                        <p>${item.description}</p>
                        <a href="detail.html?id=${item.id}&type=${item.category}" class="btn primary-btn">Watch Now</a>
                    </div>
                `;
                track.appendChild(slide);
            });

            // Very simple auto-slide
            let currentSlide = 0;
            setInterval(() => {
                const slides = track.querySelectorAll('.carousel-slide');
                if(slides.length === 0) return;
                slides[currentSlide].classList.remove('active');
                currentSlide = (currentSlide + 1) % slides.length;
                slides[currentSlide].classList.add('active');
            }, 5000);
        });

    // 2. Fetch Category Previews
    fetch(`${API_URL}/anime`)
        .then(res => res.json())
        .then(data => {
            const container = document.getElementById('animePreviewGrid');
            if(container) renderCards(data.slice(0, 6), container);
        });

    fetch(`${API_URL}/movies`)
        .then(res => res.json())
        .then(data => {
            const container = document.getElementById('moviesPreviewGrid');
            if(container) renderCards(data.slice(0, 6), container);
        });

    fetch(`${API_URL}/games`)
        .then(res => res.json())
        .then(data => {
            const container = document.getElementById('gamesPreviewGrid');
            if(container) renderCards(data.slice(0, 6), container);
        });

    // 3. Counter Animation
    const counters = document.querySelectorAll('.counter');
    let hasCounted = false;

    window.addEventListener('scroll', () => {
        if(hasCounted) return;
        const rect = document.querySelector('.stats-container')?.getBoundingClientRect();
        if(rect && rect.top < window.innerHeight) {
            hasCounted = true;
            counters.forEach(counter => {
                const target = parseInt(counter.dataset.target);
                const duration = 2000; // ms
                const step = target / (duration / 16);
                let current = 0;
                
                const update = () => {
                    current += step;
                    if(current < target) {
                        counter.innerText = Math.floor(current);
                        requestAnimationFrame(update);
                    } else {
                        counter.innerText = target;
                    }
                };
                update();
            });
        }
    });

    // Sakura Petals handled by effects.js

    // 4. AI Pulse Discovery Logic
    initAIPulse();

});

async function initAIPulse() {
    const container = document.getElementById('aiPulseContent');
    if (!container) return;

    // Wait for the "scan" simulation
    await new Promise(resolve => setTimeout(resolve, 4000));

    try {
        const response = await fetch(`${API_URL}/featured`);
        const data = await response.json();
        const allItems = [...data.anime, ...data.movies, ...data.games];
        
        if (allItems.length === 0) return;
        
        const randomItem = allItems[Math.floor(Math.random() * allItems.length)];
        
        // Match score (randomly high for AI effect)
        const matchScore = (Math.random() * (100 - 98) + 98).toFixed(1);

        container.innerHTML = `
            <div class="pulse-card-reveal">
                <img src="${randomItem.image}" alt="${randomItem.title}" class="pulse-card-img" onerror="this.src='https://placehold.co/300x450/1a0533/8b5cf6?text=${encodeURIComponent(randomItem.title)}'">
                <div class="pulse-card-info">
                    <div class="pulse-match-score">
                        <i class="fas fa-microchip"></i> NEURAL MATCH: ${matchScore}%
                    </div>
                    <h3>${randomItem.title}</h3>
                    <p style="margin-bottom: 1.5rem; color: var(--text-muted); font-size: 0.9rem;">
                        ${randomItem.description.substring(0, 150)}...
                    </p>
                    <a href="detail.html?id=${randomItem.id}&type=${randomItem.category}" class="btn primary-btn pulse-glow" style="padding: 0.6rem 1.5rem; font-size: 0.8rem;">
                        INTERFACE NOW
                    </a>
                </div>
            </div>
        `;
    } catch (e) {
        console.error("AI Pulse Error:", e);
        container.innerHTML = '<p>Neural connection interrupted. Please refresh.</p>';
    }
}

