# Proton Notes

A premium, local-first note-taking application built with React, Vite, and Electron. Featuring a sleek "Proton" aesthetic with dark visuals and smooth performance.

![Proton Notes Screenshot](https://placehold.co/600x400/0f172a/ffffff?text=Proton+Notes+Preview)

## Features

- **Dual-Mode Architecture**:
  - 🌐 **Web App**: Accessible as a standard SPA (Single Page Application).
  - 🖥️ **Desktop App**: High-performance Electron application for Windows.
- **Local-First Storage**: Notes are persisted instantly to local storage.
- **Modern UI**: Built with Tailwind CSS v4, utilizing a "slate" dark mode palette and linear gradients.
- **Responsive Design**: Fluid sidebar and editor layout.

## Tech Stack

- **Core**: [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Desktop**: [Electron](https://www.electronjs.org/), [Electron Builder](https://www.electron.build/)

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or pnpm

### Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/nbfrodri/proton-notes.git
cd proton-notes
npm install
```

### Development

**Run Web Version:**

```bash
npm run dev
```

**Run Desktop Version:**

```bash
npm run electron:dev
```

## Building

### Web Build

Compiles the SPA for deployment (e.g., GitHub Pages, Vercel).

```bash
npm run build
```

Output: `dist/`

### Desktop Build (Executable)

Compiles the Electron app and generates an installer `.exe`.

```bash
npm run dist
```

Output: `release/`

- Installer: `Proton Notes Setup 0.0.0.exe`
- Portable: `release/win-unpacked/Proton Notes.exe`

## Deployment

### GitHub Pages

This project is configured to deploy to GitHub Pages.

```bash
npm run deploy
```

## Contributing

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
