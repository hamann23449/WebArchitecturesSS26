# Album Ratings — Minimal Fullstack Demo

This repo contains a minimal fullstack scaffold: an Express backend (port 3000) and a Vite + React frontend (port 5173). It lets you add albums, mark them listened/unlistened, and rate them.

Prompt: "Stack: React + Vite (frontend, port 5173), Express (backend, port 3000). As a music lover, I want to build a web-based platform that allows me to rate albums I’ve already listened to—for myself or for friends—and to keep track of the albums I’ve listened to."

Run locally (Windows PowerShell):

```powershell
# backend
cd backend; npm install; npm start

# in a second terminal, frontend
cd frontend; npm install; npm run dev
```

Requirements coverage:
- React + Vite frontend on port 5173: Done (frontend/vite.config.js)
- Express backend on port 3000: Done (backend/index.js)
- APIs for listing, adding, updating, deleting albums: Done
- Simple UI to view and rate albums: Done (frontend/src)

Next.js frontend (updated):
- The frontend was replaced with a Next.js App Router app using Tailwind.
- Run the backend as before on port 3000, then start the frontend:

```powershell
cd frontend
npm install
npm run dev
```

The homepage (`/`) is a server component that fetches albums directly from `http://localhost:3000/api/albums` when the page loads.

////Braucht eure App SSR/Next.js – oder wäre Vite eigentlich besser geeignet?/////

In meinem Anwendungsfall würde ich eher mit Vite arbeiten, da alles hinter einem Login stattfindet, um die Daten der Nutzer mit deren Accounts zu verbinden. SEO ist in meinem Fall ebenfalls nicht so relevant, da die Seite nicht von Suchmaschinen zu sehr priorisiert werden soll, sondern eher eine Hilfe für weitere Musikliebhaber sein soll, um einen einfachen Überblick über deren Alben zu bieten. Die API wird von Spotify geholt. 

Aber ich würde zunächst das Frontend auf Next.js aufbauen und umsetzen. Im Nachhinein entscheide ich, welche der beiden Architekturen besser für mein Projekt geeignet ist. 

Notes: This is a demo using an in-memory store. For persistence, connect a database (SQLite/Postgres/Mongo) and move data access into a separate module.
