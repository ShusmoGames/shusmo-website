import { useParams, Link, useNavigate } from 'react-router-dom'
import { gamesData } from '../data/gamesData'

/**
 * GameDetails Page
 * Displays full game information including description, features, rating, and download buttons
 */
function GameDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  
  // Find the game by ID (convert URL param to number)
  const game = gamesData.find(g => g.id === parseInt(id))
  
  // Handle case when game is not found
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
    <section className="min-h-screen px-4 py-16">
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-shusmo-yellow mb-8 transition-colors duration-200"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
        
        {/* Hero Image */}
        <div className="relative h-64 md:h-96 rounded-shusmo overflow-hidden mb-8 shadow-xl">
          <img
            src={game.image}
            alt={game.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
            <span className="inline-block bg-shusmo-yellow text-shusmo-black text-sm font-semibold px-4 py-1 rounded-full mb-3">
              {game.genre}
            </span>
            <h1 className="text-3xl md:text-5xl font-bold text-white">
              {game.title}
            </h1>
          </div>
        </div>
        
        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Description */}
            <div className="card p-6 md:p-8 mb-6">
              <h2 className="text-xl font-bold text-shusmo-black mb-4">About the Game</h2>
              <p className="text-gray-600 leading-relaxed">
                {game.description}
              </p>
            </div>
            
            {/* Features */}
            <div className="card p-6 md:p-8">
              <h2 className="text-xl font-bold text-shusmo-black mb-4">Features</h2>
              <ul className="space-y-3">
                {game.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-shusmo-yellow mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Stats Card */}
            <div className="card p-6 mb-6">
              <h3 className="text-lg font-bold text-shusmo-black mb-4">Game Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Rating</span>
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-shusmo-yellow" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="font-semibold text-shusmo-black">{game.rating}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Downloads</span>
                  <span className="font-semibold text-shusmo-black">{game.downloads}</span>
                </div>
              </div>
            </div>
            
            {/* Download Buttons */}
            <div className="card p-6">
              <h3 className="text-lg font-bold text-shusmo-black mb-4">Download</h3>
              <div className="space-y-3">
                {/* Google Play Button */}
                <a
                  href={game.googlePlayUrl}
                  className="flex items-center justify-center gap-2 bg-shusmo-black text-white font-medium px-4 py-3 rounded-shusmo hover:bg-gray-800 transition-colors duration-200"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.537-.279.978.978 0 01-.287-.695V2.788a.978.978 0 01.287-.695.996.996 0 01.536-.279zm10.89 10.89l2.607-2.607a3.543 3.543 0 000-5.012l-2.607 2.607 5.012 5.012zm-5.012 5.012l2.607 2.607a3.543 3.543 0 005.012 0l-2.607-2.607-5.012 5.012z"/>
                  </svg>
                  <span>Google Play</span>
                </a>

                {/* App Store Button */}
                <a
                  href={game.appStoreUrl}
                  className="flex items-center justify-center gap-2 bg-shusmo-black text-white font-medium px-4 py-3 rounded-shusmo hover:bg-gray-800 transition-colors duration-200"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-.8 1.94-.8s.17 1.47-.56 2.3c-.73.83-1.94.8-1.94.8s-.17-1.47.56-2.3z"/>
                  </svg>
                  <span>App Store</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default GameDetails
