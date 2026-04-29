const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');

dotenv.config();

const app = express();
app.use(cors({ origin: process.env.FRONTEND_ORIGIN || true, credentials: true }));
app.use(express.json());
app.use(cookieParser());
// authentication middleware (JWT)
const authenticate = require('./middleware/authenticate');

// Simple request logger to help diagnose routing/connection issues
app.use((req, res, next) => {
  console.log(new Date().toISOString(), req.method, req.url);
  next();
});

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

app.get('/api/albums', async (req, res) => {
  try {
    const all = await prisma.album.findMany();
    res.json(all);
  } catch (err) {
    console.error('fetch albums error', err);
    res.status(500).json({ error: 'internal error' });
  }
});

// return a single album by id
app.get('/api/albums/:id', authenticate, async (req, res) => {
  const id = Number(req.params.id);
  try {
    const album = await prisma.album.findUnique({ where: { id } });
    if (!album) return res.status(404).json({ error: 'not found' });
    // only owner may view this album in this design
    if (album.userId !== req.user.userId) return res.status(404).json({ error: 'not found' });
    res.json(album);
  } catch (err) {
    console.error('get album error', err);
    res.status(500).json({ error: 'internal error' });
  }
});

app.post('/api/albums', authenticate, async (req, res) => {
  const { artist, title, year } = req.body;
  if (!artist || !title) return res.status(400).json({ error: 'artist and title required' });
  try {
    const created = await prisma.album.create({ data: { artist, title, year: year ?? null, listened: false, rating: null, userId: req.user.userId } });
    res.status(201).json(created);
  } catch (err) {
    console.error('create album error', err);
    res.status(500).json({ error: 'internal error' });
  }
});

app.put('/api/albums/:id', authenticate, async (req, res) => {
  const id = Number(req.params.id);
  try {
    const existing = await prisma.album.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ error: 'not found' });
    if (existing.userId !== req.user.userId) return res.status(403).json({ error: 'forbidden' });
    const { artist, title, year, listened, rating } = req.body;
    const updated = await prisma.album.update({ where: { id }, data: { artist: artist ?? existing.artist, title: title ?? existing.title, year: year ?? existing.year, listened: listened ?? existing.listened, rating: rating ?? existing.rating } });
    res.json(updated);
  } catch (err) {
    console.error('update album error', err);
    res.status(500).json({ error: 'internal error' });
  }
});

app.delete('/api/albums/:id', authenticate, async (req, res) => {
  const id = Number(req.params.id);
  try {
    const existing = await prisma.album.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ error: 'not found' });
    if (existing.userId !== req.user.userId) return res.status(403).json({ error: 'forbidden' });
    await prisma.album.delete({ where: { id } });
    res.status(204).end();
  } catch (err) {
    console.error('delete album error', err);
    res.status(500).json({ error: 'internal error' });
  }
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
function validateRatingPayload(payload) {
  if (!payload) return { valid: false, message: 'missing body' };
  const { albumId, score } = payload;
  if (albumId === undefined || score === undefined) return { valid: false, message: 'albumId and score required' };
  return { valid: true };
}

// GET /api/ratings - list all ratings
app.get('/api/ratings', async (req, res) => {
  try {
    const all = await prisma.rating.findMany();
    res.json(all);
  } catch (err) {
    console.error('fetch ratings error', err);
    res.status(500).json({ error: 'internal error' });
  }
});

// GET /api/ratings/:id - single rating
app.get('/api/ratings/:id', async (req, res) => {
  const id = Number(req.params.id);
  try {
    const rating = await prisma.rating.findUnique({ where: { id } });
    if (!rating) return res.status(404).json({ error: 'not found' });
    res.json(rating);
  } catch (err) {
    console.error('get rating error', err);
    res.status(500).json({ error: 'internal error' });
  }
});

// POST /api/ratings - create new rating
app.post('/api/ratings', authenticate, async (req, res) => {
  const validation = validateRatingPayload(req.body);
  if (!validation.valid) return res.status(400).json({ error: validation.message });
  const { albumId, score, comment } = req.body;
  try {
    const album = await prisma.album.findUnique({ where: { id: Number(albumId) } });
    if (!album) return res.status(404).json({ error: 'albumId not found' });
    // allow only if album belongs to user (or alternatively allow anyone) - we'll require same user for now
    if (album.userId !== req.user.userId) return res.status(403).json({ error: 'forbidden' });
    const created = await prisma.rating.create({ data: { albumId: Number(albumId), score: Number(score), comment: comment ?? null, userId: req.user.userId } });
    res.status(201).json(created);
  } catch (err) {
    console.error('create rating error', err);
    res.status(500).json({ error: 'internal error' });
  }
});

// PUT /api/ratings/:id - replace rating
app.put('/api/ratings/:id', authenticate, async (req, res) => {
  const id = Number(req.params.id);
  const validation = validateRatingPayload(req.body);
  if (!validation.valid) return res.status(400).json({ error: validation.message });
  try {
    const existing = await prisma.rating.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ error: 'not found' });
    if (existing.userId !== req.user.userId) return res.status(403).json({ error: 'forbidden' });
    const { albumId, score, comment } = req.body;
    const album = await prisma.album.findUnique({ where: { id: Number(albumId) } });
    if (!album) return res.status(404).json({ error: 'albumId not found' });
    const updated = await prisma.rating.update({ where: { id }, data: { albumId: Number(albumId), score: Number(score), comment: comment ?? null } });
    res.json(updated);
  } catch (err) {
    console.error('update rating error', err);
    res.status(500).json({ error: 'internal error' });
  }
});

// DELETE /api/ratings/:id - delete rating
app.delete('/api/ratings/:id', authenticate, async (req, res) => {
  const id = Number(req.params.id);
  try {
    const existing = await prisma.rating.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ error: 'not found' });
    if (existing.userId !== req.user.userId) return res.status(403).json({ error: 'forbidden' });
    await prisma.rating.delete({ where: { id } });
    res.status(204).end();
  } catch (err) {
    console.error('delete rating error', err);
    res.status(500).json({ error: 'internal error' });
  }
});

// bind to all interfaces to avoid IPv6/IPv4 resolution issues on some systems
// mount auth routes
const auth = require('./auth');
app.use('/api/auth', auth);

app.listen(port, '0.0.0.0', () => console.log(`Album backend listening on port ${port}`));
