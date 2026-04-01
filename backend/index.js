const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Simple request logger to help diagnose routing/connection issues
app.use((req, res, next) => {
  console.log(new Date().toISOString(), req.method, req.url);
  next();
});

// In-memory store for demo purposes
let albums = [
  { id: 1, artist: 'Radiohead', title: 'OK Computer', year: 1997, listened: true, rating: 5 },
  { id: 2, artist: 'The Beatles', title: 'Abbey Road', year: 1969, listened: false, rating: null }
];
let nextId = 3;

app.get('/api/albums', (req, res) => {
  res.json(albums);
});

// return a single album by id
app.get('/api/albums/:id', (req, res) => {
  const id = Number(req.params.id);
  const album = albums.find(a => a.id === id);
  if (!album) return res.status(404).json({ error: 'not found' });
  res.json(album);
});

app.post('/api/albums', (req, res) => {
  const { artist, title, year } = req.body;
  if (!artist || !title) return res.status(400).json({ error: 'artist and title required' });
  const album = { id: nextId++, artist, title, year: year || null, listened: false, rating: null };
  albums.push(album);
  res.status(201).json(album);
});

app.put('/api/albums/:id', (req, res) => {
  const id = Number(req.params.id);
  const album = albums.find(a => a.id === id);
  if (!album) return res.status(404).json({ error: 'not found' });
  const { artist, title, year, listened, rating } = req.body;
  if (artist !== undefined) album.artist = artist;
  if (title !== undefined) album.title = title;
  if (year !== undefined) album.year = year;
  if (listened !== undefined) album.listened = listened;
  if (rating !== undefined) album.rating = rating;
  res.json(album);
});

app.delete('/api/albums/:id', (req, res) => {
  const id = Number(req.params.id);
  const before = albums.length;
  albums = albums.filter(a => a.id !== id);
  if (albums.length === before) return res.status(404).json({ error: 'not found' });
  res.status(204).end();
});

// --- Configuration: use port 3001 for this tasks/albums API ---
const port = process.env.PORT || 3001;

// Helper: validate an album payload (used for POST / PUT)
function validateAlbumPayload(payload) {
  if (!payload) return { valid: false, message: 'missing body' };
  const { artist, title } = payload;
  if (!artist || !title) return { valid: false, message: 'artist and title required' };
  return { valid: true };
}

// GET /api/albums - list all albums
app.get('/api/albums', (req, res) => {
  res.json(albums);
});

// GET /api/album/:id - single album (singular route as requested)
app.get('/api/album/:id', (req, res) => {
  const id = Number(req.params.id);
  const album = albums.find(a => a.id === id);
  if (!album) return res.status(404).json({ error: 'not found' });
  res.json(album);
});

// POST /api/albums - create new album (returns 201)
app.post('/api/albums', (req, res) => {
  const validation = validateAlbumPayload(req.body);
  if (!validation.valid) return res.status(400).json({ error: validation.message });
  const { artist, title, year } = req.body;
  const album = { id: nextId++, artist, title, year: year || null, listened: false, rating: null };
  albums.push(album);
  res.status(201).json(album);
});

// PUT /api/album/:id - replace an album entirely
app.put('/api/album/:id', (req, res) => {
  const id = Number(req.params.id);
  const idx = albums.findIndex(a => a.id === id);
  if (idx === -1) return res.status(404).json({ error: 'not found' });
  const validation = validateAlbumPayload(req.body);
  if (!validation.valid) return res.status(400).json({ error: validation.message });
  const { artist, title, year, listened, rating } = req.body;
  // Replace the album object (keep the same id)
  const replaced = {
    id,
    artist,
    title,
    year: year ?? null,
    listened: listened ?? false,
    rating: rating ?? null
  };
  albums[idx] = replaced;
  res.json(replaced);
});

// DELETE /api/albums/:id - delete an album
app.delete('/api/albums/:id', (req, res) => {
  const id = Number(req.params.id);
  const before = albums.length;
  albums = albums.filter(a => a.id !== id);
  if (albums.length === before) return res.status(404).json({ error: 'not found' });
  res.status(204).end();
});

// -------------------- Ratings resource (in-memory) --------------------
let ratings = [
  // example: { id: 1, albumId: 1, score: 5, comment: 'Great' }
];
let nextRatingId = 1;

function validateRatingPayload(payload) {
  if (!payload) return { valid: false, message: 'missing body' };
  const { albumId, score } = payload;
  if (albumId === undefined || score === undefined) return { valid: false, message: 'albumId and score required' };
  return { valid: true };
}

// GET /api/ratings - list all ratings
app.get('/api/ratings', (req, res) => {
  res.json(ratings);
});

// GET /api/ratings/:id - single rating
app.get('/api/ratings/:id', (req, res) => {
  const id = Number(req.params.id);
  const rating = ratings.find(r => r.id === id);
  if (!rating) return res.status(404).json({ error: 'not found' });
  res.json(rating);
});

// POST /api/ratings - create new rating
app.post('/api/ratings', (req, res) => {
  const validation = validateRatingPayload(req.body);
  if (!validation.valid) return res.status(400).json({ error: validation.message });
  const { albumId, score, comment } = req.body;
  // check album exists
  const album = albums.find(a => a.id === Number(albumId));
  if (!album) return res.status(404).json({ error: 'albumId not found' });
  const rating = { id: nextRatingId++, albumId: Number(albumId), score: Number(score), comment: comment ?? null };
  ratings.push(rating);
  res.status(201).json(rating);
});

// PUT /api/ratings/:id - replace rating
app.put('/api/ratings/:id', (req, res) => {
  const id = Number(req.params.id);
  const idx = ratings.findIndex(r => r.id === id);
  if (idx === -1) return res.status(404).json({ error: 'not found' });
  const validation = validateRatingPayload(req.body);
  if (!validation.valid) return res.status(400).json({ error: validation.message });
  const { albumId, score, comment } = req.body;
  // ensure album exists
  const album = albums.find(a => a.id === Number(albumId));
  if (!album) return res.status(404).json({ error: 'albumId not found' });
  const replaced = { id, albumId: Number(albumId), score: Number(score), comment: comment ?? null };
  ratings[idx] = replaced;
  res.json(replaced);
});

// DELETE /api/ratings/:id - delete rating
app.delete('/api/ratings/:id', (req, res) => {
  const id = Number(req.params.id);
  const before = ratings.length;
  ratings = ratings.filter(r => r.id !== id);
  if (ratings.length === before) return res.status(404).json({ error: 'not found' });
  res.status(204).end();
});

// bind to all interfaces to avoid IPv6/IPv4 resolution issues on some systems
app.listen(port, '0.0.0.0', () => console.log(`Album backend listening on port ${port}`));
