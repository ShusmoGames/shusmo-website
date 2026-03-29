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
      className="group relative h-80 rounded-shusmo overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]"
    >
      {/* Game Image */}
      <img
        src={coverImage}
        alt={game.name}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        loading="lazy"
      />

      {/* Dark Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

      {/* Game Name Overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <h3 className="text-2xl font-bold text-white mb-1">
          {game.name}
        </h3>
        <span className="text-shusmo-yellow text-sm font-medium">
          View Details →
        </span>
      </div>
    </Link>
  )
}

export default GameCard
