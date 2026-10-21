# 2nr – Second Number (Web App)

Complete modern web application built with **React + TypeScript + Vite + Tailwind CSS**.

Inspired by the real 2nr (drugi-numer) virtual number service, using realistic data and design patterns extracted from network captures.

## Features

- Beautiful landing page
- Dashboard with stats
- Numbers management (list, copy, remove)
- SMS inbox with real message examples
- User profile page
- Fully typed with TypeScript
- Responsive dark UI

## Tech Stack

- React 18 + TypeScript
- Vite
- Tailwind CSS
- React Router
- Lucide Icons

## Development

```bash
npm install
npm run dev
```

## Build for production

```bash
npm run build
```

The `dist/` folder is ready for Cloudflare Pages.

## Deploy to Cloudflare Pages

1. Connect this repository in Cloudflare Pages
2. Build command: `npm run build`
3. Output directory: `dist`
4. Deploy

---

Built from deep analysis of real HAR captures (October 2026).
