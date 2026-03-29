import { useState } from 'react'

/**
 * ScreenshotsCarousel Component
 * Interactive carousel for game screenshots with navigation
 * @param {string[]} screenshots - Array of screenshot URLs
 * @param {string} gameTitle - Game title for alt text
 */
function ScreenshotsCarousel({ screenshots, gameTitle }) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? screenshots.length - 1 : prev - 1))
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === screenshots.length - 1 ? 0 : prev + 1))
  }

  if (!screenshots || screenshots.length === 0) return null

  return (
    <div className="relative">
      {/* Main Image */}
      <div className="relative aspect-video rounded-shusmo overflow-hidden shadow-lg">
        <img
          src={screenshots[currentIndex]}
          alt={`${gameTitle} screenshot ${currentIndex + 1}`}
          className="w-full h-full object-cover transition-opacity duration-300"
        />
        
        {/* Navigation Arrows */}
        {screenshots.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
              aria-label="Previous screenshot"
            >
              <svg className="w-5 h-5 text-shusmo-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
              aria-label="Next screenshot"
            >
              <svg className="w-5 h-5 text-shusmo-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {/* Counter */}
        {screenshots.length > 1 && (
          <div className="absolute top-4 right-4 bg-black/70 text-white text-sm font-medium px-3 py-1 rounded-full">
            {currentIndex + 1} / {screenshots.length}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {screenshots.length > 1 && (
        <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
          {screenshots.map((screenshot, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden transition-all duration-200 ${
                index === currentIndex
                  ? 'ring-2 ring-shusmo-yellow ring-offset-2'
                  : 'opacity-60 hover:opacity-100'
              }`}
            >
              <img
                src={screenshot}
                alt={`${gameTitle} thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default ScreenshotsCarousel
