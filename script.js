const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');

function setCanvasDimensions() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

setCanvasDimensions();

window.addEventListener('resize', setCanvasDimensions);

// Easing function for smooth acceleration and deceleration
function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

class Particle {
    constructor(x, y, radius, color, velocity, returntime) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
        this.alpha = 1;
        this.time = 0;
        this.returntime = returntime; // Add the returntime property
        this.initialX = x; // Store the initial X position
        this.initialY = y; // Store the initial Y position
    }

    draw() {
        ctx.globalAlpha = this.alpha; // Set particle opacity
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.globalAlpha = 1; // Reset globalAlpha
    }

    update() {
        this.draw();

        // If time is less than returntime, update position normally
        if (this.time < this.returntime) {
            const progress = this.time / this.returntime;
            const easing = easeInOutCubic(progress);

            // Apply easing to velocity for smooth acceleration and deceleration
            this.x += this.velocity.x * easing;
            this.y += this.velocity.y * easing;
        } else {
            // Calculate direction towards cursor (current mouse position)
            const dx = mouseX - this.x;
            const dy = mouseY - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            // Normalize the direction
            const directionX = dx / distance;
            const directionY = dy / distance;

            // Move the particle towards the cursor
            this.x += directionX * 4; // Speed up the return movement
            this.y += directionY * 4; // Speed up the return movement
        }

        if (this.alpha > 0.5) {
            this.alpha -= 0.01; // Reduce particle opacity over time
        }
        this.time++; // Increment the particle's time property
    }
}

const particles = [];
let mouseX = canvas.width / 2; 
let mouseY = canvas.height / 2; 

function createParticle(x, y) {
    const radius = Math.random() * 4 + 1;
    const color = `rgba(50, 50, 255, 1)`;

    // Random initial velocity
    const velocity = {
        x: (Math.random() - 0.5) * 4,
        y: (Math.random() - 0.5) * 4,
    };

    // Random returntime between 50 and 200 frames
    const returntime = Math.floor(Math.random() * 150) + 100;

    particles.push(new Particle(x, y, radius, color, velocity, returntime));
}

function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((particle, index) => {
        if (particle.alpha <= 0  || particle.time>1000) {
            particles.splice(index, 1);
        } else {
            particle.update();
        }
    });
}

setInterval(() => {
    createParticle(mouseX, mouseY);
}, 20);

animate();

// Listen for mousemove events to update the cursor position
addEventListener('mousemove', (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;
});
