import Link from 'next/link'
import Stars from './components/Stars'

async function fetchAlbums() {
  const res = await fetch('http://127.0.0.1:3000/api/albums', { cache: 'no-store' })
  if (!res.ok) throw new Error('Failed to fetch')
  return res.json()
}

export default async function Page() {
  const albums = await fetchAlbums()

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <section className="md:col-span-2">
        <div className="rounded-lg-clip card-surface p-6 mb-6">
          <div className="flex items-center space-x-6">
            <img src="/assets/hero.jpg" alt="Hero" className="w-36 h-36 rounded-lg-clip object-cover" />
            <div>
              <h1 className="text-2xl font-bold">Albums I’ve listened to</h1>
              <p className="muted text-sm">Server-rendered list fetched directly from the Express backend.</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {albums.length === 0 && <div className="muted">No albums yet. Add some from the backend.</div>}
          {albums.map(album => (
            <div key={album.id} className="p-4 rounded-lg-clip card-surface flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <img src={`/assets/albums/${album.id}.jpg`} alt="cover" className="w-14 h-14 object-cover rounded" />
                <div>
                  <div className="font-medium">{album.artist} — {album.title} {album.year ? `(${album.year})` : ''}</div>
                  <div className="text-sm muted">Listened: {album.listened ? 'Yes' : 'No'}</div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Stars albumId={album.id} initialRating={album.rating} />
                <Link href={`/albums/${album.id}`} className="accent hover:underline">Details</Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <aside className="space-y-4">
        <div className="rounded-lg-clip card-surface p-4">
          <div className="text-sm muted">Top Friends</div>
          <ul className="mt-3 space-y-2">
            <li className="flex items-center justify-between"><span>Alice</span><span className="muted">3 new</span></li>
            <li className="flex items-center justify-between"><span>Ben</span><span className="muted">1 new</span></li>
            <li className="flex items-center justify-between"><span>Carla</span><span className="muted">5 new</span></li>
          </ul>
        </div>

        <div className="rounded-lg-clip card-surface p-4 text-center">
          <div className="text-sm muted">Want this look?</div>
          <div className="mt-2">
            <a href="#" className="inline-block px-4 py-2 rounded bg-indigo-600 text-white">Apply theme</a>
          </div>
        </div>
      </aside>
    </div>
  )
}
