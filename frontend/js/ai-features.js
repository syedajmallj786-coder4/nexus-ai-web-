/**
 * NEXUS REALM - Advanced AI Features
 * Implements Neural Synergy badges and Holographic Analysis Module.
 */

class AdvancedAI {
    constructor() {
        this.initAll();
    }

    initAll() {
        this.injectNeuralSynergy();
        if (window.location.pathname.includes('detail.html')) {
            this.initHolographicModule();
        }
    }

    // --- Neural Synergy Badges ---
    // Adds a "Synergy Match" badge to all content cards
    injectNeuralSynergy() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.classList && node.classList.contains('card')) {
                        this.addBadge(node);
                    }
                    // Also check children
                    if (node.querySelectorAll) {
                        node.querySelectorAll('.card').forEach(card => this.addBadge(card));
                    }
                });
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });
        
        // Initial run
        document.querySelectorAll('.card').forEach(card => this.addBadge(card));
    }

    addBadge(card) {
        if (card.querySelector('.neural-synergy')) return;
        
        const rating = Math.floor(Math.random() * (99 - 80 + 1)) + 80;
        let color = '#8b5cf6'; // Default Purple
        if (rating > 95) color = '#ec4899'; // Hot Pink for Ultra Match
        else if (rating > 90) color = '#06b6d4'; // Cyan for Great Match
        
        const badge = document.createElement('div');
        badge.className = 'neural-synergy';
        badge.style.cssText = `
            position: absolute;
            top: 10px;
            left: 10px;
            background: rgba(10, 10, 15, 0.9);
            backdrop-filter: blur(8px);
            padding: 5px 10px;
            border-radius: 8px;
            font-family: 'Orbitron', sans-serif;
            font-size: 0.7rem;
            color: ${color};
            border: 1px solid ${color};
            z-index: 5;
            display: flex;
            align-items: center;
            gap: 6px;
            box-shadow: 0 0 15px ${color}33;
            pointer-events: none;
            transition: all 0.3s ease;
        `;
        badge.innerHTML = `<i class="fas fa-brain fa-pulse" style="font-size: 0.9em;"></i> SYNC: ${rating}%`;
        card.style.position = 'relative';
        card.appendChild(badge);
    }

    // --- Holographic Intelligence Module ---
    initHolographicModule() {
        const actionBtns = document.querySelector('.action-buttons');
        if (!actionBtns) return;

        const aiBtn = document.createElement('button');
        aiBtn.className = 'btn-ai-analyze glass-btn';
        aiBtn.innerHTML = '<i class="fas fa-microchip"></i> AI ANALYSIS';
        aiBtn.style.cssText = `
            background: linear-gradient(45deg, rgba(6, 182, 212, 0.2), rgba(139, 92, 246, 0.2));
            color: var(--neon-cyan);
            border-color: var(--neon-cyan);
        `;
        
        actionBtns.appendChild(aiBtn);
        aiBtn.addEventListener('click', () => this.showAnalysis());
    }

    showAnalysis() {
        const title = document.querySelector('.hero-content h1')?.innerText || "This Content";
        const overlay = document.createElement('div');
        overlay.className = 'ai-hologram-overlay';
        overlay.innerHTML = `
            <div class="hologram-container">
                <div class="hologram-header">
                    <i class="fas fa-brain"></i>
                    <h2>NEURAL DEEP-DIVE: ${title.toUpperCase()}</h2>
                    <button class="close-hologram">&times;</button>
                </div>
                <div class="hologram-content">
                    <div class="analysis-section">
                        <h3><i class="fas fa-chart-line"></i> AUDIENCE RESONANCE</h3>
                        <div class="resonance-bar"><div class="fill" style="width: 94%"></div></div>
                        <p>Our neural networks detect a 94.2% positive sentiment across the global datacrawlers.</p>
                    </div>
                    <div class="analysis-section">
                        <h3><i class="fas fa-fingerprint"></i> SIGNATURE TRAITS</h3>
                        <div class="traits-grid">
                            <span>Cinematic Mastery</span>
                            <span>Emotional Depth</span>
                            <span>Neon Aesthetic</span>
                            <span>Peak Fiction</span>
                        </div>
                    </div>
                    <div class="analysis-section">
                        <h3><i class="fas fa-quote-left"></i> AI VERDICT</h3>
                        <p>"A definitive masterpiece within its metadata structure. Recommended for immediate neuro-consumption."</p>
                    </div>
                </div>
                <div class="hologram-scanline"></div>
            </div>
        `;
        
        document.body.appendChild(overlay);
        
        // Styling and closing logic
        setTimeout(() => overlay.classList.add('active'), 10);
        overlay.querySelector('.close-hologram').addEventListener('click', () => {
            overlay.classList.remove('active');
            setTimeout(() => overlay.remove(), 400);
        });
    }
}

// Add CSS for the hologram
const aiStyles = document.createElement('style');
aiStyles.textContent = `
    .ai-hologram-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.85);
        backdrop-filter: blur(10px);
        z-index: 2000;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.4s ease;
    }
    .ai-hologram-overlay.active { opacity: 1; }
    .hologram-container {
        width: 90%;
        max-width: 600px;
        background: rgba(10, 10, 15, 0.9);
        border: 2px solid var(--neon-cyan);
        border-radius: 20px;
        padding: 2.5rem;
        position: relative;
        overflow: hidden;
        box-shadow: 0 0 50px var(--neon-cyan)44;
        transform: scale(0.9) perspective(1000px) rotateX(10deg);
        transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .ai-hologram-overlay.active .hologram-container {
        transform: scale(1) perspective(1000px) rotateX(0deg);
    }
    .hologram-header {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin-bottom: 2rem;
        color: var(--neon-cyan);
    }
    .hologram-header h2 { font-family: 'Orbitron', sans-serif; font-size: 1.2rem; margin: 0; }
    .close-hologram {
        margin-left: auto;
        background: none;
        border: none;
        color: #fff;
        font-size: 2rem;
        cursor: pointer;
    }
    .analysis-section { margin-bottom: 1.5rem; }
    .analysis-section h3 {
        font-family: 'Orbitron', sans-serif;
        font-size: 0.8rem;
        color: var(--neon-purple);
        margin-bottom: 0.8rem;
    }
    .resonance-bar {
        height: 8px;
        background: rgba(255,255,255,0.1);
        border-radius: 4px;
        margin-bottom: 0.5rem;
    }
    .resonance-bar .fill {
        height: 100%;
        background: var(--neon-cyan);
        box-shadow: 0 0 10px var(--neon-cyan);
        border-radius: 4px;
    }
    .traits-grid {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
    }
    .traits-grid span {
        background: rgba(6, 182, 212, 0.1);
        border: 1px solid var(--neon-cyan);
        padding: 4px 10px;
        border-radius: 4px;
        font-size: 0.75rem;
        color: #fff;
    }
    .hologram-scanline {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(to bottom, transparent 50%, rgba(6, 182, 212, 0.05) 50%);
        background-size: 100% 4px;
        pointer-events: none;
        animation: scanline 10s linear infinite;
    }
    @keyframes scanline {
        0% { transform: translateY(0); }
        100% { transform: translateY(4px); }
    }
`;
document.head.appendChild(aiStyles);

// Auto-init
document.addEventListener('DOMContentLoaded', () => {
    window.advancedAI = new AdvancedAI();
});
