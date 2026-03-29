/**
 * About Page
 * Studio mission and information
 */
function About() {
  return (
    <section className="min-h-screen px-4 py-16">
      <div className="max-w-4xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-16">
          <img
            src="/Logo character.png"
            alt="Shusmo Character"
            className="h-32 md:h-48 mx-auto"
          />
          <h2 className="text-4xl md:text-5xl font-extrabold text-shusmo-black mb-4">
            About Shusmo
          </h2>
        </div>

        {/* Mission Section */}
        <div className="card p-8 md:p-12 mb-8">
          <h3 className="text-2xl font-bold text-shusmo-black mb-4">
            Our Mission
          </h3>
          <p className="text-lg text-gray-600 leading-relaxed mb-6">
            At Shusmo, we believe games should feel like home. We're a mobile 
            game studio dedicated to creating experiences that warm the heart, 
            spark curiosity, and bring people together.
          </p>
          <p className="text-lg text-gray-600 leading-relaxed">
            Our team of passionate developers, artists, and storytellers work 
            tirelessly to craft games that resonate with players of all ages. 
            Every pixel, every sound, every interaction is designed with care 
            and purpose.
          </p>
        </div>

        {/* Values Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card p-6 text-center">
            <div className="w-14 h-14 bg-shusmo-yellow rounded-shusmo flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-shusmo-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h4 className="font-bold text-lg mb-2">Made with Love</h4>
            <p className="text-gray-600 text-sm">Every game is a labor of love</p>
          </div>

          <div className="card p-6 text-center">
            <div className="w-14 h-14 bg-shusmo-yellow rounded-shusmo flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-shusmo-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h4 className="font-bold text-lg mb-2">Player First</h4>
            <p className="text-gray-600 text-sm">Your joy is our priority</p>
          </div>

          <div className="card p-6 text-center">
            <div className="w-14 h-14 bg-shusmo-yellow rounded-shusmo flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-shusmo-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h4 className="font-bold text-lg mb-2">Creative Innovation</h4>
            <p className="text-gray-600 text-sm">Pushing boundaries always</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About
