import { Link } from 'react-router-dom'

/**
 * GameCard Component
 * Clean clickable card with image and game name overlay
 * Links to the game details page
 * @param {Object} game - Game object with id, title, and image
 */
function GameCard({ game }) {
  return (
    <Link 
      to={`/games/${game.id}`}
      className="group relative h-80 rounded-shusmo overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]"
    >
      {/* Game Image */}
      <img
        src={game.image}
        alt={game.title}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        loading="lazy"
      />
      
      {/* Dark Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      
      {/* Game Name Overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <h3 className="text-2xl font-bold text-white mb-1">
          {game.title}
        </h3>
        <span className="text-shusmo-yellow text-sm font-medium">
          View Details →
        </span>
      </div>
    </Link>
  )
}

export default GameCard
