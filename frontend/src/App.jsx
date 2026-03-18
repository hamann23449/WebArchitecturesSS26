import React, { useEffect, useState } from 'react'
import axios from 'axios'

const api = axios.create({ baseURL: 'http://localhost:3000/api' })

function AlbumForm({ onAdd }) {
  const [artist, setArtist] = useState('')
  const [title, setTitle] = useState('')
  const [year, setYear] = useState('')

  async function submit(e) {
    e.preventDefault()
    const res = await api.post('/albums', { artist, title, year: year || null })
    onAdd(res.data)
    setArtist(''); setTitle(''); setYear('')
  }

  return (
    <form onSubmit={submit} className="album-form">
      <input placeholder="Artist" value={artist} onChange={e => setArtist(e.target.value)} />
      <input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
      <input placeholder="Year" value={year} onChange={e => setYear(e.target.value)} />
      <button type="submit">Add Album</button>
    </form>
  )
}

function AlbumItem({ album, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false)
  const [rating, setRating] = useState(album.rating || '')

  async function toggleList() {
    const res = await api.put(`/albums/${album.id}`, { listened: !album.listened })
    onUpdate(res.data)
  }

  async function saveRating() {
    const r = rating === '' ? null : Number(rating)
    const res = await api.put(`/albums/${album.id}`, { rating: r, listened: true })
    onUpdate(res.data)
    setEditing(false)
  }

  return (
    <div className="album">
      <div>
        <strong>{album.artist}</strong> — {album.title} {album.year ? `(${album.year})` : ''}
        <div className="meta">Listened: {album.listened ? 'Yes' : 'No'} Rating: {album.rating ?? '—'}</div>
      </div>
      <div className="actions">
        <button onClick={toggleList}>{album.listened ? 'Mark Unlistened' : 'Mark Listened'}</button>
        <button onClick={() => setEditing(s => !s)}>{editing ? 'Cancel' : 'Rate'}</button>
        <button onClick={() => onDelete(album.id)}>Delete</button>
      </div>
      {editing && (
        <div className="editor">
          <input value={rating} onChange={e => setRating(e.target.value)} placeholder="0-5" />
          <button onClick={saveRating}>Save Rating</button>
        </div>
      )}
    </div>
  )
}

export default function App() {
  const [albums, setAlbums] = useState([])

  useEffect(() => { fetchAlbums() }, [])

  async function fetchAlbums() {
    const res = await api.get('/albums')
    setAlbums(res.data)
  }

  async function addAlbum(album) { setAlbums(a => [...a, album]) }
  async function updateAlbum(updated) { setAlbums(a => a.map(x => x.id === updated.id ? updated : x)) }
  async function deleteAlbum(id) { await api.delete(`/albums/${id}`); setAlbums(a => a.filter(x => x.id !== id)) }

  return (
    <div className="container">
      <h1>Album Ratings</h1>
      <AlbumForm onAdd={addAlbum} />
      <div className="list">
        {albums.map(a => (
          <AlbumItem key={a.id} album={a} onUpdate={updateAlbum} onDelete={deleteAlbum} />
        ))}
      </div>
    </div>
  )
}
