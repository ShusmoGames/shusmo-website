import GameCard from '../components/GameCard'
import { useGames } from '../hooks/useGames'

/**
 * Games Page
 * Displays all games in a responsive grid layout
 */
function Games() {
  const { games, loading, error } = useGames()

  if (loading) {
    return (
      <section className="min-h-screen px-4 py-16 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-shusmo-yellow mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading games...</p>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="min-h-screen px-4 py-16 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-red-600 mb-4">Error Loading Games</h2>
          <p className="text-gray-600 mb-6">{error}</p>
        </div>
      </section>
    )
  }

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
        {games.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No games available yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {games.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default Games
