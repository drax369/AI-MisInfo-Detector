import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import Analyzer from './components/Analyzer';
import History from './components/History';
import SharePage from './components/SharePage';

function ParticleCanvas() {
  const canvasRef = useRef();
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animId;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);
    const particles = Array.from({ length: 80 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 1.5 + 0.3,
      dx: (Math.random() - 0.5) * 0.3,
      dy: (Math.random() - 0.5) * 0.3,
      color: Math.random() > 0.5 ? '#00e5ff' : '#a855f7',
      alpha: Math.random() * 0.4 + 0.1,
    }));
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.dx; p.y += p.dy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
      });
      ctx.globalAlpha = 1;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = '#00e5ff';
            ctx.globalAlpha = (1 - dist / 120) * 0.08;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={canvasRef} className="bg-canvas" />;
}

function AIRobotMascot() {
  return (
    <div className="mascot">
      <svg viewBox="0 0 90 90" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bodyGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#00e5ff"/>
            <stop offset="100%" stopColor="#a855f7"/>
          </linearGradient>
          <linearGradient id="headGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#a855f7"/>
            <stop offset="100%" stopColor="#ff2d78"/>
          </linearGradient>
        </defs>
        <rect x="22" y="44" width="46" height="36" rx="14" fill="url(#bodyGrad)" opacity="0.9"/>
        <rect x="28" y="16" width="34" height="30" rx="12" fill="url(#headGrad)" opacity="0.95"/>
        <circle cx="38" cy="30" r="4" fill="#030818" opacity="0.8"/>
        <circle cx="52" cy="30" r="4" fill="#030818" opacity="0.8"/>
        <circle cx="39" cy="29" r="1.5" fill="#00e5ff"/>
        <circle cx="53" cy="29" r="1.5" fill="#00e5ff"/>
        <line x1="45" y1="16" x2="45" y2="8" stroke="#00e5ff" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="45" cy="6" r="3" fill="#00e5ff" opacity="0.8"/>
        <rect x="36" y="54" width="18" height="8" rx="4" fill="rgba(3,8,24,0.4)"/>
        <rect x="38" y="56" width="14" height="4" rx="2" fill="#00e5ff" opacity="0.6"/>
      </svg>
    </div>
  );
}

function App() {
  const [activeTab, setActiveTab] = useState('analyze');
  const [selectedHistory, setSelectedHistory] = useState(null);

  const path = window.location.pathname;
  const shareMatch = path.match(/^\/result\/(.+)$/);

  const handleHistorySelect = (item) => {
    setSelectedHistory(item);
    setActiveTab('analyze');
  };

  if (shareMatch) {
    return (
      <div className="App">
        <ParticleCanvas />
        <header>
          <AIRobotMascot />
          <div className="mascot-reflection" />
          <h1>Misinfo Detector</h1>
          <p>AI-powered credibility analysis engine</p>
          <div className="header-glow-line" />
        </header>
        <main>
          <SharePage id={shareMatch[1]} />
        </main>
      </div>
    );
  }

  return (
    <div className="App">
      <ParticleCanvas />
      <header>
        <AIRobotMascot />
        <div className="mascot-reflection" />
        <h1>Misinfo Detector</h1>
        <p>AI-powered credibility analysis engine</p>
        <div className="header-glow-line" />
      </header>

      <div className="main-tabs">
        <button
          className={`main-tab ${activeTab === 'analyze' ? 'active' : ''}`}
          onClick={() => setActiveTab('analyze')}
        >
          Analyze
        </button>
        <button
          className={`main-tab ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          History
        </button>
      </div>

      <main>
        {activeTab === 'analyze' ? (
          <Analyzer prefill={selectedHistory} />
        ) : (
          <History onSelect={handleHistorySelect} />
        )}
      </main>
    </div>
  );
}

export default App;