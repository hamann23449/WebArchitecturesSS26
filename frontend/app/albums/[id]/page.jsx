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
    let cancelled = false
    async function load() {
      const { authFetch } = await import('../../../src/lib/authFetch');
      const res = await authFetch(`/api/albums/${id}`)
      const data = await res.json()
      if (!cancelled && mounted) setAlbum(data)
    }
    load().catch(() => {})
    return () => { mounted = false }
  }, [id])

  if (!album) return <div>Loading...</div>

  async function saveRating(newRating) {
  const { authFetch } = await import('../../../src/lib/authFetch');
  const res = await authFetch(`/api/albums/${id}`, {
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
