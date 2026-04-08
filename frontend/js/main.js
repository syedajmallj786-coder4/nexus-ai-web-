// NEXUS REALM - Global JS

// Constants
const API_URL = 'http://localhost:3000/api';

// Loading Screen
const hideLoader = () => {
    const loader = document.getElementById('loadingScreen');
    if (loader && loader.style.display !== 'none') {
        loader.style.opacity = '0';
        setTimeout(() => loader.style.display = 'none', 500);
    }
};

window.addEventListener('load', () => {
    setTimeout(hideLoader, 2000);
});

// Safety timeout: Hide loader after 5 seconds regardless of load event
setTimeout(hideLoader, 5000);

// Custom Cursor
const cursorDot = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');

if(cursorDot && cursorOutline) {
    window.addEventListener('mousemove', (e) => {
        const posX = e.clientX;
        const posY = e.clientY;

        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;

        cursorOutline.animate({
            left: `${posX}px`,
            top: `${posY}px`
        }, { duration: 100, fill: "forwards" });
    });

    document.querySelectorAll('a, button, input, .card').forEach(el => {
        el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
}

// Scroll Progress & Back to Top & Navbar effect
const scrollProgress = document.getElementById('scrollProgress');
const backToTop = document.getElementById('backToTop');
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const scrollPx = document.documentElement.scrollTop;
    const winHeightPx = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = `${scrollPx / winHeightPx * 100}%`;
    
    if(scrollProgress) scrollProgress.style.width = scrolled;

    if(backToTop) {
        if (scrollPx > 300) backToTop.classList.add('visible');
        else backToTop.classList.remove('visible');
    }

    if(navbar) {
        if (scrollPx > 50) navbar.style.background = 'rgba(10, 10, 15, 0.9)';
        else navbar.style.background = 'var(--glass-bg)';
    }

    // Scroll Animation (Fade Up)
    document.querySelectorAll('.fade-up:not(.visible)').forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight - 50) {
            el.classList.add('visible');
        }
    });
});

if(backToTop) {
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// Mobile Menu
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
if(hamburger) {
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active'); // You can add animation to lines in CSS
    });
}

// Dark/Light Mode Toggle
const themeToggle = document.getElementById('themeToggle');
if(themeToggle) {
    const icon = themeToggle.querySelector('i');
    const isLight = localStorage.getItem('theme') === 'light';
    if(isLight) {
        document.body.classList.add('light-mode');
        icon.classList.replace('fa-sun', 'fa-moon');
    }

    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light-mode');
        if(document.body.classList.contains('light-mode')){
            localStorage.setItem('theme', 'light');
            icon.classList.replace('fa-sun', 'fa-moon');
        } else {
            localStorage.setItem('theme', 'dark');
            icon.classList.replace('fa-moon', 'fa-sun');
        }
    });
}

// Global Search
const globalSearch = document.getElementById('globalSearch');
const searchOverlay = document.getElementById('searchResultsOverlay');
const closeSearchBtn = document.getElementById('closeSearchBtn');
const searchResultsGrid = document.getElementById('searchResultsGrid');
let searchTimeout;

if(globalSearch) {
    globalSearch.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        const query = e.target.value.trim();
        
        if(query.length === 0) {
            searchOverlay.classList.add('hidden');
            return;
        }

        searchTimeout = setTimeout(() => {
            fetch(`${API_URL}/search?q=${encodeURIComponent(query)}`)
                .then(res => res.json())
                .then(data => {
                    searchOverlay.classList.remove('hidden');
                    renderCards(data, searchResultsGrid);
                })
                .catch(err => console.error('Search error:', err));
        }, 300);
    });
}

if(closeSearchBtn) {
    closeSearchBtn.addEventListener('click', () => {
        searchOverlay.classList.add('hidden');
        globalSearch.value = '';
    });
}

