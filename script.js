// YouTube Background Player Logic
let player;
function onYouTubeIframeAPIReady() {
    player = new YT.Player('bg-player', {
        height: '0',
        width: '0',
        videoId: 'jaVdD4Z8UCs',
        playerVars: {
            'autoplay': 1,
            'loop': 1,
            'playlist': 'jaVdD4Z8UCs',
            'controls': 0,
            'showinfo': 0,
            'autohide': 1,
            'modestbranding': 1,
            'mute': 1 // Start muted to satisfy browser policies
        },
        events: {
            'onReady': onPlayerReady
        }
    });
}

const audioToggle = document.getElementById('audio-toggle');
const audioLabel = audioToggle.querySelector('.audio-label');

function onPlayerReady(event) {
    audioToggle.addEventListener('click', () => {
        if (player.isMuted()) {
            player.unMute();
            player.playVideo();
            audioToggle.classList.add('audio-active');
            audioLabel.innerText = 'AUDIO_TAC_ON';
        } else {
            player.mute();
            audioToggle.classList.remove('audio-active');
            audioLabel.innerText = 'AUDIO_TAC_OFF';
        }
    });
}

// Fidget Game Logic
const canvas = document.getElementById('fidget-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
let mouse = { x: null, y: null };

window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Particle {
    constructor(x, y) {
        this.x = x || Math.random() * canvas.width;
        this.y = y || Math.random() * canvas.height;
        this.size = Math.random() * 20 + 10;
        this.speedX = (Math.random() - 0.5) * 2;
        this.speedY = (Math.random() - 0.5) * 2;
        this.color = `rgba(188, 255, 0, ${Math.random() * 0.2 + 0.1})`; // Faint accent color
    }

    update() {
        // Repel logic
        if (mouse.x !== null && mouse.y !== null) {
            let dx = this.x - mouse.x;
            let dy = this.y - mouse.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            let forceRadius = 150;

            if (distance < forceRadius) {
                let force = (forceRadius - distance) / forceRadius;
                let directionX = dx / distance;
                let directionY = dy / distance;
                this.x += directionX * force * 5; // Repel strength
                this.y += directionY * force * 5;
            }
        }

        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x > canvas.width || this.x < 0) this.speedX *= -1;
        if (this.y > canvas.height || this.y < 0) this.speedY *= -1;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.strokeStyle = 'rgba(188, 255, 0, 0.3)';
        ctx.stroke();
    }
}

function initFidget() {
    for (let i = 0; i < 30; i++) {
        particles.push(new Particle());
    }
}

function animateFidget() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
        p.update();
        p.draw();
    });
    requestAnimationFrame(animateFidget);
}

canvas.addEventListener('mousedown', (e) => {
    const mouseX = e.clientX;
    const mouseY = e.clientY;

    // Check if we clicked a particle to "pop" it
    for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        const dist = Math.sqrt((mouseX - p.x) ** 2 + (mouseY - p.y) ** 2);
        if (dist < p.size) {
            particles.splice(i, 1);
            // Spawn 2 smaller ones
            if (particles.length < 50) {
                particles.push(new Particle(mouseX, mouseY));
                particles.push(new Particle(mouseX, mouseY));
            }
            break;
        }
    }
});

initFidget();
animateFidget();

// Intersection Observer for Scroll Animations
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.stat-card, .testimonial, .section-title').forEach(el => {
    el.style.opacity = '0';
    observer.observe(el);
});

// Hire Button Logic
const hireBtn = document.getElementById('hire-btn');
const modal = document.getElementById('modal');

hireBtn.addEventListener('click', () => {
    modal.style.display = 'flex';
});

function closeModal() {
    modal.style.display = 'none';
}

// Rejection Button Prank Logic (The "Runaway" Button)
const rejectBtn = document.getElementById('reject-btn');

rejectBtn.addEventListener('mouseover', () => {
    const maxX = window.innerWidth - rejectBtn.offsetWidth - 100;
    const maxY = window.innerHeight - rejectBtn.offsetHeight - 100;

    const randomX = Math.floor(Math.random() * maxX);
    const randomY = Math.floor(Math.random() * maxY);

    rejectBtn.style.position = 'fixed';
    rejectBtn.style.left = randomX + 'px';
    rejectBtn.style.top = randomY + 'px';
    rejectBtn.style.zIndex = '1000';

    // Change text after first hover
    if (rejectBtn.innerText !== 'MISTAKE.') {
        rejectBtn.innerText = 'MISTAKE.';
    }
});

// Closing modal on click outside
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

