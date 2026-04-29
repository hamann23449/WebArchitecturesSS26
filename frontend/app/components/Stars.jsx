"use client"
import { useState } from 'react'

export default function Stars({ albumId, initialRating }) {
  const [rating, setRating] = useState(initialRating ?? 0)
  const [hover, setHover] = useState(0)
  const [saving, setSaving] = useState(false)

  async function save(newRating) {
    const prev = rating
    setRating(newRating)
    setSaving(true)
    try {
      const { authFetch } = await import('../../src/lib/authFetch');
      const res = await authFetch(`/api/albums/${albumId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating: newRating, listened: true })
      });
      if (!res.ok) throw new Error('save failed')
      await res.json()
    } catch (err) {
      setRating(prev)
      console.error(err)
      alert('Could not save rating')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex items-center space-x-2">
      <div className="flex">
        {[1,2,3,4,5].map(i => {
          const filled = hover ? i <= hover : i <= rating
          return (
            <button
              key={i}
              type="button"
              aria-label={`${i} star`}
              onClick={() => save(i)}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(0)}
              className={`p-1 ${filled ? 'text-yellow-400' : 'text-gray-300'} hover:text-yellow-400 focus:outline-none`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.97a1 1 0 00.95.69h4.18c.969 0 1.371 1.24.588 1.81l-3.388 2.46a1 1 0 00-.364 1.118l1.287 3.97c.3.921-.755 1.688-1.54 1.118l-3.388-2.46a1 1 0 00-1.176 0l-3.388 2.46c-.785.57-1.84-.197-1.54-1.118l1.286-3.97a1 1 0 00-.364-1.118L2.044 9.397c-.783-.57-.38-1.81.588-1.81h4.18a1 1 0 00.95-.69l1.287-3.97z" />
              </svg>
            </button>
          )
        })}
      </div>
      <div className="text-sm text-gray-500">{rating ? `${rating}/5` : '—'}</div>
      {saving && <div className="text-xs text-gray-400">Saving...</div>}
    </div>
  )
}
