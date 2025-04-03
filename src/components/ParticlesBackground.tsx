import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  radius: number;
  color: string;
  speedX: number;
  speedY: number;
  alpha: number;
}

interface ParticlesBackgroundProps {
  particleCount?: number;
  colorLight?: string;
  colorDark?: string;
  minRadius?: number;
  maxRadius?: number;
  minSpeed?: number;
  maxSpeed?: number;
  zIndex?: number;
}

const ParticlesBackground: React.FC<ParticlesBackgroundProps> = ({
  particleCount = 50,
  colorLight = '#10b981',
  colorDark = '#059669',
  minRadius = 1,
  maxRadius = 4,
  minSpeed = 0.2,
  maxSpeed = 0.8,
  zIndex = -1
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const animationFrameId = useRef<number | null>(null);
  const isDarkMode = useRef<boolean>(false);

  useEffect(() => {
    const checkTheme = () => {
      isDarkMode.current = document.documentElement.getAttribute('data-theme') === 'dark';
    };

    // Check initial theme
    checkTheme();

    // Add observer to detect theme changes
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.attributeName === 'data-theme') {
          checkTheme();
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true });

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    const initParticles = () => {
      particles.current = [];
      for (let i = 0; i < particleCount; i++) {
        particles.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * (maxRadius - minRadius) + minRadius,
          color: Math.random() > 0.5 ? colorLight : colorDark,
          speedX: (Math.random() - 0.5) * (maxSpeed - minSpeed) + minSpeed,
          speedY: (Math.random() - 0.5) * (maxSpeed - minSpeed) + minSpeed,
          alpha: Math.random() * 0.5 + 0.2
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = 'lighter';

      particles.current.forEach(particle => {
        ctx.beginPath();
        const gradient = ctx.createRadialGradient(
          particle.x,
          particle.y,
          0,
          particle.x,
          particle.y,
          particle.radius
        );
        gradient.addColorStop(0, `${particle.color}${Math.floor(particle.alpha * 255).toString(16).padStart(2, '0')}`);
        gradient.addColorStop(1, `${particle.color}00`);
        ctx.fillStyle = gradient;
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // Connect nearby particles with lines
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = isDarkMode.current ? 'rgba(16, 185, 129, 0.05)' : 'rgba(5, 150, 105, 0.03)';
      ctx.lineWidth = 0.5;

      for (let i = 0; i < particles.current.length; i++) {
        for (let j = i + 1; j < particles.current.length; j++) {
          const p1 = particles.current[i];
          const p2 = particles.current[j];
          const distance = Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
          
          if (distance < 100) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }
    };

    const update = () => {
      particles.current.forEach(particle => {
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        // Bounce off walls
        if (particle.x < 0 || particle.x > canvas.width) {
          particle.speedX *= -1;
        }
        if (particle.y < 0 || particle.y > canvas.height) {
          particle.speedY *= -1;
        }
      });

      draw();
      animationFrameId.current = requestAnimationFrame(update);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    update();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [colorLight, colorDark, particleCount, minRadius, maxRadius, minSpeed, maxSpeed]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex }}
    />
  );
};

export default ParticlesBackground; 