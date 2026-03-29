/**
 * GameCard Component
 * Displays game with image, descriptions, genre badge, and store download buttons
 * @param {Object} game - Game object with title, descriptions, genre, image, and store URLs
 */
function GameCard({ game }) {
  return (
    <article className="card bg-white overflow-hidden">
      {/* Game Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={game.image}
          alt={game.title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
          loading="lazy"
        />
        {/* Genre Badge Overlay */}
        <span className="absolute top-4 right-4 bg-shusmo-yellow text-shusmo-black text-sm font-semibold px-4 py-1 rounded-full shadow-md">
          {game.genre}
        </span>
      </div>

      {/* Card Content */}
      <div className="p-6">
        {/* Game Title */}
        <h3 className="text-2xl font-bold text-shusmo-black mb-2">
          {game.title}
        </h3>

        {/* Short Description */}
        <p className="text-shusmo-yellow font-medium text-sm mb-3">
          {game.shortDescription}
        </p>

        {/* Full Description */}
        <p className="text-gray-600 text-sm leading-relaxed mb-6">
          {game.description}
        </p>

        {/* Store Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Google Play Button */}
          <a
            href={game.googlePlayUrl}
            className="flex-1 flex items-center justify-center gap-2 bg-shusmo-black text-white font-medium px-4 py-3 rounded-shusmo hover:bg-gray-800 transition-colors duration-200"
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Download ${game.title} on Google Play`}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.537-.279.978.978 0 01-.287-.695V2.788a.978.978 0 01.287-.695.996.996 0 01.536-.279zm10.89 10.89l2.607-2.607a3.543 3.543 0 000-5.012l-2.607 2.607 5.012 5.012zm-5.012 5.012l2.607 2.607a3.543 3.543 0 005.012 0l-2.607-2.607-5.012 5.012z"/>
            </svg>
            <span>Google Play</span>
          </a>

          {/* App Store Button */}
          <a
            href={game.appStoreUrl}
            className="flex-1 flex items-center justify-center gap-2 bg-shusmo-black text-white font-medium px-4 py-3 rounded-shusmo hover:bg-gray-800 transition-colors duration-200"
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Download ${game.title} on the App Store`}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-.8 1.94-.8s.17 1.47-.56 2.3c-.73.83-1.94.8-1.94.8s-.17-1.47.56-2.3z"/>
            </svg>
            <span>App Store</span>
          </a>
        </div>
      </div>
    </article>
  )
}

export default GameCard
