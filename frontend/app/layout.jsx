import './globals.css'

export const metadata = {
  title: 'Album Ratings',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="app-bg">
        <header className="max-w-6xl mx-auto p-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img src="/assets/image/logo.png" alt="Logo" className="header-logo" />
            <div>
              <div className="text-lg font-semibold brand">Meine Alben</div>
              <div className="text-xs muted">Persönliche Musikbibliothek — Alben bewerten und verwalten</div>
            </div>
          </div>
          <nav className="text-sm muted space-x-4 flex items-center">
            <a href="/" className="hover:underline">Start</a>
            <a href="/library" className="hover:underline">Meine Bibliothek</a>
            <a href="/artists" className="hover:underline">Künstler</a>
            <a href="/albums" className="hover:underline">Alben</a>
            <a href="/profile" className="hover:underline">Mein Profil</a>
            <a href="/login" className="ml-4 px-3 py-1 rounded border border-transparent hover:border-gray-300">Anmelden</a>
          </nav>
        </header>

        <main className="max-w-6xl mx-auto p-6">{children}</main>

        <footer className="max-w-6xl mx-auto p-6 text-center muted text-sm">
          Built with ❤️ — adapted to Stitch design tokens
        </footer>
      </body>
    </html>
  )
}
