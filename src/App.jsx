import { Suspense, lazy } from 'react'
import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import NavigationBar from './components/NavigationBar'

// Lazy load page components for code splitting
const Home = lazy(() => import('./pages/Home'))
const Games = lazy(() => import('./pages/Games'))
const About = lazy(() => import('./pages/About'))
const GameDetails = lazy(() => import('./pages/GameDetails'))
const AdminPage = lazy(() => import('./pages/admin/AdminPage'))
const AuthCallback = lazy(() => import('./pages/AuthCallback'))

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
 * Uses HashRouter for GitHub Pages compatibility
 */
function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white">
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
            </Routes>
          </Suspense>
        </main>
      </div>
    </Router>
  )
}

export default App
