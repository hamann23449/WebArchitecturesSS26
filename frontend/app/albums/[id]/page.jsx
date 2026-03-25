"use client"
import { useEffect, useState } from 'react'
import Stars from '../../components/Stars'
import { useRouter } from 'next/navigation'

export default function AlbumPage({ params }) {
  const { id } = params
  const [album, setAlbum] = useState(null)
  const router = useRouter()

  useEffect(() => {
    let mounted = true
    fetch(`http://127.0.0.1:3000/api/albums/${id}`)
      .then(r => r.json())
      .then(data => { if (mounted) setAlbum(data) })
    return () => { mounted = false }
  }, [id])

  if (!album) return <div>Loading...</div>

  async function saveRating(newRating) {
  const res = await fetch(`http://127.0.0.1:3000/api/albums/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rating: newRating, listened: true })
    })
    const updated = await res.json()
    setAlbum(updated)
    router.refresh()
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold">{album.artist} — {album.title}</h2>
      <p className="text-sm text-gray-500">Year: {album.year ?? '—'}</p>
      <p className="mt-4">Listened: {album.listened ? 'Yes' : 'No'}</p>
      <div className="mt-4">
        <label className="mr-2">Rating:</label>
        <Stars albumId={album.id} initialRating={album.rating} />
      </div>
    </div>
  )
}
