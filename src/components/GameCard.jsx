import { Link } from 'react-router-dom'

/**
 * GameCard Component
 * Clean clickable card with image and game name overlay
 * Links to the game details page
 * @param {Object} game - Game object with id, name, slug, cover_url, and icon_url
 */
function GameCard({ game }) {
  // Use cover_url first, then icon_url, then default logo
  const coverImage = game.cover_url?.trim() || game.icon_url?.trim() || '/logo.png'
  // Use id as slug if slug is null/empty
  const gameSlug = game.slug?.trim() || game.id

  return (
    <Link
      to={`/games/${gameSlug}`}
      className="group relative h-80 rounded-shusmo overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-gray-300"
    >
      {/* Game Image */}
      <img
        src={coverImage}
        alt={game.name}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        loading="lazy"
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

      {/* Game Name Overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-5">
        <h3 className="text-xl font-semibold text-white mb-2 line-clamp-2">
          {game.name}
        </h3>
        <div className="flex items-center gap-2 text-white/70 text-sm">
          <span>View Details</span>
          <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  )
}

export default GameCard
