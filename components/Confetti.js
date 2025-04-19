function createConfetti(amount = 200, duration = 2500, colors = ['#fce18a', '#ff726d', '#b484f0', '#f4306d']) {
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none'; // Allow interactions below the canvas
    canvas.style.zIndex = '1000'; // Make sure it's on top
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
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: Math.random() * 0.1 - 0.05,
        opacity: 1, // Initial opacity
      });
    }
  
    let startTime = null;
    const fadeDuration = 500; // 0.5 seconds in milliseconds
  
    function animate(timestamp) {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
  
      ctx.clearRect(0, 0, canvas.width, canvas.height);
  
      confetti.forEach((particle) => {
        particle.x += particle.velocityX;
        particle.y += particle.velocityY;
        particle.rotation += particle.rotationSpeed;
  
        // Wrap around the screen
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y > canvas.height) particle.y = 0;
  
        let currentOpacity = particle.opacity;
        if (progress >= duration - fadeDuration) {
          // Calculate opacity based on remaining time
          const remaining = duration - progress;
          currentOpacity = Math.max(0, remaining / fadeDuration); // Ensure opacity doesn't go below 0
          particle.opacity = currentOpacity; //update particle's opacity.
        }
  
        ctx.globalAlpha = currentOpacity; // Set the opacity
        ctx.beginPath();
        ctx.fillStyle = particle.color;
        ctx.ellipse(particle.x, particle.y, particle.radius, particle.radius, particle.rotation, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1; // Reset opacity for other drawings (if any)
      });
  
      if (progress < duration) {
        requestAnimationFrame(animate);
      } else {
        document.body.removeChild(canvas); // Remove the canvas when done
      }
    }
  
    requestAnimationFrame(animate);
}

// Make the function available globally
window.createConfetti = createConfetti;
  