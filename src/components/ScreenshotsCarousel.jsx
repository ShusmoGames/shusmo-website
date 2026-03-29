import { useState } from 'react'

/**
 * ScreenshotsCarousel Component
 * Interactive carousel for game screenshots with navigation
 * @param {string[]} screenshots - Array of screenshot URLs
 * @param {string} gameTitle - Game title for alt text
 */
function ScreenshotsCarousel({ screenshots, gameTitle }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showFullscreen, setShowFullscreen] = useState(false)

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? screenshots.length - 1 : prev - 1))
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === screenshots.length - 1 ? 0 : prev + 1))
  }

  const openFullscreen = (index) => {
    setCurrentIndex(index)
    setShowFullscreen(true)
  }

  const closeFullscreen = () => {
    setShowFullscreen(false)
  }

  const handleFullscreenPrevious = (e) => {
    e.stopPropagation()
    goToPrevious()
  }

  const handleFullscreenNext = (e) => {
    e.stopPropagation()
    goToNext()
  }

  if (!screenshots || screenshots.length === 0) return null

  return (
    <div className="relative">
      {/* Main Image */}
      <div className="relative aspect-video rounded-shusmo overflow-hidden shadow-lg bg-gray-100">
        <img
          src={screenshots[currentIndex]}
          alt={`${gameTitle} screenshot ${currentIndex + 1}`}
          className="w-full h-full object-contain transition-opacity duration-300 cursor-pointer"
          onClick={() => openFullscreen(currentIndex)}
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

        {/* Click to expand hint */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white text-xs font-medium px-4 py-2 rounded-full opacity-0 hover:opacity-100 transition-opacity">
          Click to expand
        </div>
      </div>

      {/* Thumbnails */}
      {screenshots.length > 1 && (
        <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
          {screenshots.map((screenshot, index) => (
            <button
              key={index}
              onClick={() => openFullscreen(index)}
              className={`flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden transition-all duration-200 bg-gray-100 ${
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

      {/* Fullscreen Modal */}
      {showFullscreen && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
          onClick={closeFullscreen}
        >
          {/* Close Button */}
          <button
            onClick={closeFullscreen}
            className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 p-3 rounded-full transition-colors z-10"
            aria-label="Close fullscreen"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Navigation Arrows */}
          {screenshots.length > 1 && (
            <>
              <button
                onClick={handleFullscreenPrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 p-4 rounded-full transition-colors"
                aria-label="Previous screenshot"
              >
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={handleFullscreenNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 p-4 rounded-full transition-colors"
                aria-label="Next screenshot"
              >
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          {/* Fullscreen Image */}
          <div
            className="max-w-7xl max-h-[90vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={screenshots[currentIndex]}
              alt={`${gameTitle} screenshot ${currentIndex + 1}`}
              className="max-w-full max-h-[90vh] object-contain"
            />
          </div>

          {/* Counter */}
          {screenshots.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/20 text-white text-sm font-medium px-4 py-2 rounded-full">
              {currentIndex + 1} / {screenshots.length}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default ScreenshotsCarousel
