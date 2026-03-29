import { gamesData } from '../data/gamesData'
import GameCard from '../components/GameCard'

/**
 * Games Page
 * Displays all games in a responsive grid layout
 */
function Games() {
  return (
    <section className="min-h-screen px-4 py-16">
      <div className="max-w-6xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold text-shusmo-black mb-4">
            Our Games
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover the worlds we've created. Each game is crafted with love 
            and designed to bring joy to players everywhere.
          </p>
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {gamesData.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Games
