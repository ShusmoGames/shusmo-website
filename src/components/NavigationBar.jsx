import { Link } from 'react-router-dom'

/**
 * NavigationBar Component
 * Fixed navigation with glassmorphism effect
 * Provides navigation links to all pages
 */
function NavigationBar() {
  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-4xl">
      <div className="bg-white/80 backdrop-blur-md rounded-shusmo shadow-lg border border-gray-100">
        <div className="flex items-center justify-between px-6 py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <img src="/logo.png" alt="Shusmo Logo" className="h-10 w-auto" />
            <span className="font-bold text-xl text-shusmo-black">Shusmo</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-8">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/games" className="nav-link">Games</Link>
            <Link to="/about" className="nav-link">About</Link>
            <Link to="/admin" className="nav-link text-shusmo-yellow hover:text-yellow-600">Admin</Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default NavigationBar
