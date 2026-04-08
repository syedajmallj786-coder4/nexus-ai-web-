/**
 * NEXUS REALM - Visual Effects
 * Includes Sakura falling animation and other aesthetic enhancements.
 */

class SakuraEffect {
    constructor() {
        this.container = document.getElementById('sakura-container');
        if (!this.container) return;
        this.petals = [];
        this.petalCount = 30;
        this.init();
    }

    init() {
        for (let i = 0; i < this.petalCount; i++) {
            this.createPetal();
        }
        this.animate();
    }

    createPetal() {
        const petal = document.createElement('div');
        petal.className = 'sakura-petal';
        
        const size = Math.random() * 10 + 10;
        petal.style.width = `${size}px`;
        petal.style.height = `${size}px`;
        
        const startX = Math.random() * window.innerWidth;
        const startY = -size;
        
        petal.style.left = `${startX}px`;
        petal.style.top = `${startY}px`;
        
        // Random drift and rotation
        const duration = Math.random() * 5 + 5;
        const delay = Math.random() * 5;
        
        petal.style.animation = `sakura-fall ${duration}s linear ${delay}s infinite`;
        this.container.appendChild(petal);
    }

    animate() {
        // Most logic handled by CSS animations for performance
    }
}

class StarfieldEffect {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.container = document.getElementById('starfield');
        if (!this.container) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.stars = [];
        this.count = 150;
        this.init();
    }

    init() {
        if (this.container.tagName.toLowerCase() === 'canvas') {
            this.canvas = this.container;
        } else {
            this.container.appendChild(this.canvas);
        }
        window.addEventListener('resize', () => this.resize());
        this.resize();

        for (let i = 0; i < this.count; i++) {
            this.stars.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 1.5,
                speed: Math.random() * 0.5 + 0.1
            });
        }
        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = '#fff';
        
        this.stars.forEach(star => {
            this.ctx.beginPath();
            this.ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            this.ctx.fill();
            
            star.y += star.speed;
            if (star.y > this.canvas.height) {
                star.y = -star.size;
                star.x = Math.random() * this.canvas.width;
            }
        });
        
        requestAnimationFrame(() => this.animate());
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new SakuraEffect();
    new StarfieldEffect();
});
