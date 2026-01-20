# NBF Notes

A modern, desktop-based note-taking application built with **Electron**, **React**, **TypeScript**, and **Vite**.

> **Note**: This project was built by an **Agentic AI** (Google DeepMind) with a human-in-the-loop workflow.

## Tech Stack

- **Framework**: Electron (v40)
- **Frontend**: React (v19) + Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS (v4)
- **Editor**: TipTap (Rich Text, Task Lists, Image Support)
- **Storage**: Local File System (JSON for notes, local images)

## Features

- 📝 **Rich Text Editing**: Bold, Italic, Headings, Lists, Quotes, Code Blocks.
- ✅ **Task Lists**: Manage to-do lists within your notes.
- 🖼️ **Image Support**: Upload and organize image collections with custom names.
- 🌓 **Dark Mode**: Sleek, slate-based dark theme.
- ⚡ **Fast & Local**: Runs locally on your machine, your data stays properly yours.
- 🎨 **Modern Design**: Minimalist aesthetic with "NBF Notes" branding.

## Development

### Prerequisites

- Node.js (v20+)
- npm

### Setup

```bash
npm install
```

### Run Locally

To run the app with full Electron capabilities (filesystem access):

```bash
npm run electron:dev
```

### Build

To create a production build/installer:

```bash
npm run dist
```
