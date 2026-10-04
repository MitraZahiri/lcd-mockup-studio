# Contributing to LCD Mockup Studio

Thank you for your interest in contributing to **LCD Mockup Studio**! We welcome community contributions, bug reports, feature requests, and pull requests.

## 🚀 Quickstart Development Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/MitraZahiri/lcd-mockup-studio.git
   cd lcd-mockup-studio
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the local dev server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

4. **Run the test suite**:
   ```bash
   npm test
   ```
   All tests run via Node.js native test runner (`node --test`).

5. **Build for production**:
   ```bash
   npm run build
   ```

---

## 🛠️ Architecture Overview

- **Zero-Backend Philosophy**: Everything runs 100% client-side in the browser. No server database, user tracking, or backend telemetry.
- **`src/editor/`**: Core canvas rendering, display state management, geometry stencils, and live hardware simulation.
- **`src/analysis/`**: Computer vision and OCR pipeline for LCD photo vectorization.
- **`src/export/`**: Microcontroller C headers (Adafruit_GFX, U8g2, XBM), Arduino sketches, MicroPython scripts, SVG, and PNG exporters.
- **`src/project/`**: Project file serialization (`.lcd.json`) and URL permalink hash compression (`CompressionStream('deflate-raw')`).

---

## 🤝 Pull Request Guidelines

1. **Branch Naming**: Use descriptive prefixes such as `feature/my-feature`, `fix/issue-description`, or `docs/update-guide`.
2. **Tests**: Ensure all existing tests pass (`npm test`) and add new unit tests for any new modules or algorithms.
3. **Clean Code**: Follow vanilla modern JavaScript conventions without heavy external framework bloat.
4. **Commits**: Use concise, conventional commit messages (e.g. `feat: add ST7735 display preset`, `fix: clamp coordinate resizing`).

Thank you for helping make embedded display prototyping faster and more enjoyable for makers, engineers, and designers!
