// Helper utility functions

// Fisher-Yates shuffle algorithm
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Error reporting function
function reportError(error) {
    console.error('Application error:', error);
    // In a production app, you might want to send this to a logging service
}

// Simple confetti effect
function createConfetti(amount = 200, duration = 2500) {
    const colors = ['#fce18a', '#ff726d', '#b484f0', '#f4306d'];
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '1000';
    document.body.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const confetti = [];
    for (let i = 0; i < amount; i++) {
        confetti.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 5 + 2,
            color: colors[Math.floor(Math.random() * colors.length)],
            velocityX: Math.random() * 4 - 2,
            velocityY: Math.random() * 4 + 2,
            opacity: 1
        });
    }
    
    let startTime = null;
    const animate = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const progress = timestamp - startTime;
    
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    
        confetti.forEach((particle) => {
            particle.x += particle.velocityX;
            particle.y += particle.velocityY;
            
            if (particle.x < 0) particle.x = canvas.width;
            if (particle.x > canvas.width) particle.x = 0;
            if (particle.y > canvas.height) particle.y = 0;
    
            const opacity = progress >= duration - 500 
                ? Math.max(0, (duration - progress) / 500)
                : 1;
    
            ctx.globalAlpha = opacity;
            ctx.beginPath();
            ctx.fillStyle = particle.color;
            ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            ctx.fill();
        });
    
        if (progress < duration) {
            requestAnimationFrame(animate);
        } else {
            document.body.removeChild(canvas);
        }
    };
    
    requestAnimationFrame(animate);
}

// Make functions available globally
window.shuffleArray = shuffleArray;
window.reportError = reportError;
window.createConfetti = createConfetti; 