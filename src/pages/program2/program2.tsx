import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { APP_VERSION } from "../../version";

type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";
interface Point {
  x: number;
  y: number;
}

const GRID_SIZE = 20;

const Program2 = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    return Number(localStorage.getItem("canvas_snake_highscore") || "0");
  });
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState<number>(110); // ms per tick

  const snakeRef = useRef<Point[]>([
    { x: 10, y: 10 },
    { x: 9, y: 10 },
    { x: 8, y: 10 },
  ]);
  const foodRef = useRef<Point>({ x: 15, y: 10 });
  const dirRef = useRef<Direction>("RIGHT");
  const nextDirRef = useRef<Direction>("RIGHT");
  const gameOverRef = useRef(false);
  const isPausedRef = useRef(false);

  // Sync state with refs for event handlers
  useEffect(() => {
    gameOverRef.current = gameOver;
  }, [gameOver]);

  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  // Spawn food avoiding snake
  const spawnFood = useCallback((currentSnake: Point[]): Point => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      const collision = currentSnake.some(
        (seg) => seg.x === newFood.x && seg.y === newFood.y
      );
      if (!collision) break;
    }
    return newFood;
  }, []);

  const resetGame = useCallback(() => {
    const initialSnake: Point[] = [
      { x: 10, y: 10 },
      { x: 9, y: 10 },
      { x: 8, y: 10 },
    ];
    snakeRef.current = initialSnake;
    dirRef.current = "RIGHT";
    nextDirRef.current = "RIGHT";
    foodRef.current = spawnFood(initialSnake);
    setScore(0);
    setGameOver(false);
    setIsPaused(false);
  }, [spawnFood]);

  // Change direction safely
  const changeDirection = useCallback((newDir: Direction) => {
    const current = dirRef.current;
    if (newDir === "UP" && current !== "DOWN") nextDirRef.current = "UP";
    if (newDir === "DOWN" && current !== "UP") nextDirRef.current = "DOWN";
    if (newDir === "LEFT" && current !== "RIGHT") nextDirRef.current = "LEFT";
    if (newDir === "RIGHT" && current !== "LEFT") nextDirRef.current = "RIGHT";
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (["ArrowUp", "KeyW"].includes(e.code)) {
        e.preventDefault();
        changeDirection("UP");
      } else if (["ArrowDown", "KeyS"].includes(e.code)) {
        e.preventDefault();
        changeDirection("DOWN");
      } else if (["ArrowLeft", "KeyA"].includes(e.code)) {
        e.preventDefault();
        changeDirection("LEFT");
      } else if (["ArrowRight", "KeyD"].includes(e.code)) {
        e.preventDefault();
        changeDirection("RIGHT");
      } else if (e.code === "Space") {
        e.preventDefault();
        if (gameOverRef.current) {
          resetGame();
        } else {
          setIsPaused((prev) => !prev);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [changeDirection, resetGame]);

  // Game loop tick
  useEffect(() => {
    const interval = setInterval(() => {
      if (gameOverRef.current || isPausedRef.current) return;

      const snake = [...snakeRef.current];
      const head = { ...snake[0] };
      const currentDir = nextDirRef.current;
      dirRef.current = currentDir;

      if (currentDir === "UP") head.y -= 1;
      if (currentDir === "DOWN") head.y += 1;
      if (currentDir === "LEFT") head.x -= 1;
      if (currentDir === "RIGHT") head.x += 1;

      // Wall collision
      if (
        head.x < 0 ||
        head.x >= GRID_SIZE ||
        head.y < 0 ||
        head.y >= GRID_SIZE
      ) {
        setGameOver(true);
        return;
      }

      // Self collision
      if (snake.some((seg) => seg.x === head.x && seg.y === head.y)) {
        setGameOver(true);
        return;
      }

      snake.unshift(head);

      // Check food
      if (head.x === foodRef.current.x && head.y === foodRef.current.y) {
        const newScore = score + 10;
        setScore(newScore);
        if (newScore > highScore) {
          setHighScore(newScore);
          localStorage.setItem("canvas_snake_highscore", String(newScore));
        }
        foodRef.current = spawnFood(snake);
      } else {
        snake.pop();
      }

      snakeRef.current = snake;

      // Render to canvas
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const width = canvas.width;
      const height = canvas.height;
      const cellSize = width / GRID_SIZE;

      // Background
      ctx.fillStyle = "#09090b";
      ctx.fillRect(0, 0, width, height);

      // Subtle grid
      ctx.strokeStyle = "rgba(255, 255, 255, 0.03)";
      ctx.lineWidth = 1;
      for (let i = 0; i <= GRID_SIZE; i++) {
        ctx.beginPath();
        ctx.moveTo(i * cellSize, 0);
        ctx.lineTo(i * cellSize, height);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, i * cellSize);
        ctx.lineTo(width, i * cellSize);
        ctx.stroke();
      }

      // Draw food
      const food = foodRef.current;
      ctx.fillStyle = "#f43f5e";
      ctx.shadowColor = "#f43f5e";
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(
        food.x * cellSize + cellSize / 2,
        food.y * cellSize + cellSize / 2,
        cellSize * 0.4,
        0,
        Math.PI * 2
      );
      ctx.fill();
      ctx.shadowBlur = 0;

      // Draw Snake
      snake.forEach((seg, index) => {
        const isHead = index === 0;
        ctx.fillStyle = isHead ? "#22c55e" : "#16a34a";
        if (isHead) {
          ctx.shadowColor = "#22c55e";
          ctx.shadowBlur = 8;
        } else {
          ctx.shadowBlur = 0;
        }

        const padding = 2;
        ctx.beginPath();
        ctx.roundRect(
          seg.x * cellSize + padding,
          seg.y * cellSize + padding,
          cellSize - padding * 2,
          cellSize - padding * 2,
          isHead ? 6 : 4
        );
        ctx.fill();
        ctx.shadowBlur = 0;
      });
    }, speed);

    return () => clearInterval(interval);
  }, [score, highScore, speed, spawnFood]);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col justify-between">
      {/* Header */}
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
              Program 2: Retro Snake Arcade
            </h1>
            <p className="text-xs text-neutral-500 hidden sm:block">
              Classic grid-based snake engine rendered on HTML5 Canvas
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 text-xs">
            <span className="text-neutral-400">
              Score: <span className="font-mono text-white font-bold">{score}</span>
            </span>
            <span className="text-neutral-600">|</span>
            <span className="text-neutral-400">
              Best:{" "}
              <span className="font-mono text-emerald-400 font-bold">
                {highScore}
              </span>
            </span>
          </div>
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-400">
            v{APP_VERSION}
          </span>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-8 flex flex-col lg:flex-row items-center justify-center gap-8">
        {/* Canvas Display */}
        <div className="relative">
          <div className="p-2 rounded-2xl bg-neutral-900/60 border border-neutral-800 shadow-2xl shadow-indigo-950/20">
            <canvas
              ref={canvasRef}
              width={480}
              height={480}
              className="rounded-xl w-[320px] h-[320px] sm:w-[440px] sm:h-[440px] block bg-neutral-950"
            />
          </div>

          {/* Game Over Overlay */}
          {gameOver && (
            <div className="absolute inset-0 bg-neutral-950/80 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center p-6 text-center animate-fade-in">
              <span className="text-xs font-semibold uppercase tracking-wider text-rose-400 mb-1">
                Collision Detected
              </span>
              <h2 className="text-3xl font-bold text-white mb-2">Game Over</h2>
              <p className="text-sm text-neutral-400 mb-6">
                You scored <span className="font-bold text-white">{score}</span> points!
              </p>
              <button
                onClick={resetGame}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm transition-colors shadow-lg shadow-emerald-950/40"
              >
                Play Again (Space)
              </button>
            </div>
          )}

          {/* Paused Overlay */}
          {isPaused && !gameOver && (
            <div className="absolute inset-0 bg-neutral-950/60 backdrop-blur-xs rounded-2xl flex flex-col items-center justify-center p-6 text-center">
              <h2 className="text-2xl font-bold text-white mb-2">Paused</h2>
              <button
                onClick={() => setIsPaused(false)}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition-colors"
              >
                Resume
              </button>
            </div>
          )}
        </div>

        {/* Controls & Details Panel */}
        <div className="w-full max-w-sm flex flex-col gap-5">
          {/* Controls Box */}
          <div className="p-5 rounded-xl bg-neutral-900/40 border border-neutral-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                Game Settings
              </h3>
              <button
                onClick={resetGame}
                className="text-xs text-neutral-400 hover:text-white transition-colors underline underline-offset-4"
              >
                Restart Game
              </button>
            </div>

            {/* Speed Control */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-neutral-300">
                Difficulty / Speed
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: "Slow", val: 140 },
                  { label: "Normal", val: 100 },
                  { label: "Fast", val: 65 },
                ].map((item) => (
                  <button
                    key={item.label}
                    onClick={() => setSpeed(item.val)}
                    className={`py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                      speed === item.val
                        ? "bg-indigo-600 border-indigo-500 text-white"
                        : "bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-neutral-200"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Virtual D-Pad for Touch/Click */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-medium text-neutral-400 block text-center">
                Directional Controls
              </span>
              <div className="grid grid-cols-3 gap-2 max-w-[180px] mx-auto">
                <div></div>
                <button
                  onClick={() => changeDirection("UP")}
                  className="p-3 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 flex items-center justify-center active:scale-95 transition-transform"
                  aria-label="Up"
                >
                  ▲
                </button>
                <div></div>
                <button
                  onClick={() => changeDirection("LEFT")}
                  className="p-3 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 flex items-center justify-center active:scale-95 transition-transform"
                  aria-label="Left"
                >
                  ◀
                </button>
                <button
                  onClick={() => changeDirection("DOWN")}
                  className="p-3 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 flex items-center justify-center active:scale-95 transition-transform"
                  aria-label="Down"
                >
                  ▼
                </button>
                <button
                  onClick={() => changeDirection("RIGHT")}
                  className="p-3 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 flex items-center justify-center active:scale-95 transition-transform"
                  aria-label="Right"
                >
                  ▶
                </button>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="p-4 rounded-xl bg-neutral-900/30 border border-neutral-800 text-xs text-neutral-400 space-y-1.5">
            <div className="font-semibold text-neutral-200">Keyboard Shortcuts:</div>
            <div className="flex justify-between">
              <span>Move:</span>
              <span className="font-mono text-neutral-300">W, A, S, D / Arrow Keys</span>
            </div>
            <div className="flex justify-between">
              <span>Pause / Resume:</span>
              <span className="font-mono text-neutral-300">Spacebar</span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-800/80 py-4 text-center text-xs text-neutral-500">
        <p>Canvas Playground • Retro Snake Engine</p>
      </footer>
    </div>
  );
};

export default Program2;
