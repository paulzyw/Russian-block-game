# TetraFlow // Modern Arcade Blocks

TetraFlow is a production-ready, high-performance block puzzle game built with TypeScript, React, and HTML5 Canvas. It features a futuristic arcade aesthetic, responsive design, and an extensible game engine.

## 🚀 Features

- **Core Gameplay**: Classic block physics with Ghost Piece, Hold, and Next Preview functionalities.
- **Modern UI**: Futuristic neon aesthetic with polished animations using Framer Motion.
- **Mobile First**: Fluid touch controls including swipes and a dedicated control pad.
- **Advanced Systems**: 
  - Progressive difficulty leveling.
  - T-Spin detection (base).
  - Combo scoring system.
  - Particle effects on line clears.
- **Performance**: 60 FPS guaranteed by a fixed-timestep game loop.
- **Offline Support**: Fully functional PWA with Service Worker caching for offline play.

## 🛠 Tech Stack

- **Framework**: React 19 + Vite
- **Language**: TypeScript (Strict Mode)
- **State Management**: Zustand
- **Rendering**: HTML5 Canvas (2D Context)
- **Animation**: Framer Motion
- **Sfx**: Web Audio API (Synthesized tones)
- **Styling**: TailwindCSS 4

## 📁 Architecture

- `/src/engine`: Core agnostic logic (Loop, Input, Sound).
- `/src/game`: Domain-specific rules (TetrisEngine, Pieces, Scoring).
- `/src/store`: Global state management with Zustand.
- `/src/ui`: Reusable React components and layout.
- `/src/hooks`: Integration hooks for the game loop and logic.

## 📦 Deployment

### GitHub Actions
The project includes a CI/CD workflow `.github/workflows/deploy.yml` that automatically deploys to Wasmer.io on every push to `main`.

### Wasmer.io
To deploy manually:
1. Install Wasmer CLI: `curl https://get.wasmer.io -sSfL | sh`
2. Run `wasmer deploy`

## 🎮 Controls

| Action | Desktop | Mobile |
|--------|---------|--------|
| Move | Arrows / WASD | Swipe / Buttons |
| Rotate | Up Arrow / W | Tap / Button |
| Hard Drop | Space | Button |
| Soft Drop | Down Arrow / S | Swipe Down / Button |
| Hold Piece | Shift | Button |
| Pause | ESC / P | Menu |

## 🧬 Future Enhancements

- **Global Leaderboard**: Integrate a backend for persistent global scores.
- **Skins**: Add a shop for block skins and trail effects.
- **Rhythm Mode**: Synchronize game speed and visuals with background music beats.

---
Built with ❤️ for the Modern Web.
