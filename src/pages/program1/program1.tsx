import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { APP_VERSION } from "../../version";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
}

const Program1 = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const animFrameId = useRef<number | null>(null);

  const [particleCount, setParticleCount] = useState<number>(75);
  const [connectDist, setConnectDist] = useState<number>(120);
  const [interactionMode, setInteractionMode] = useState<"repel" | "attract" | "none">("repel");
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [fps, setFps] = useState<number>(60);

  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef<{ x: number; y: number; isInside: boolean }>({
    x: 0,
    y: 0,
    isInside: false,
  });

  const lastFrameTimeRef = useRef<number>(0);
  const frameCountRef = useRef<number>(0);

  // Initialize particles
  const initParticles = (width: number, height: number, count: number) => {
    const colors = ["#818cf8", "#c084fc", "#38bdf8", "#34d399", "#f472b6"];
    const arr: Particle[] = [];
    for (let i = 0; i < count; i++) {
      arr.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
        radius: Math.random() * 2 + 1.5,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }
    particlesRef.current = arr;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);

      // if particles are empty or out of bounds, re-init
      if (particlesRef.current.length === 0) {
        initParticles(rect.width, rect.height, particleCount);
      }
    };

    lastFrameTimeRef.current = performance.now();
    resize();
    window.addEventListener("resize", resize);

    const render = () => {
      const rect = container.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      // FPS tracking
      const now = performance.now();
      frameCountRef.current++;
      if (now - lastFrameTimeRef.current >= 1000) {
        setFps(frameCountRef.current);
        frameCountRef.current = 0;
        lastFrameTimeRef.current = now;
      }

      ctx.fillStyle = "#09090b";
      ctx.fillRect(0, 0, width, height);

      const particles = particlesRef.current;
      const mouse = mouseRef.current;

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectDist) {
            const alpha = 1 - dist / connectDist;
            ctx.strokeStyle = `rgba(147, 197, 253, ${alpha * 0.25})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Update and draw particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (!isPaused) {
          // Mouse interaction
          if (mouse.isInside && interactionMode !== "none") {
            const mdx = mouse.x - p.x;
            const mdy = mouse.y - p.y;
            const mDist = Math.sqrt(mdx * mdx + mdy * mdy);
            const maxEffectDist = 160;

            if (mDist < maxEffectDist && mDist > 0) {
              const force = (1 - mDist / maxEffectDist) * 2;
              const angle = Math.atan2(mdy, mdx);
              const dir = interactionMode === "repel" ? -1 : 1;

              p.vx += Math.cos(angle) * force * dir * 0.2;
              p.vy += Math.sin(angle) * force * dir * 0.2;
            }
          }

          // Speed limit / damping
          const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
          if (speed > 4) {
            p.vx = (p.vx / speed) * 4;
            p.vy = (p.vy / speed) * 4;
          }

          p.x += p.vx;
          p.y += p.vy;

          // Wall bounces
          if (p.x < p.radius) {
            p.x = p.radius;
            p.vx *= -1;
          } else if (p.x > width - p.radius) {
            p.x = width - p.radius;
            p.vx *= -1;
          }
          if (p.y < p.radius) {
            p.y = p.radius;
            p.vy *= -1;
          } else if (p.y > height - p.radius) {
            p.y = height - p.radius;
            p.vy *= -1;
          }
        }

        // Draw particle
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      animFrameId.current = requestAnimationFrame(render);
    };

    animFrameId.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", resize);
      if (animFrameId.current) {
        cancelAnimationFrame(animFrameId.current);
      }
    };
  }, [particleCount, connectDist, interactionMode, isPaused]);

  // Handle particle count change
  const handleParticleCountChange = (newCount: number) => {
    setParticleCount(newCount);
    const container = containerRef.current;
    if (container) {
      const rect = container.getBoundingClientRect();
      initParticles(rect.width, rect.height, newCount);
    }
  };

  const handleReset = () => {
    const container = containerRef.current;
    if (container) {
      const rect = container.getBoundingClientRect();
      initParticles(rect.width, rect.height, particleCount);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      isInside: true,
    };
  };

  const handleMouseLeave = () => {
    mouseRef.current.isInside = false;
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col justify-between">
      {/* Top Header Navigation */}
      <header className="border-b border-neutral-800 bg-neutral-950/80 backdrop-blur-md px-6 h-16 flex items-center justify-between z-10">
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="flex items-center gap-2 text-sm text-neutral-400 hover:text-white transition-colors group"
          >
            <span className="p-1 rounded bg-neutral-900 border border-neutral-800 group-hover:border-neutral-700 transition-colors">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
                />
              </svg>
            </span>
            <span>Back</span>
          </Link>
          <div className="h-4 w-px bg-neutral-800"></div>
          <div>
            <h1 className="text-sm font-semibold text-white">
              Program 1: Particle Constellation
            </h1>
            <p className="text-xs text-neutral-500 hidden sm:block">
              Interactive kinetic particle mesh & proximity network
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-400">
            {fps} FPS
          </span>
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-400">
            v{APP_VERSION}
          </span>
        </div>
      </header>

      {/* Canvas & Controls Container */}
      <div className="flex-1 flex flex-col md:flex-row relative overflow-hidden">
        {/* Main Canvas Area */}
        <div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="flex-1 w-full h-[60vh] md:h-auto relative cursor-crosshair overflow-hidden"
        >
          <canvas ref={canvasRef} className="w-full h-full block" />
        </div>

        {/* Sidebar Controls */}
        <div className="w-full md:w-80 border-t md:border-t-0 md:border-l border-neutral-800 bg-neutral-900/40 p-6 flex flex-col gap-6 overflow-y-auto">
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1">
              Simulation Controls
            </h2>
            <p className="text-xs text-neutral-500">
              Tune simulation dynamics and cursor interactions
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPaused(!isPaused)}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium border transition-colors flex items-center justify-center gap-2 ${
                isPaused
                  ? "bg-amber-600/20 border-amber-500/30 text-amber-300 hover:bg-amber-600/30"
                  : "bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border-neutral-700"
              }`}
            >
              {isPaused ? "Resume" : "Pause"}
            </button>
            <button
              onClick={handleReset}
              className="py-2 px-3 rounded-lg text-xs font-medium bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border border-neutral-700 transition-colors"
            >
              Reset
            </button>
          </div>

          {/* Interaction Mode */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-neutral-300">
              Mouse Force Mode
            </label>
            <div className="grid grid-cols-3 gap-1.5 p-1 bg-neutral-950 rounded-lg border border-neutral-800">
              {(["repel", "attract", "none"] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setInteractionMode(mode)}
                  className={`py-1.5 text-xs font-medium rounded-md capitalize transition-colors ${
                    interactionMode === mode
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "text-neutral-400 hover:text-neutral-200"
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          {/* Particle Count */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-neutral-300">Particle Count</span>
              <span className="font-mono text-neutral-400">{particleCount}</span>
            </div>
            <input
              type="range"
              min="20"
              max="160"
              step="5"
              value={particleCount}
              onChange={(e) => handleParticleCountChange(Number(e.target.value))}
              className="w-full accent-indigo-500"
            />
          </div>

          {/* Connection Distance */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-neutral-300">Link Distance</span>
              <span className="font-mono text-neutral-400">{connectDist}px</span>
            </div>
            <input
              type="range"
              min="50"
              max="220"
              step="10"
              value={connectDist}
              onChange={(e) => setConnectDist(Number(e.target.value))}
              className="w-full accent-indigo-500"
            />
          </div>

          {/* Info Card */}
          <div className="mt-auto p-3.5 rounded-xl bg-neutral-950/80 border border-neutral-800 text-xs text-neutral-400 leading-relaxed space-y-1">
            <div className="font-semibold text-neutral-200">How it works:</div>
            <div>
              Each particle has velocity vectors that bounce off boundaries. Lines
              are drawn dynamically using Pythagorean distance calculation when
              particles enter proximity radius.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Program1;
