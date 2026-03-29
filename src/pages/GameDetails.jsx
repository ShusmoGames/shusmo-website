import { useState, useRef } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useGame } from '../hooks/useGames'
import ScreenshotsCarousel from '../components/ScreenshotsCarousel'
import SocialLinks from '../components/SocialLinks'

/**
 * GameDetails Page
 * Clean game details page with header, gallery carousel, and description
 */
function GameDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { game, loading, error } = useGame(id)
  const [showTrailerModal, setShowTrailerModal] = useState(false)
  const videoRef = useRef(null)
  const modalVideoRef = useRef(null)

  // Handle loading state
  if (loading) {
    return (
      <section className="min-h-screen px-4 py-16 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-shusmo-yellow mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading game details...</p>
        </div>
      </section>
    )
  }

  // Handle error or game not found
  if (error || !game) {
    return (
      <section className="min-h-screen px-4 py-16 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-shusmo-black mb-4">Game Not Found</h2>
          <p className="text-gray-600 mb-6">{error || 'The game you\'re looking for doesn\'t exist.'}</p>
          <Link to="/games" className="btn-primary inline-block">
            Back to Games
          </Link>
        </div>
      </section>
    )
  }

  // Helper function to get YouTube embed URL
  const getYouTubeEmbedUrl = (url) => {
    if (!url || !url.includes('youtube.com')) return url
    return url.replace('watch?v=', 'embed/')
  }

  return (
    <div className="bg-white">
      {/* Hero Section - Full Header with Autoplay Background Trailer */}
      <section className="relative bg-shusmo-black -mt-20 h-[60vh] md:h-[75vh] overflow-hidden">
        {/* Video Section - Full Header Height */}
        {game.trailer_url && game.trailer_url.includes('youtube.com') ? (
          <iframe
            ref={videoRef}
            src={`${getYouTubeEmbedUrl(game.trailer_url)}?autoplay=1&mute=1&loop=1&controls=0&showinfo=0&rel=0&modestbranding=1&enablejsapi=1`}
            title="Game Trailer"
            className="absolute inset-0 w-full h-full object-cover"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
            poster={game.icon_url}
          >
            <source src={game.trailer_url || ''} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )}

        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-shusmo-black via-shusmo-black/60 to-shusmo-black/40" />

        {/* Game Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
          <div className="max-w-4xl flex items-end gap-4 md:gap-6">
            {/* Game Icon - Minimalist */}
            <div className="flex-shrink-0 w-16 h-16 md:w-20 md:h-20 bg-white rounded-shusmo overflow-hidden shadow-lg">
              <img
                src={game.icon_url}
                alt={game.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Game Info */}
            <div className="flex-1">
              <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2">
                {game.name}
              </h1>
              <p className="text-white/80 text-sm md:text-lg">
                {game.short_description}
              </p>
            </div>
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

        {/* Watch Trailer Button - Bottom Right */}
        <button
          onClick={() => setShowTrailerModal(true)}
          className="absolute bottom-6 right-4 md:bottom-8 md:right-8 flex items-center gap-2 bg-shusmo-yellow hover:bg-yellow-400 text-shusmo-black font-semibold px-5 py-2.5 md:px-6 md:py-3 rounded-full shadow-lg transition-all duration-200 hover:scale-105 z-10"
        >
          <svg className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z"/>
          </svg>
          <span className="hidden sm:inline">Watch Trailer</span>
          <span className="sm:hidden">Trailer</span>
        </button>
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
              {game.trailer_url && game.trailer_url.includes('youtube.com') ? (
                <iframe
                  ref={modalVideoRef}
                  src={getYouTubeEmbedUrl(game.trailer_url)}
                  title={`${game.name} Trailer`}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <video
                  ref={modalVideoRef}
                  autoPlay
                  controls
                  className="w-full h-full"
                >
                  <source src={game.trailer_url || ''} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              )}
            </div>

            {/* Game Title Below Video */}
            <div className="mt-4 text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">{game.name}</h2>
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
              {game.images && game.images.length > 0 && (
                <section>
                  <h2 className="text-2xl font-bold text-shusmo-black mb-6">Gallery</h2>
                  <ScreenshotsCarousel screenshots={game.images} gameTitle={game.name} />
                </section>
              )}

              {/* Game Description Section */}
              <section className="card p-6 md:p-8">
                <h2 className="text-2xl font-bold text-shusmo-black mb-4">About the Game</h2>
                <p className="text-gray-600 leading-relaxed">{game.full_description}</p>

                {/* Tags */}
                {game.genre && (
                  <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t border-gray-100">
                    <span className="bg-shusmo-yellow text-shusmo-black text-sm font-semibold px-4 py-2 rounded-full">
                      {game.genre}
                    </span>
                  </div>
                )}
              </section>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">

              {/* Social Links Card */}
              {game.social_links && Object.keys(game.social_links).length > 0 && (
                <div className="card p-6">
                  <h3 className="text-lg font-bold text-shusmo-black mb-4">Join the Community</h3>
                  <SocialLinks social={game.social_links} />
                </div>
              )}

              {/* Download Card - Sticky */}
              {(game.google_play_link || game.app_store_link) && (
                <div className="card p-6 sticky top-24">
                  <h3 className="text-xl font-bold text-shusmo-black mb-4">Download Now</h3>

                  <div className="space-y-3">
                    {/* Google Play Button */}
                    {game.google_play_link && (
                      <a
                        href={game.google_play_link}
                        className="flex items-center justify-center gap-3 bg-[#01875f] hover:bg-[#017a56] text-white font-semibold px-6 py-4 rounded-shusmo transition-all duration-200 hover:scale-105 shadow-lg"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M4 4.304V19.696L17.385 12L4 4.304Z" fill="white"/>
                        </svg>
                        <span className="text-lg font-medium">Google Play</span>
                      </a>
                    )}

                    {/* App Store Button */}
                    {game.app_store_link && (
                      <a
                        href={game.app_store_link}
                        className="flex items-center justify-center gap-3 bg-[#007AFF] hover:bg-[#0066D6] text-white font-semibold px-6 py-4 rounded-shusmo transition-all duration-200 hover:scale-105 shadow-lg"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-.8 1.94-.8s.17 1.47-.56 2.3c-.73.83-1.94.8-1.94.8s-.17-1.47.56-2.3z"/>
                        </svg>
                        <span className="text-lg font-medium">App Store</span>
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default GameDetails
