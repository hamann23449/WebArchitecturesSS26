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

Notes: This is a demo using an in-memory store. For persistence, connect a database (SQLite/Postgres/Mongo) and move data access into a separate module.
