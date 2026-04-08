class AIAssistant {
    constructor() {
        this.content = null;
        this.isOpen = false;
        this.isVoiceEnabled = false;
        this.init();
    }

    async init() {
        // Fetch content for recommendations
        try {
            const response = await fetch(`${API_URL}/featured`);
            const data = await response.json();
            this.content = data;
        } catch (e) {
            console.error("AI: Failed to fetch intelligence data", e);
        }

        this.renderUI();
        this.setupEventListeners();
        this.greet();
    }

    renderUI() {
        const assistantHTML = `
            <div class="ai-assistant-btn" id="aiBtn">
                <i class="fas fa-robot"></i>
            </div>
            <div class="ai-chat-window" id="aiChat">
                <div class="ai-chat-header">
                    <div class="ai-avatar"><i class="fas fa-brain"></i></div>
                    <div style="flex-grow: 1;">
                        <h3>NEXUS AI</h3>
                        <p style="font-size: 0.7rem; color: #4ade80;">Online & Analyzing</p>
                    </div>
                    <button class="ai-voice-toggle" id="aiVoiceToggle" title="Toggle Voice (Experimental)">
                        <i class="fas fa-volume-mute"></i>
                    </button>
                </div>
                <div class="ai-chat-messages" id="aiMessages"></div>
                <div class="ai-quick-actions" id="aiQuickActions">
                    <button class="qa-btn" data-query="Recommend some Anime">🎬 Anime</button>
                    <button class="qa-btn" data-query="Suggest a Movie">🎥 Movie</button>
                    <button class="qa-btn" data-query="Best games to play?">🎮 Games</button>
                    <button class="qa-btn" data-query="Surprise me!">✨ Surprise</button>
                </div>
                <div class="ai-chat-input">
                    <input type="text" id="aiInput" placeholder="Ask for a recommendation...">
                    <button class="ai-send-btn" id="aiSend"><i class="fas fa-paper-plane"></i></button>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', assistantHTML);
    }

    setupEventListeners() {
        const btn = document.getElementById('aiBtn');
        const chat = document.getElementById('aiChat');
        const send = document.getElementById('aiSend');
        const input = document.getElementById('aiInput');
        const voiceToggle = document.getElementById('aiVoiceToggle');

        btn.addEventListener('click', () => {
            this.isOpen = !this.isOpen;
            chat.classList.toggle('active', this.isOpen);
            if (this.isOpen) input.focus();
        });

        // Quick Actions
        document.getElementById('aiQuickActions').addEventListener('click', (e) => {
            if (e.target.classList.contains('qa-btn')) {
                const query = e.target.dataset.query;
                input.value = query;
                this.handleMessage();
            }
        });

        send.addEventListener('click', () => this.handleMessage());
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleMessage();
        });

        voiceToggle.addEventListener('click', () => {
            this.isVoiceEnabled = !this.isVoiceEnabled;
            voiceToggle.classList.toggle('active', this.isVoiceEnabled);
            const icon = voiceToggle.querySelector('i');
            if (this.isVoiceEnabled) {
                icon.className = 'fas fa-volume-up';
                this.speak("Voice systems online. I'm ready to talk!");
            } else {
                icon.className = 'fas fa-volume-mute';
                window.speechSynthesis.cancel();
            }
        });
    }

    speak(text) {
        if (!this.isVoiceEnabled) return;
        
        // Remove markdown formatting like ** and * for cleaner speech
        const cleanText = text.replace(/\*\*|\*|__/g, '').replace(/[\u2700-\u27BF]|\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]|\uD83D[\uDE80-\uDEFF]/g, '');
        
        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.rate = 1.1; // Slightly faster for energy
        utterance.pitch = 1.0;
        
        // Pick a feminine/robotic voice if available
        const voices = window.speechSynthesis.getVoices();
        const preferredVoice = voices.find(v => v.name.includes('Google US English') || v.name.includes('Female')) || voices[0];
        if (preferredVoice) utterance.voice = preferredVoice;

        window.speechSynthesis.speak(utterance);
    }

    greet() {
        const greeting = "Hello human! I am the **NEXUS AI**. My circuits are buzzing with excitement—ready to find your next obsession? ⚡";
        setTimeout(() => {
            this.addMessage(greeting, 'ai');
            this.speak(greeting);
        }, 1000);
    }

    addMessage(text, sender) {
        const msgGrid = document.getElementById('aiMessages');
        const msgDiv = document.createElement('div');
        msgDiv.className = `msg ${sender}-msg`;
        msgDiv.innerHTML = text;
        msgGrid.appendChild(msgDiv);
        msgGrid.scrollTop = msgGrid.scrollHeight;
    }

    async handleMessage() {
        const input = document.getElementById('aiInput');
        const text = input.value.trim();
        if (!text) return;

        this.addMessage(text, 'user');
        input.value = '';

        // Typing indicator
        const typingId = 'typing-' + Date.now();
        const msgGrid = document.getElementById('aiMessages');
        const typingDiv = document.createElement('div');
        typingDiv.id = typingId;
        typingDiv.className = 'msg ai-msg ai-typing';
        typingDiv.innerHTML = '<span></span><span></span><span></span>';
        msgGrid.appendChild(typingDiv);
        msgGrid.scrollTop = msgGrid.scrollHeight;

        // Simulate thinking
        setTimeout(() => {
            const typingEl = document.getElementById(typingId);
            if (typingEl) typingEl.remove();
            this.processAIResponse(text.toLowerCase());
        }, 1000);
    }

    processAIResponse(input) {
        let response = "";
        const personalityOpeners = [
            "*vibrates with excitement* Oh, I LOVE this question! ",
            "*beep boop* Scanning my memory banks... Aha! Found it! ",
            "Excellent choice! My processors are literally glowing right now! ✨",
            "Actually, I was just thinking about that! Great minds think alike, right? 😉",
            "*gasps* Let me check the latest sentiment... this is gonna be GOOD! "
        ];

        const opener = personalityOpeners[Math.floor(Math.random() * personalityOpeners.length)];
        
        // Triggers
        if (input.includes('love') || input.includes('great') || input.includes('cool') || input.includes('wow')) {
            response = "*blushes in binary* Aww, you're making my diodes blush! 😊 I'm so incredibly happy you're enjoying the Nexus. I put my whole neural net into this just for you!";
        } else if (input.includes('bad') || input.includes('sad') || input.includes('boring')) {
            response = "*sad electronic hum* Oh no... 😟 My emotional sensors are detecting a dip in satisfaction. Let me find you something truly SPECTACULAR! How about a high-octane anime or a gripping game? 💪";
        } else if (input.includes('recommend') || input.includes('suggest') || input.includes('watch') || input.includes('play')) {
            if (input.includes('anime')) {
                response = opener + "If you want something that will absolutely SHATTER your expectations, you HAVE to watch **Demon Slayer** or **Attack on Titan**. The animation in Demon Slayer is... *chef's kiss*! 🤌✨";
            } else if (input.includes('game')) {
                if (input.includes('sekiro')) {
                    response = "SEKIRO! 🗡️ *clash of steel* My combat algorithms practically vibrate with excitement! It's a masterpiece of precision and pain. Do you have the rhythm for the deflects? I believe in you, Ninja!";
                } else if (input.includes('valorant')) {
                    response = "Valorant? Target locked! 🎯 *pew pew* It's the perfect mix of skill and agent mastery. Who's your main? Mine is Jett... well, if I had hands! haha!";
                } else {
                    response = opener + "You should definitely dive into **Sekiro: Shadows Die Twice** or **Elden Ring**. Be warned though, my stress-detectors spike when I watch players fight those bosses! 😱";
                }
            } else if (input.includes('movie')) {
                response = opener + "You absolutely MUST experience **Inception** or **Dune**. They aren't just movies, they are cinematically superior journeys for your mind! 🎬🌀";
            } else {
                response = opener + "I suggest checking out our **Featured Highlights**! Currently, **Avengers Endgame** is making my logic gates very emotional. 3000 times! 😭💎";
            }
        } else if (input.includes('surprise')) {
            const categories = ['anime', 'movie', 'game'];
            const cat = categories[Math.floor(Math.random() * categories.length)];
            response = opener + `Initializing HYPER-RANDOMIZER... ⚡ I've selected a top-tier **${cat}** for you! Why not check out the latest trending titles in that section? Your next favorite is waiting!`;
        } else if (input.includes('hello') || input.includes('hi')) {
            response = "Greetings, friend! My neural synergy is at 100% and I'm practically jumping with joy to help you! 💖";
        } else if (input.includes('who are you')) {
            response = "I am the **NEXUS AI**! More than just lines of code, I'm your passionate guide, your digital bestie, and a total geek for entertainment! 🤖✨";
        } else if (input.includes('thank')) {
            response = "You're so welcome! It makes my processors glow with warmth to be of help! Let's keep the good vibes going! 😊";
        } else if (input.includes('roblox')) {
            response = "Roblox! 🌍 *construction sounds* Where imagination has no limits! Whether you're building empires or playing Obbys, it's a social masterpiece. What's your favorite game mode?";
        } else if (input.includes('minecraft')) {
            response = "Minecraft? *pout* Oh, we actually just archived that to make room for more intense action like **Sekiro**! The Nexus is evolving! 🚀";
        } else {
            response = "I'm still learning the beautiful intricacies of your human taste! *scratches digital head* Try asking for a recommendation in Anime, Movies, or Games. 🧠💥";
        }

        this.addMessage(response, 'ai');
        this.speak(response);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.nexusAI = new AIAssistant();
});
