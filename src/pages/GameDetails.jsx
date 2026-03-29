import { useState, useRef } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { gamesData } from '../data/gamesData'
import ScreenshotsCarousel from '../components/ScreenshotsCarousel'

/**
 * GameDetails Page
 * Clean game details page with header, gallery carousel, and description
 */
function GameDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [showTrailerModal, setShowTrailerModal] = useState(false)
  const videoRef = useRef(null)
  const modalVideoRef = useRef(null)

  // Find the game by ID
  const game = gamesData.find(g => g.id === parseInt(id))
  
  // Handle game not found
  if (!game) {
    return (
      <section className="min-h-screen px-4 py-16 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-shusmo-black mb-4">Game Not Found</h2>
          <p className="text-gray-600 mb-6">The game you're looking for doesn't exist.</p>
          <Link to="/games" className="btn-primary inline-block">
            Back to Games
          </Link>
        </div>
      </section>
    )
  }

  return (
    <div className="bg-white">
      {/* Hero Section - Full Header with Autoplay Background Trailer */}
      <section className="relative bg-shusmo-black">
        {/* Video Section - Full Header Height */}
        <div className="relative h-[60vh] md:h-[75vh] overflow-hidden">
          {/* Autoplay Background Video (Muted, Loop) */}
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
            poster={game.image}
          >
            <source src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          
          {/* Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-shusmo-black via-shusmo-black/60 to-shusmo-black/40" />
          
          {/* Game Title Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
            <div className="max-w-4xl">
              <span className="inline-block bg-shusmo-yellow text-shusmo-black text-xs md:text-sm font-bold px-3 py-1 rounded-full mb-3">
                {game.genre}
              </span>
              <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2">
                {game.title}
              </h1>
              <p className="text-white/80 text-sm md:text-lg">
                {game.shortDescription}
              </p>
            </div>
          </div>
          
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="absolute top-6 left-4 md:left-8 flex items-center gap-2 bg-white/90 hover:bg-white px-4 py-2 rounded-full shadow-lg transition-all duration-200 hover:scale-105 z-10"
          >
            <svg className="w-5 h-5 text-shusmo-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          {/* Watch Trailer Button */}
          <button
            onClick={() => setShowTrailerModal(true)}
            className="absolute top-6 right-4 md:right-8 flex items-center gap-2 bg-shusmo-yellow hover:bg-yellow-400 text-shusmo-black font-semibold px-5 py-2.5 md:px-6 md:py-3 rounded-full shadow-lg transition-all duration-200 hover:scale-105 z-10"
          >
            <svg className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
            <span className="hidden sm:inline">Watch Trailer</span>
            <span className="sm:hidden">Trailer</span>
          </button>
        </div>
      </section>

      {/* Trailer Modal Popup */}
      {showTrailerModal && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setShowTrailerModal(false)}
        >
          {/* Modal Content */}
          <div 
            className="relative w-full max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setShowTrailerModal(false)}
              className="absolute -top-12 right-0 text-white hover:text-shusmo-yellow transition-colors duration-200"
              aria-label="Close trailer"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            {/* Video Container */}
            <div className="relative aspect-video rounded-shusmo overflow-hidden shadow-2xl">
              <video
                ref={modalVideoRef}
                autoPlay
                controls
                className="w-full h-full"
              >
                <source src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
            
            {/* Game Title Below Video */}
            <div className="mt-4 text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">{game.title}</h2>
              <p className="text-gray-400 text-sm md:text-base">Official Game Trailer</p>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="px-4 md:px-8 py-12">
        <div className="max-w-6xl mx-auto">
          
          {/* Screenshots Carousel Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-shusmo-black mb-6">Gallery</h2>
            <ScreenshotsCarousel screenshots={game.screenshots} gameTitle={game.title} />
          </section>

          {/* Game Description Section */}
          <section className="card p-6 md:p-8">
            <h2 className="text-2xl font-bold text-shusmo-black mb-4">About the Game</h2>
            <p className="text-gray-600 leading-relaxed mb-6">{game.description}</p>
            <p className="text-gray-600 leading-relaxed">{game.longDescription}</p>
          </section>
        </div>
      </main>
    </div>
  )
}

export default GameDetails
