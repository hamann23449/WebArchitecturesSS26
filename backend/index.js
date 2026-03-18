const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// In-memory store for demo purposes
let albums = [
  { id: 1, artist: 'Radiohead', title: 'OK Computer', year: 1997, listened: true, rating: 5 },
  { id: 2, artist: 'The Beatles', title: 'Abbey Road', year: 1969, listened: false, rating: null }
];
let nextId = 3;

app.get('/api/albums', (req, res) => {
  res.json(albums);
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

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Album backend listening on port ${port}`));
