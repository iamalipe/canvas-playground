import { useEffect, useRef } from "react";
import { Link } from "wouter";
import { APP_VERSION } from "../../version";

const LandingPage = () => {
  const heroCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Set page title for SEO
  useEffect(() => {
    document.title =
      "Canvas Playground | Interactive HTML5 Canvas Experiments & Algorithms";
  }, []);

  // Subtle interactive generative background canvas in hero
  useEffect(() => {
    const canvas = heroCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 800);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 400);

    const onResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener("resize", onResize);

    // Mouse tracking for subtle wave influence
    let mouse = { x: width / 2, y: height / 2, active: false };
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        active: true,
      };
    };
    const handleMouseLeave = () => {
      mouse.active = false;
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    // Grid points for subtle animated wave mesh
    const cols = 28;
    const rows = 14;
    let time = 0;

    const render = () => {
      time += 0.02;
      ctx.clearRect(0, 0, width, height);

      const dx = width / cols;
      const dy = height / rows;

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const baseX = i * dx + dx / 2;
          const baseY = j * dy + dy / 2;

          // Distance to mouse
          let offset = Math.sin(time + (i + j) * 0.3) * 6;
          if (mouse.active) {
            const mdx = mouse.x - baseX;
            const mdy = mouse.y - baseY;
            const dist = Math.sqrt(mdx * mdx + mdy * mdy);
            if (dist < 150) {
              offset += (1 - dist / 150) * 16 * Math.cos(time * 2);
            }
          }

          const radius = Math.max(1, 1.8 + Math.sin(time + i * 0.2) * 0.8);

          ctx.fillStyle = `rgba(129, 140, 248, ${0.15 + (offset + 6) * 0.02})`;
          ctx.beginPath();
          ctx.arc(baseX, baseY + offset, radius, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", onResize);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animId);
    };
  }, []);

  const programs = [
    {
      id: "program1",
      path: "/program1",
      title: "Program 1: Particle Constellation",
      badge: "Interactive",
      badgeColor: "bg-indigo-950 text-indigo-300 border-indigo-800/60",
      description:
        "Proximity-linked kinetic particles responding to dynamic cursor repulsion, attraction physics, and collision boundaries.",
      tags: ["Physics", "Particles", "Math"],
      isLive: true,
    },
    {
      id: "program2",
      path: "/program2",
      title: "Program 2: Retro Snake Arcade",
      badge: "Playable",
      badgeColor: "bg-emerald-950 text-emerald-300 border-emerald-800/60",
      description:
        "Grid-based retro Snake game engine rendered on HTML5 canvas with real-time collision detection, score tracking, and custom speeds.",
      tags: ["Game Dev", "Grid", "Arcade"],
      isLive: true,
    },
    {
      id: "maze",
      path: "#",
      title: "Maze Generation Visualizer",
      badge: "Roadmap",
      badgeColor: "bg-neutral-800 text-neutral-400 border-neutral-700",
      description:
        "Procedural labyrinth creation exploring randomized depth-first search (DFS) with backtracking, Kruskal's, and Prim's algorithms.",
      tags: ["Algorithms", "Procedural", "Graph"],
      isLive: false,
    },
    {
      id: "pathfinding",
      path: "#",
      title: "Pathfinding Algorithm Lab",
      badge: "Roadmap",
      badgeColor: "bg-neutral-800 text-neutral-400 border-neutral-700",
      description:
        "Interactive comparison of Dijkstra, A* (A-Star), and Breadth-First Search navigating dynamic obstacle maps with heuristic weights.",
      tags: ["AI", "Pathfinding", "A*"],
      isLive: false,
    },
  ];

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col justify-between selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Navigation Header */}
      <header className="border-b border-neutral-800/80 bg-neutral-950/70 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md shadow-indigo-500/20">
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0 1 12 15a9.065 9.065 0 0 1-6.23-.693L5 14.5"
                />
              </svg>
            </div>
            <span className="font-bold tracking-tight text-white">
              Canvas Playground
            </span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-400 font-mono">
              v{APP_VERSION}
            </span>
          </div>

          {/* Nav Links */}
          <nav className="flex items-center gap-4 text-sm">
            <a
              href="#experiments"
              className="text-neutral-400 hover:text-white transition-colors hidden sm:block"
            >
              Experiments
            </a>
            <Link
              to="/contact"
              className="text-neutral-400 hover:text-white transition-colors"
            >
              Contact
            </Link>
            <a
              href="https://www.linkedin.com/in/abhiseck/"
              target="_blank"
              rel="noreferrer"
              className="p-1.5 rounded-lg text-neutral-400 hover:text-blue-400 hover:bg-neutral-900 border border-transparent hover:border-neutral-800 transition-colors"
              title="LinkedIn Profile"
            >
              <svg className="w-5 h-5 fill-current">
                <use href="/icons.svg#linkedin-icon" />
              </svg>
            </a>
            <a
              href="https://github.com/iamalipe/canvas-playground"
              target="_blank"
              rel="noreferrer"
              className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-900 border border-transparent hover:border-neutral-800 transition-colors"
              title="GitHub Repository"
            >
              <svg className="w-5 h-5 fill-current">
                <use href="/icons.svg#github-icon" />
              </svg>
            </a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative border-b border-neutral-800/80 overflow-hidden py-16 sm:py-24">
        {/* Generative Canvas Element in Background */}
        <canvas
          ref={heroCanvasRef}
          className="absolute inset-0 w-full h-full pointer-events-auto opacity-70"
        />

        {/* Ambient Gradient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative max-w-4xl mx-auto px-6 text-center space-y-6 pointer-events-none">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-neutral-900/90 border border-neutral-800 text-neutral-300 backdrop-blur pointer-events-auto">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            HTML5 Canvas • Algorithmic Sandbox • v{APP_VERSION}
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white">
            Playground for{" "}
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Canvas Experiments
            </span>
          </h1>

          <p className="text-base sm:text-lg text-neutral-400 max-w-2xl mx-auto leading-relaxed">
            A modular creative coding space for building and benchmarking small
            canvas applications — ranging from classic arcade games like Snake to
            procedural maze generators, pathfinding algorithms, and kinetic particle
            simulations.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2 pointer-events-auto">
            <a
              href="#experiments"
              className="px-5 py-2.5 rounded-xl bg-white hover:bg-neutral-200 text-neutral-950 font-medium text-sm transition-colors shadow-lg shadow-white/5"
            >
              Explore Programs
            </a>
            <Link
              to="/program1"
              className="px-5 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-200 font-medium text-sm border border-neutral-800 transition-colors"
            >
              Launch Program 1
            </Link>
            <Link
              to="/contact"
              className="px-5 py-2.5 rounded-xl bg-transparent hover:bg-neutral-900/60 text-neutral-400 hover:text-white font-medium text-sm transition-colors"
            >
              Contact Creator
            </Link>
          </div>
        </div>
      </section>

      {/* Programs & Experiments Grid */}
      <section id="experiments" className="max-w-6xl mx-auto px-6 py-16 flex-1 w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
              Interactive Catalog
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">
              Canvas Programs & Experiments
            </h2>
          </div>
          <p className="text-xs text-neutral-500 max-w-xs sm:text-right">
            Select a program to run its live simulation or test its interactive
            canvas mechanics.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {programs.map((prog) => (
            <div
              key={prog.id}
              className={`rounded-2xl border p-6 flex flex-col justify-between transition-all duration-200 ${
                prog.isLive
                  ? "bg-neutral-900/50 border-neutral-800 hover:border-neutral-700 hover:bg-neutral-900/80 shadow-sm"
                  : "bg-neutral-950/40 border-neutral-850 opacity-75"
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full border font-medium ${prog.badgeColor}`}
                  >
                    {prog.badge}
                  </span>
                  <div className="flex gap-1.5">
                    {prog.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[11px] px-2 py-0.5 rounded bg-neutral-950 border border-neutral-800 text-neutral-400 font-mono"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-white mb-2">
                  {prog.title}
                </h3>
                <p className="text-sm text-neutral-400 leading-relaxed mb-6">
                  {prog.description}
                </p>
              </div>

              <div className="pt-4 border-t border-neutral-800/60 flex items-center justify-between">
                {prog.isLive ? (
                  <Link
                    to={prog.path}
                    className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors group"
                  >
                    <span>Launch Program</span>
                    <span className="transition-transform group-hover:translate-x-1">
                      →
                    </span>
                  </Link>
                ) : (
                  <span className="text-xs text-neutral-500 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-neutral-600"></span>
                    Planned in upcoming release
                  </span>
                )}

                <span className="text-xs text-neutral-600 font-mono">
                  {prog.isLive ? prog.path : "in-dev"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-800/80 bg-neutral-950 py-8 text-neutral-500 text-xs">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-neutral-300">
              Canvas Playground
            </span>
            <span>•</span>
            <span>Created by Abhiseck Bhattacharya</span>
          </div>

          <div className="flex items-center gap-5">
            <a
              href="https://www.linkedin.com/in/abhiseck/"
              target="_blank"
              rel="noreferrer"
              className="hover:text-blue-400 transition-colors"
            >
              LinkedIn
            </a>
            <Link to="/contact" className="hover:text-neutral-300 transition-colors">
              Contact
            </Link>
            <a
              href="https://github.com/iamalipe/canvas-playground"
              target="_blank"
              rel="noreferrer"
              className="hover:text-neutral-300 transition-colors"
            >
              GitHub
            </a>
            <span className="px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-400 font-mono">
              v{APP_VERSION}
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
