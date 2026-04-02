import { Suspense, lazy, useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom'
import NavigationBar from './components/NavigationBar'

// Lazy load page components for code splitting
const Home = lazy(() => import('./pages/Home'))
const Games = lazy(() => import('./pages/Games'))
const About = lazy(() => import('./pages/About'))
const GameDetails = lazy(() => import('./pages/GameDetails'))
const AdminPage = lazy(() => import('./pages/admin/AdminPage'))
const AuthCallback = lazy(() => import('./pages/AuthCallback'))

// Component to handle redirect from 404.html
function RedirectHandler() {
  const navigate = useNavigate()
  const location = useLocation()
  const [hasChecked, setHasChecked] = useState(false)

  useEffect(() => {
    if (!hasChecked) {
      const intendedPath = sessionStorage.getItem('intendedPath')
      console.log('RedirectHandler: hasChecked=false, intendedPath=', intendedPath, 'current=', location.pathname)
      
      if (intendedPath) {
        sessionStorage.removeItem('intendedPath')
        // Only navigate if we're not already on the intended path
        if (intendedPath !== location.pathname) {
          console.log('RedirectHandler: Navigating to', intendedPath)
          navigate(intendedPath, { replace: true })
        }
      }
      setHasChecked(true)
    } else {
      console.log('RedirectHandler: Already checked, skipping')
    }
  }, [navigate, location.pathname, hasChecked])

  return null
}

// 404 Page Component - redirects to home
function NotFoundRedirect() {
  useEffect(() => {
    console.log('NotFoundRedirect: Unknown path, redirecting to home')
    window.location.href = '/'
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-shusmo-yellow mx-auto"></div>
        <p className="mt-4 text-gray-600">Redirecting to home...</p>
      </div>
    </div>
  )
}

// Loading fallback component
function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-shusmo-yellow mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    </div>
  )
}

/**
 * Main App Component
 * Sets up routing and navigation for the Shusmo website
 * Uses BrowserRouter for clean URLs with GitHub Pages SPA support
 */
function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white">
        <RedirectHandler />
        <NavigationBar />
        <main className="pt-20">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/games" element={<Games />} />
              <Route path="/games/:slug" element={<GameDetails />} />
              <Route path="/about" element={<About />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              {/* Catch-all route for unknown paths - redirects to home */}
              <Route path="*" element={<NotFoundRedirect />} />
            </Routes>
          </Suspense>
        </main>
      </div>
    </Router>
  )
}

export default App
