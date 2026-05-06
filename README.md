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

/////Datenschema fürs Projekt Album Ratings beschreiben///////
users      tasks              projects
--------   ----------------   --------
id         id                 id
email      title              name
name       done (bool)        userId (FK → users)
(password) userID 
Saved Albums setRating
Rating       getRating
             getAlbumName
             getAlbumArtist
             getAlbumGenre
             getAlbumSongList

/////Ergänzung Mock Daten Handler////
Checkliste: 

Y Locate backend route file(s) to modify (index.js).
Y Import Prisma client and initialize it.
Y Replace/add GET /api/tasks route so it uses prisma.task.findMany() and wraps DB access in    try/catch.
Y Return 500 + JSON error on failure, and log the error locally.
N Validate server start: attempted to run backend to check for syntax/runtime errors (blocked by port in use).

What I changed

Edited index.js:
Added:
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
Added GET /api/tasks route:
Async handler that calls await prisma.task.findMany()
try/catch around DB access
On success: res.json(tasks)
On error: log to console and res.status(500).json({ error: 'internal server error' })


/////Datenschema fürs Projekt Album Ratings beschreiben///////
users      tasks              projects
--------   ----------------   --------
id         id                 id
email      title              name
name       done (bool)        userId (FK → users)
(password) userID 
Saved Albums setRating
Rating       getRating
             getAlbumName
             getAlbumArtist
             getAlbumGenre
             getAlbumSongList

/////Ergänzung Mock Daten Handler////
Checkliste: 

Y Locate backend route file(s) to modify (index.js).
Y Import Prisma client and initialize it.
Y Replace/add GET /api/tasks route so it uses prisma.task.findMany() and wraps DB access in    try/catch.
Y Return 500 + JSON error on failure, and log the error locally.
N Validate server start: attempted to run backend to check for syntax/runtime errors (blocked by port in use).

What I changed

Edited index.js:
Added:
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
Added GET /api/tasks route:
Async handler that calls await prisma.task.findMany()
try/catch around DB access
On success: res.json(tasks)
On error: log to console and res.status(500).json({ error: 'internal server error' })



////Ressourcen die meine App hat/////

Typische Ressourcen die ich benötige sind: verschiedene Users (Nutzerkonten); Tasks (z.B Alben bewerten, Alben zur Bibliothek hinzufügen); Projects und Comments.

Für die Struktur würde ich eher das Pragmatisches Nesting für mein Projekt verwenden, da ich gerne die AlbenCover, AlbumTitel, KünstlerName, MusikGenre, AlbumSongsListe mir aus einer API holen möchte und ich bei der Komplexität lieber mit Ordnern/Ebenen arbeiten.


/////TEST////////

Ebene	Was testen wir bei uns?	Tool
Unit	z.B. Validierungsfunktion für Eingaben/ Login	Vitest
Integration	z.B. POST /api/tasks legt wirklich DB-Eintrag an	Vitest
E2E	z.B. Login-Flow, neuer Eintrag erstellen, Album bewerten, Album Info rauslesen	Cypress

Die zwei Dinge die in meinem Projekt am meisten Schaden einrichten sind Fehler bei dem lesen der Daten aus der Datenbank und interne Server Probleme.(Server startet nicht oder bekommt Probleme)


