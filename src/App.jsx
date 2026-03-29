import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import NavigationBar from './components/NavigationBar'
import Home from './pages/Home'
import Games from './pages/Games'
import About from './pages/About'
import GameDetails from './pages/GameDetails'

/**
 * Main App Component
 * Sets up routing and navigation for the Shusmo website
 */
function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white">
        <NavigationBar />
        <main className="pt-20">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/games" element={<Games />} />
            <Route path="/games/:id" element={<GameDetails />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
