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