// Utility: Render Cards
function renderCards(items, container) {
    if(!container) return;
    container.innerHTML = '';
    
    if(items.length === 0) {
        container.innerHTML = '<p style="text-align:center;width:100%;color:var(--text-muted)">No results found.</p>';
        return;
    }

    items.forEach(item => {
        const card = document.createElement('div');
        card.className = 'card';
        card.dataset.id = item.id;
        card.dataset.type = item.category;

        // Ensure real fallback
        const imgSrc = item.image ? item.image : `https://placehold.co/300x450/8b5cf6/ffffff?text=${encodeURIComponent(item.title)}`;
        
        // Watchlist state
        const watchlist = JSON.parse(localStorage.getItem('watchlist')) || {};
        const isSaved = watchlist[item.id] ? 'saved' : '';
        const savedIcon = isSaved ? 'fas fa-heart' : 'far fa-heart';

        // Rating state
        const ratings = JSON.parse(localStorage.getItem('ratings')) || {};
        const myRating = ratings[item.id] || 0;
        let starsHtml = '';
        for(let i=1; i<=5; i++) {
            starsHtml += `<i class="${i <= myRating ? 'fas' : 'far'} fa-star" data-val="${i}"></i>`;
        }

        // Badges
        let badgeHtml = '';
        if(item.featured || item.title.includes('Trending')) badgeHtml += '<span class="badge badge-trending">Trending</span>';
        if(item.status === 'Coming Soon') badgeHtml += '<span class="badge badge-new">New</span>';

        card.innerHTML = `
            <div class="card-img-wrapper">
                <img src="${imgSrc}" loading="lazy" alt="${item.title}" class="card-img" onerror="this.onerror=null;this.src='https://placehold.co/300x450/1a0533/8b5cf6?text=${encodeURIComponent(item.title.substring(0,20))}'">
                <div class="badges">${badgeHtml}</div>
                <div class="card-actions">
                    <button class="btn-watchlist ${isSaved}" aria-label="Add to Watchlist" onclick="toggleWatchlist(event, ${item.id}, '${item.title}', '${item.category}')">
                        <i class="${savedIcon}"></i>
                    </button>
                </div>
                <div class="card-overlay">
                    <p>${item.description || 'No description available.'}</p>
                    <a href="detail.html?id=${item.id}&type=${item.category}" class="btn glass-btn card-detail-link" style="font-size:0.8rem;padding:0.5rem 1rem;position:relative;z-index:20;pointer-events:auto">View Details</a>
                </div>
            </div>
            <div class="card-body">
                <h3 class="card-title">${item.title}</h3>
                <div class="card-meta">
                    <span>${item.year || ''}</span>
                    <span><i class="fas fa-star" style="color:gold"></i> ${item.rating || 'N/A'}</span>
                </div>
                <div class="card-genres">
                    ${(item.genre || []).slice(0, 2).map(g => `<span class="genre-tag">${g}</span>`).join('')}
                </div>
                <div class="star-rating" data-id="${item.id}" onclick="rateItem(event)">
                    ${starsHtml}
                </div>
            </div>
        `;

        // 3D Tilt Effect (reduced intensity to avoid blocking overlays)
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -5;
            const rotateY = ((x - centerX) / centerX) * 5;
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03, 1.03, 1.03)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        });

        // Fallback: clicking the card itself navigates to detail (unless clicking a button)
        card.addEventListener('click', (e) => {
            if (e.target.closest('.btn-watchlist') || e.target.closest('.star-rating') || e.target.closest('.card-detail-link')) return;
            window.location.href = `detail.html?id=${item.id}&type=${item.category}`;
        });

        container.appendChild(card);
    });
}

// Watchlist Functionality
window.toggleWatchlist = function(e, id, title, type) {
    e.stopPropagation();
    const btn = e.currentTarget;
    const icon = btn.querySelector('i');
    let watchlist = JSON.parse(localStorage.getItem('watchlist')) || {};

    if(watchlist[id]) {
        delete watchlist[id];
        btn.classList.remove('saved');
        icon.classList.replace('fas', 'far');
    } else {
        watchlist[id] = { id, title, type };
        btn.classList.add('saved');
        icon.classList.replace('far', 'fas');
    }
    localStorage.setItem('watchlist', JSON.stringify(watchlist));
};

// Rating Functionality
window.rateItem = function(e) {
    e.stopPropagation();
    if(e.target.tagName !== 'I') return;
    
    const container = e.currentTarget;
    const id = container.dataset.id;
    const val = parseInt(e.target.dataset.val);
    
    let ratings = JSON.parse(localStorage.getItem('ratings')) || {};
    ratings[id] = val;
    localStorage.setItem('ratings', JSON.stringify(ratings));

    const stars = container.querySelectorAll('i');
    stars.forEach((star, idx) => {
        if(idx < val) {
            star.classList.replace('far', 'fas');
        } else {
            star.classList.replace('fas', 'far');
        }
    });
};

/* =========================================
   Background Starfield (Canvas)
========================================= */
const canvas = document.getElementById('starfield');
if(canvas) {
    const ctx = canvas.getContext('2d');
    let width, height;
    let stars = [];

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }

    function initStars() {
        stars = [];
        for(let i=0; i<200; i++) {
            stars.push({
                x: Math.random() * width,
                y: Math.random() * height,
                z: Math.random() * width,
                size: Math.random() * 2
            });
        }
    }

    function drawStars() {
        ctx.fillStyle = '#0a0a0f'; // Matches bg-dark roughly
        ctx.fillRect(0, 0, width, height);
        
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        stars.forEach(s => {
            s.z -= 0.5;
            if(s.z <= 0) {
                s.x = Math.random() * width;
                s.y = Math.random() * height;
                s.z = width;
            }
            const px = (s.x - width/2) * (width/s.z) + width/2;
            const py = (s.y - height/2) * (width/s.z) + height/2;
            const pSize = s.size * (width/s.z);
            
            ctx.beginPath();
            ctx.arc(px, py, pSize, 0, Math.PI*2);
            ctx.fill();
        });
        requestAnimationFrame(drawStars);
    }

    window.addEventListener('resize', resize);
    resize();
    initStars();
    drawStars();
}