// Corporate Sprint Minigame
class CorporateSprint {
    constructor() {
        this.canvas = document.getElementById('game-canvas');
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.container = document.getElementById('game-container');
        this.overlay = document.getElementById('game-overlay');
        this.startButton = document.getElementById('start-game-btn');
        this.scoreElement = document.getElementById('game-score');
        this.healthElement = document.getElementById('game-health');

        this.mateoImg = new Image();
        this.mateoImg.src = 'mateo.png';

        this.score = 0;
        this.health = 100;
        this.active = false;
        this.items = [];
        this.mouseX = 0;
        this.lastTime = 0;
        this.spawnTimer = 0;
        this.difficulty = 1;

        this.itemTypes = [
            { label: 'OFFER', color: '#bcff00', value: 10, type: 'good' },
            { label: 'INTERN', color: '#ff4444', value: -20, type: 'bad' },
            { label: 'SYNERGY', color: '#00f2ff', value: 15, type: 'good' },
            { label: 'PITFALL', color: '#ffaa00', value: -10, type: 'bad' }
        ];

        this.init();
    }

    init() {
        this.resize();
        window.addEventListener('resize', () => this.resize());
        this.container.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouseX = e.clientX - rect.left;
        });

        this.startButton.addEventListener('click', () => this.start());
    }

    resize() {
        this.canvas.width = this.container.offsetWidth;
        this.canvas.height = this.container.offsetHeight;
    }

    start() {
        this.score = 0;
        this.health = 100;
        this.items = [];
        this.active = true;
        this.difficulty = 1;
        this.scoreElement.innerText = '0';
        this.healthElement.innerText = '100%';
        this.overlay.style.display = 'none';
        this.lastTime = performance.now();
        requestAnimationFrame((t) => this.gameLoop(t));
    }

    spawnItem() {
        const type = this.itemTypes[Math.floor(Math.random() * this.itemTypes.length)];
        this.items.push({
            x: Math.random() * (this.canvas.width - 80),
            y: -40,
            width: 80,
            height: 30,
            speed: (2 + Math.random() * 3) * this.difficulty,
            ...type
        });
    }

    update(deltaTime) {
        if (!this.active) return;

        this.spawnTimer += deltaTime;
        if (this.spawnTimer > 1500 / this.difficulty) {
            this.spawnItem();
            this.spawnTimer = 0;
        }

        this.difficulty = 1 + (this.score / 200);

        for (let i = this.items.length - 1; i >= 0; i--) {
            const item = this.items[i];
            item.y += item.speed;

            // Collision detection with Mateo (player is at mouseX, bottom)
            const playerX = this.mouseX - 30;
            const playerY = this.canvas.height - 80;
            const playerWidth = 60;
            const playerHeight = 60;

            if (item.x < playerX + playerWidth &&
                item.x + item.width > playerX &&
                item.y < playerY + playerHeight &&
                item.y + item.height > playerY) {

                this.score += item.value;
                if (item.type === 'bad') {
                    this.health += item.value;
                    this.container.style.borderColor = '#ff4444';
                    setTimeout(() => this.container.style.borderColor = '#222', 200);
                } else {
                    this.container.style.borderColor = '#bcff00';
                    setTimeout(() => this.container.style.borderColor = '#222', 200);
                }

                if (this.health <= 0) {
                    this.health = 0;
                    this.gameOver();
                }

                this.scoreElement.innerText = Math.max(0, this.score);
                this.healthElement.innerText = Math.max(0, this.health) + '%';
                this.items.splice(i, 1);
            } else if (item.y > this.canvas.height) {
                this.items.splice(i, 1);
            }
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw Player (Mateo)
        const playerX = this.mouseX - 30;
        const playerY = this.canvas.height - 80;
        if (this.mateoImg.complete) {
            this.ctx.drawImage(this.mateoImg, playerX, playerY, 60, 60);
        } else {
            this.ctx.fillStyle = '#bcff00';
            this.ctx.fillRect(playerX, playerY, 60, 60);
        }

        // Draw Items
        this.items.forEach(item => {
            this.ctx.fillStyle = item.color;
            this.ctx.fillRect(item.x, item.y, item.width, item.height);
            this.ctx.fillStyle = '#000';
            this.ctx.font = 'bold 10px JetBrains Mono';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(item.label, item.x + item.width / 2, item.y + 18);

            this.ctx.strokeStyle = '#fff';
            this.ctx.lineWidth = 1;
            this.ctx.strokeRect(item.x, item.y, item.width, item.height);
        });
    }

    gameLoop(timestamp) {
        if (!this.active) return;
        const deltaTime = timestamp - this.lastTime;
        this.lastTime = timestamp;

        this.update(deltaTime);
        this.draw();
        requestAnimationFrame((t) => this.gameLoop(t));
    }

    gameOver() {
        this.active = false;
        this.overlay.style.display = 'flex';
        this.overlay.querySelector('h3').innerText = 'DEPLOYMENT TERMINATED.';
        this.overlay.querySelector('p').innerText = `Final Score: ${this.score}. Career trajectory stabilized.`;
        this.startButton.innerText = 'RE-DEPLOY ASSET';
    }
}

// Global initialization
document.addEventListener('DOMContentLoaded', () => {
    initFidget();
    animateFidget();
    new CorporateSprint();
});
