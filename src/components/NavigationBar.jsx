import { useState } from 'react'
import { Link } from 'react-router-dom'

/**
 * NavigationBar Component
 * Fixed navigation with glassmorphism effect
 * Provides navigation links to all pages
 */
function NavigationBar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-4xl">
      <div className="bg-white/80 backdrop-blur-md rounded-shusmo shadow-lg border border-gray-100">
        <div className="flex items-center justify-between px-4 md:px-6 py-3 md:py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 md:gap-3">
            <img src="/logo.png" alt="Shusmo Logo" className="h-8 w-8 md:h-10 md:w-auto" />
            <span className="font-bold text-lg md:text-xl text-shusmo-black">Shusmo</span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/games" className="nav-link">Games</Link>
            <Link to="/about" className="nav-link">About</Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-gray-600 hover:text-shusmo-black transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 px-4 py-3 space-y-2">
            <Link
              to="/"
              className="block py-3 text-gray-700 hover:text-shusmo-yellow hover:bg-gray-50 rounded-lg px-3 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/games"
              className="block py-3 text-gray-700 hover:text-shusmo-yellow hover:bg-gray-50 rounded-lg px-3 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Games
            </Link>
            <Link
              to="/about"
              className="block py-3 text-gray-700 hover:text-shusmo-yellow hover:bg-gray-50 rounded-lg px-3 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              About
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}

export default NavigationBar
