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
              <div className="text-lg font-semibold brand">Album Ratings</div>
              <div className="text-xs muted">Your personal music library</div>
            </div>
          </div>
          <nav className="text-sm muted space-x-4">
            <a href="#" className="hover:underline">Dashboard</a>
            <a href="#" className="hover:underline">Library</a>
            <a href="#" className="hover:underline">Friends</a>
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
