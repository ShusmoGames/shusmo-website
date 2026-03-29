import { useState, useRef } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { gamesData } from '../data/gamesData'
import ScreenshotsCarousel from '../components/ScreenshotsCarousel'
import SocialLinks from '../components/SocialLinks'

/**
 * GameDetails Page
 * Comprehensive game details page with Google Play-style header
 */
function GameDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('overview')
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
        
        {/* Bottom Info Bar - Google Play Style */}
        <div className="relative -mt-20 md:-mt-28 px-4 md:px-8 pb-8">
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-shusmo shadow-2xl p-6 md:p-8">
              <div className="flex flex-col md:flex-row md:items-center gap-6">
                {/* Game Icon */}
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 md:w-28 md:h-28 bg-gradient-to-br from-shusmo-yellow to-yellow-500 rounded-shusmo flex items-center justify-center shadow-lg overflow-hidden border-4 border-white">
                    <img
                      src={game.image}
                      alt={game.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                
                {/* Game Info */}
                <div className="flex-1 text-center md:text-left">
                  <h1 className="text-2xl md:text-3xl font-extrabold text-shusmo-black mb-2">
                    {game.title}
                  </h1>
                  <p className="text-gray-600 mb-4 text-sm md:text-base">{game.shortDescription}</p>
                  
                  {/* Rating & Downloads Row */}
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 md:gap-6">
                    {/* Rating */}
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 md:w-6 md:h-6 text-shusmo-yellow" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <div>
                        <span className="font-bold text-shusmo-black">{game.rating}</span>
                        <span className="text-gray-500 text-xs md:text-sm ml-1">({game.reviews.toLocaleString()})</span>
                      </div>
                    </div>
                    
                    {/* Divider */}
                    <div className="hidden md:block w-px h-6 bg-gray-300" />
                    
                    {/* Downloads */}
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 md:w-6 md:h-6 text-shusmo-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      <div>
                        <span className="font-bold text-shusmo-black">{game.downloads}</span>
                      </div>
                    </div>
                    
                    {/* Genre Badge */}
                    <div className="hidden md:flex items-center gap-2">
                      <svg className="w-5 h-5 md:w-6 md:h-6 text-shusmo-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                      <div>
                        <span className="font-bold text-shusmo-black">{game.genre}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
                  <a
                    href={game.googlePlayUrl}
                    className="btn-primary flex items-center justify-center gap-2 min-w-[160px]"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.537-.279.978.978 0 01-.287-.695V2.788a.978.978 0 01.287-.695.996.996 0 01.536-.279zm10.89 10.89l2.607-2.607a3.543 3.543 0 000-5.012l-2.607 2.607 5.012 5.012zm-5.012 5.012l2.607 2.607a3.543 3.543 0 005.012 0l-2.607-2.607-5.012 5.012z"/>
                    </svg>
                    <span>Install</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
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
          
          {/* Game Summary Cards */}
          <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            <div className="card p-4 text-center">
              <div className="w-12 h-12 bg-shusmo-yellow rounded-shusmo flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-shusmo-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                </svg>
              </div>
              <p className="text-sm text-gray-500 mb-1">Platforms</p>
              <p className="font-bold text-shusmo-black">{game.platforms.join(', ')}</p>
            </div>
            
            <div className="card p-4 text-center">
              <div className="w-12 h-12 bg-shusmo-yellow rounded-shusmo flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-shusmo-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-sm text-gray-500 mb-1">Released</p>
              <p className="font-bold text-shusmo-black">{game.releaseDate}</p>
            </div>
            
            <div className="card p-4 text-center">
              <div className="w-12 h-12 bg-shusmo-yellow rounded-shusmo flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-shusmo-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <p className="text-sm text-gray-500 mb-1">Age Rating</p>
              <p className="font-bold text-shusmo-black">{game.ageRating}</p>
            </div>
            
            <div className="card p-4 text-center">
              <div className="w-12 h-12 bg-shusmo-yellow rounded-shusmo flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-shusmo-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </div>
              <p className="text-sm text-gray-500 mb-1">Downloads</p>
              <p className="font-bold text-shusmo-black">{game.downloads}</p>
            </div>
          </section>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Tabs Navigation */}
              <div className="flex gap-2 border-b-2 border-gray-100 pb-1">
                {['overview', 'gameplay', 'updates'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-6 py-3 font-semibold rounded-t-shusmo transition-all duration-200 ${
                      activeTab === tab
                        ? 'bg-shusmo-yellow text-shusmo-black'
                        : 'text-gray-500 hover:text-shusmo-black'
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="card p-6 md:p-8">
                {activeTab === 'overview' && (
                  <div>
                    <h2 className="text-2xl font-bold text-shusmo-black mb-4">About the Game</h2>
                    <p className="text-gray-600 leading-relaxed mb-6">{game.description}</p>
                    <p className="text-gray-600 leading-relaxed">{game.longDescription}</p>
                  </div>
                )}
                
                {activeTab === 'gameplay' && (
                  <div>
                    <h2 className="text-2xl font-bold text-shusmo-black mb-6">Key Features</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {game.features.map((feature, index) => (
                        <div key={index} className="flex items-start gap-3 p-4 bg-gray-50 rounded-shusmo">
                          <svg className="w-5 h-5 text-shusmo-yellow mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span className="text-gray-700 text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {activeTab === 'updates' && (
                  <div>
                    <h2 className="text-2xl font-bold text-shusmo-black mb-6">Recent Updates</h2>
                    <div className="space-y-6">
                      {game.updates.map((update, index) => (
                        <div key={index} className="border-l-4 border-shusmo-yellow pl-6">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-sm font-bold text-shusmo-yellow">v{update.version}</span>
                            <span className="text-sm text-gray-400">•</span>
                            <span className="text-sm text-gray-500">{update.date}</span>
                          </div>
                          <h3 className="text-lg font-bold text-shusmo-black mb-2">{update.title}</h3>
                          <ul className="space-y-1">
                            {update.changes.map((change, i) => (
                              <li key={i} className="text-gray-600 text-sm flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-shusmo-yellow rounded-full" />
                                {change}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Screenshots Section */}
              <section>
                <h2 className="text-2xl font-bold text-shusmo-black mb-6">Screenshots</h2>
                <ScreenshotsCarousel screenshots={game.screenshots} gameTitle={game.title} />
              </section>

              {/* Ratings Section */}
              <section className="card p-6 md:p-8">
                <h2 className="text-2xl font-bold text-shusmo-black mb-6">Player Reviews</h2>
                <div className="flex items-center gap-6 mb-8">
                  <div className="text-center">
                    <div className="text-5xl font-extrabold text-shusmo-black mb-2">{game.rating}</div>
                    <div className="flex items-center justify-center gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-6 h-6 ${i < Math.floor(game.rating) ? 'text-shusmo-yellow' : 'text-gray-300'}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-gray-500 text-sm">{game.reviews.toLocaleString()} reviews</p>
                  </div>
                  <div className="flex-1 h-24 bg-gray-100 rounded-shusmo flex items-center justify-center">
                    <p className="text-gray-400 text-sm italic">"An absolute masterpiece of mobile gaming!"</p>
                  </div>
                </div>
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

      {/* Bottom CTA Section */}
      <section className="bg-shusmo-yellow py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-shusmo-black mb-4">
            Ready to Start Your Adventure?
          </h2>
          <p className="text-shusmo-black/80 text-lg mb-8 max-w-2xl mx-auto">
            Download {game.title} now and join millions of players worldwide.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href={game.googlePlayUrl}
              className="btn-primary flex items-center gap-2 bg-shusmo-black text-white hover:bg-gray-800"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.537-.279.978.978 0 01-.287-.695V2.788a.978.978 0 01.287-.695.996.996 0 01.536-.279zm10.89 10.89l2.607-2.607a3.543 3.543 0 000-5.012l-2.607 2.607 5.012 5.012zm-5.012 5.012l2.607 2.607a3.543 3.543 0 005.012 0l-2.607-2.607-5.012 5.012z"/>
              </svg>
              <span>Google Play</span>
            </a>
            <a
              href={game.appStoreUrl}
              className="btn-primary flex items-center gap-2 bg-shusmo-black text-white hover:bg-gray-800"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-.8 1.94-.8s.17 1.47-.56 2.3c-.73.83-1.94.8-1.94.8s-.17-1.47.56-2.3z"/>
              </svg>
              <span>App Store</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}

export default GameDetails
