import Link from 'next/link'
import Stars from './components/Stars'

async function fetchRandomAlbums(count = 6) {
  const API = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3001'
  const res = await fetch(`${API}/api/albums/random?count=${count}`, { cache: 'no-store' })
  if (!res.ok) throw new Error('Failed to fetch')
  return res.json()
}

function Tracklist({ tracklist }) {
  if (!tracklist) return null
  // tracklist may be stored as JSON string or already an array
  const list = typeof tracklist === 'string' ? JSON.parse(tracklist) : tracklist
  return (
    <ol className="text-sm mt-2 list-decimal list-inside">
      {list.map((t, i) => (
        <li key={i}>{t.title}{t.duration ? ` — ${t.duration}` : ''}</li>
      ))}
    </ol>
  )
}

export default async function Page() {
  const albums = await fetchRandomAlbums(6)

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <section className="md:col-span-2">
        <div className="rounded-lg-clip card-surface p-6 mb-6">
          <h1 className="title">Willkommen bei Meine Alben</h1>
          <p className="subtitle">Eine einfache, persönliche Musikbibliothek zum Speichern, bewerten und teilen deiner Lieblingsalben. Inspiriert von Musixlib — hier findest du schnell zufällige Empfehlungen aus deiner Sammlung.</p>
        </div>

        <div className="space-y-4">
          {albums.length === 0 && <div className="muted">Noch keine Alben vorhanden. Du kannst welche im Backend anlegen oder das Seed-Skript laufen lassen.</div>}
          {albums.map(album => (
            <div key={album.id} className="p-4 rounded-lg-clip card-surface">
              <div className="flex items-start space-x-4">
                <img src={`/assets/albums/${album.id}.jpg`} alt="cover" className="w-20 h-20 object-cover rounded" />
                <div className="flex-1">
                  <div className="font-medium text-lg">{album.artist?.name ?? (album.artist || 'Unbekannt')} — {album.title} {album.release_year ? `(${album.release_year})` : ''}</div>
                  <div className="text-sm muted">Genre: {album.genre?.name ?? '—'}</div>
                  <Tracklist tracklist={album.tracklist} />
                </div>
                <div className="flex flex-col items-end space-y-2">
                  <Stars albumId={album.id} initialRating={album.rating} />
                  <Link href={`/albums/${album.id}`} className="accent hover:underline">Details</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <aside className="space-y-4">
        <div className="rounded-lg-clip card-surface p-4">
          <div className="text-sm muted">Schnellaktionen</div>
          <ul className="mt-3 space-y-2">
            <li><a href="/library" className="hover:underline">Zu meiner Bibliothek</a></li>
            <li><a href="/artists" className="hover:underline">Alle Künstler</a></li>
            <li><a href="/albums" className="hover:underline">Alle Alben</a></li>
          </ul>
        </div>

        <div className="rounded-lg-clip card-surface p-4 text-center">
          <div className="text-sm muted">Tipps</div>
          <div className="mt-2 text-sm">Verbinde dein Profil, füge Coverbilder unter <code>/public/assets/albums/</code> hinzu und fülle die Tracklisten für reichhaltige Albumseiten.</div>
        </div>
      </aside>
    </div>
  )
}
