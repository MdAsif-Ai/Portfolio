import { useRef, useEffect } from 'react';

const LetterGlitch = ({
  glitchColors = ['#0F0'], // Fallback if needed, but we'll use Matrix green
  className = '',
  centerVignette = false,
  outerVignette = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const context = useRef<CanvasRenderingContext2D | null>(null);
  const drops = useRef<number[]>([]);

  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$+-*/=%"\'#&_(),.;:?!\\|{}<>[]^~ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍ';
  const alphabet = letters.split('');
  const fontSize = 16;

  const resizeCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;

    const rect = parent.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    
    // Fill the background initially
    if (context.current) {
      context.current.fillStyle = '#000';
      context.current.fillRect(0, 0, canvas.width, canvas.height);
    }

    const columns = Math.ceil(rect.width / fontSize);
    
    // Only initialize new columns if the screen gets wider
    if (columns > drops.current.length) {
      const maxRows = Math.ceil(rect.height / fontSize);
      for (let x = drops.current.length; x < columns; x++) {
        // Start randomly anywhere from off-screen top to the bottom of the screen
        // so the screen is immediately populated with matrix rain
        drops.current[x] = Math.floor(Math.random() * maxRows) - 10; 
      }
    }
  };

  const draw = () => {
    if (!context.current || !canvasRef.current) return;
    const ctx = context.current;
    const canvas = canvasRef.current;

    // Fading effect for trails - the lower the alpha, the longer the trail
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = `${fontSize}px monospace`;
    ctx.textAlign = 'center';

    for (let i = 0; i < drops.current.length; i++) {
      const x = i * fontSize + (fontSize / 2);
      const y = drops.current[i] * fontSize;

      // Draw the trailing character in green (overwriting the previous white head)
      const trailChar = alphabet[Math.floor(Math.random() * alphabet.length)];
      ctx.fillStyle = '#0F0';
      ctx.fillText(trailChar, x, y - fontSize);

      // Draw the new head in white
      const headChar = alphabet[Math.floor(Math.random() * alphabet.length)];
      ctx.fillStyle = '#FFF';
      // Add a subtle glow to the head
      ctx.shadowBlur = 8;
      ctx.shadowColor = '#FFF';
      ctx.fillText(headChar, x, y);
      ctx.shadowBlur = 0;

      // Reset drops that fall off screen with a random delay
      if (y > canvas.height && Math.random() > 0.975) {
        drops.current[i] = 0;
      }

      drops.current[i]++;
    }
  };

  const animate = () => {
    draw();
    // Using setTimeout to control the framerate for a retro feel (around 30fps)
    // requestAnimationFrame alone can be too fast for this effect on modern screens
    setTimeout(() => {
      animationRef.current = requestAnimationFrame(animate);
    }, 33);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    context.current = canvas.getContext('2d');
    
    // Initial setup
    resizeCanvas();
    animate();

    const handleResize = () => {
      resizeCanvas();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const containerStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0, left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: '#000',
    overflow: 'hidden',
    zIndex: 0
  };

  const canvasStyle: React.CSSProperties = {
    display: 'block',
    width: '100%',
    height: '100%'
  };

  const outerVignetteStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0, left: 0, width: '100%', height: '100%',
    pointerEvents: 'none',
    background: 'radial-gradient(circle, rgba(0,0,0,0) 50%, rgba(0,0,0,0.8) 100%)'
  };

  const centerVignetteStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0, left: 0, width: '100%', height: '100%',
    pointerEvents: 'none',
    background: 'radial-gradient(circle, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 60%)'
  };

  return (
    <div style={containerStyle} className={className}>
      <canvas ref={canvasRef} style={canvasStyle} />
      {outerVignette && <div style={outerVignetteStyle}></div>}
      {centerVignette && <div style={centerVignetteStyle}></div>}
    </div>
  );
};

export default LetterGlitch;
