# Canvas Playground

An interactive creative coding playground for experimenting with HTML5 Canvas algorithms, games, and visual simulations — from particle systems and classic retro games to procedural maze generators and pathfinding algorithms.

🔗 **Live Deployment**: [canvas.abhiseck.dev](https://canvas.abhiseck.dev)

---

## 🎨 Features & Pages

- **`/` (Landing Page)**: Minimalist dark-themed dashboard showcasing available and upcoming canvas experiments, animated hero canvas, and live version indicator.
- **`/contact`**: Author information (Abhiseck Bhattacharya), direct email copying, project links, and social links.
- **`/program1`**: **Particle Constellation** — Interactive proximity-linked particle mesh with cursor repulsion, attraction physics, connection distance sliders, and FPS tracking.
- **`/program2`**: **Retro Snake Arcade** — Classic grid-based snake engine with real-time collision detection, score tracking, high score persistence, and difficulty/speed presets.

---

## 🛠️ Tech Stack

- **Framework**: React 19 + TypeScript
- **Bundler**: Vite 8 with React Compiler
- **Routing**: [wouter](https://github.com/molefrog/wouter) (~1.5KB lightweight router)
- **Styling**: Tailwind CSS v4
- **Linter**: Oxlint
- **Deployment**: GitHub Pages (`release` branch with SPA fallback)

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```

### 3. Build Production Bundle
```bash
npm run build
```

### 4. Lint Code
```bash
npm run lint
```

---

## 📦 Automated Release & Deployment to GitHub Pages

A dedicated release pipeline is included to automatically increment the version, compile the project, generate GitHub Pages SPA routing fallback (`404.html` and `CNAME`), and deploy the build to the `release` branch:

```bash
# Bump patch version (e.g. v0.1.0 -> v0.1.1) and deploy to 'release' branch:
npm run release

# Or specify bump type (minor, major, or patch):
bash scripts/release.sh minor
```

### Pushing to GitHub
After running the release script, push your updated main branch with tags and the release branch:
```bash
git push origin main --tags
git push origin release
```

### GitHub Pages Settings
1. Go to your repository **Settings** > **Pages**.
2. Under **Build and deployment** > **Source**, choose **Deploy from a branch**.
3. Select branch **`release`** and folder **`/ (root)`**, then click **Save**.
