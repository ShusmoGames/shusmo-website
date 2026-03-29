import { Link } from 'react-router-dom'

/**
 * HeroSection Component
 * Main hero section with bold heading and CTA
 * Used on the Home page to make a strong first impression
 */
function HeroSection() {
  return (
    <section className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="text-center max-w-4xl mx-auto">
        {/* Logo Character */}
        <div className="mb-8">
          <img
            src="/Logo character.png"
            alt="Shusmo Character"
            className="h-32 md:h-48 mx-auto"
          />
        </div>

        {/* Main Heading */}
        <h1 className="text-5xl md:text-7xl font-extrabold text-shusmo-black mb-6 leading-tight">
          We make games that
          <span className="block text-shusmo-yellow">feel like home</span>
        </h1>

        {/* Subheading */}
        <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
          At Shusmo, we craft unforgettable gaming experiences that bring joy, 
          comfort, and adventure to players around the world.
        </p>

        {/* CTA Button */}
        <Link to="/games" className="btn-primary inline-block">
          Explore Our Games
        </Link>
      </div>
    </section>
  )
}

export default HeroSection
