import { useState, useRef } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { gamesData } from '../data/gamesData'
import ScreenshotsCarousel from '../components/ScreenshotsCarousel'
import SocialLinks from '../components/SocialLinks'

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
          
          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Screenshots Carousel Section */}
              <section>
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

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">

              {/* Download Card - Sticky */}
              <div className="card p-6 sticky top-24">
                <h3 className="text-xl font-bold text-shusmo-black mb-4">Download Now</h3>
                <p className="text-gray-600 text-sm mb-6">
                  Start your adventure today. Free to download with optional in-app purchases.
                </p>

                <div className="space-y-3 mb-6">
                  <a
                    href={game.googlePlayUrl}
                    className="flex items-center justify-center gap-2 bg-shusmo-black text-white font-semibold px-4 py-4 rounded-shusmo hover:bg-gray-800 transition-all duration-200 hover:scale-105"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.537-.279.978.978 0 01-.287-.695V2.788a.978.978 0 01.287-.695.996.996 0 01.536-.279zm10.89 10.89l2.607-2.607a3.543 3.543 0 000-5.012l-2.607 2.607 5.012 5.012zm-5.012 5.012l2.607 2.607a3.543 3.543 0 005.012 0l-2.607-2.607-5.012 5.012z"/>
                    </svg>
                    <div className="text-left">
                      <div className="text-xs opacity-80">Get it on</div>
                      <div className="text-lg font-bold">Google Play</div>
                    </div>
                  </a>

                  <a
                    href={game.appStoreUrl}
                    className="flex items-center justify-center gap-2 bg-shusmo-black text-white font-semibold px-4 py-4 rounded-shusmo hover:bg-gray-800 transition-all duration-200 hover:scale-105"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-.8 1.94-.8s.17 1.47-.56 2.3c-.73.83-1.94.8-1.94.8s-.17-1.47.56-2.3z"/>
                    </svg>
                    <div className="text-left">
                      <div className="text-xs opacity-80">Download on the</div>
                      <div className="text-lg font-bold">App Store</div>
                    </div>
                  </a>
                </div>

                {/* Rating Stats */}
                <div className="border-t border-gray-100 pt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-600 text-sm">Rating</span>
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-shusmo-yellow" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="font-bold text-shusmo-black">{game.rating}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 text-sm">Total Reviews</span>
                    <span className="font-bold text-shusmo-black">{game.reviews.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Social Links Card */}
              <div className="card p-6">
                <h3 className="text-lg font-bold text-shusmo-black mb-4">Join the Community</h3>
                <SocialLinks social={game.social} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default GameDetails
