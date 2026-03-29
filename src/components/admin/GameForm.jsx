import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

/**
 * GameForm Component
 * Form for adding and editing game data
 */
function GameForm({ game, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    icon_url: '',
    cover_url: '',
    short_description: '',
    full_description: '',
    trailer_url: '',
    google_play_link: '',
    app_store_link: '',
    genre: '',
    social_links: { discord: '', twitter: '', reddit: '', youtube: '', instagram: '', facebook: '' },
    images: []
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [newImage, setNewImage] = useState('')

  // Load game data when editing
  useEffect(() => {
    if (game) {
      setFormData({
        name: game.name || '',
        slug: game.slug || '',
        icon_url: game.icon_url || '',
        cover_url: game.cover_url || '',
        short_description: game.short_description || '',
        full_description: game.full_description || '',
        trailer_url: game.trailer_url || '',
        google_play_link: game.google_play_link || '',
        app_store_link: game.app_store_link || '',
        genre: game.genre || '',
        social_links: {
          discord: game.social_links?.discord || '',
          twitter: game.social_links?.twitter || '',
          reddit: game.social_links?.reddit || '',
          youtube: game.social_links?.youtube || '',
          instagram: game.social_links?.instagram || '',
          facebook: game.social_links?.facebook || ''
        },
        images: game.images || []
      })
    }
  }, [game])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSocialChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      social_links: {
        ...prev.social_links,
        [name]: value
      }
    }))
  }

  const handleAddImage = () => {
    if (newImage.trim()) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, newImage.trim()]
      }))
      setNewImage('')
    }
  }

  const handleRemoveImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }

  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  const handleNameChange = (e) => {
    const name = e.target.value
    if (!game) { // Only auto-generate slug for new games
      setFormData(prev => ({
        ...prev,
        name,
        slug: generateSlug(name)
      }))
    } else {
      setFormData(prev => ({ ...prev, name }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Prepare social_links object (only include non-empty values)
      const socialLinks = Object.fromEntries(
        Object.entries(formData.social_links).filter(([_, value]) => value.trim())
      )

      const gameData = {
        ...formData,
        social_links: socialLinks
      }

      const { error } = game
        ? await supabase
            .from('games')
            .update(gameData)
            .eq('id', game.id)
        : await supabase
            .from('games')
            .insert([gameData])

      if (error) throw error

      onSave()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-shusmo">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Game Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleNameChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-shusmo focus:ring-2 focus:ring-shusmo-yellow focus:border-transparent"
            placeholder="Enter game name"
          />
        </div>

        {/* Slug */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Slug *
          </label>
          <input
            type="text"
            name="slug"
            value={formData.slug}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-shusmo focus:ring-2 focus:ring-shusmo-yellow focus:border-transparent"
            placeholder="game-name"
          />
          <p className="mt-1 text-xs text-gray-500">URL-friendly name (e.g., cosmic-dreams)</p>
        </div>
      </div>

      {/* URLs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Icon URL */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Icon URL
          </label>
          <input
            type="url"
            name="icon_url"
            value={formData.icon_url}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-shusmo focus:ring-2 focus:ring-shusmo-yellow focus:border-transparent"
            placeholder="https://example.com/icon.png"
          />
          <p className="mt-1 text-xs text-gray-500">Leave empty to use default logo</p>
        </div>

        {/* Cover URL */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cover URL
          </label>
          <input
            type="url"
            name="cover_url"
            value={formData.cover_url}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-shusmo focus:ring-2 focus:ring-shusmo-yellow focus:border-transparent"
            placeholder="https://example.com/cover.jpg"
          />
          <p className="mt-1 text-xs text-gray-500">Leave empty to use default logo</p>
        </div>
      </div>

      {/* Genre */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Genre
        </label>
        <input
          type="text"
          name="genre"
          value={formData.genre}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-shusmo focus:ring-2 focus:ring-shusmo-yellow focus:border-transparent"
          placeholder="e.g., Strategy, Puzzle, Racing"
        />
      </div>

      {/* Descriptions */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Short Description
        </label>
        <input
          type="text"
          name="short_description"
          value={formData.short_description}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-shusmo focus:ring-2 focus:ring-shusmo-yellow focus:border-transparent"
          placeholder="One-line tagline (optional)"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Full Description
        </label>
        <textarea
          name="full_description"
          value={formData.full_description}
          onChange={handleChange}
          rows="6"
          className="w-full px-4 py-3 border border-gray-300 rounded-shusmo focus:ring-2 focus:ring-shusmo-yellow focus:border-transparent"
          placeholder="Complete game description... (optional)"
        />
      </div>

      {/* Trailer URL */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Trailer URL
        </label>
        <input
          type="url"
          name="trailer_url"
          value={formData.trailer_url}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-shusmo focus:ring-2 focus:ring-shusmo-yellow focus:border-transparent"
          placeholder="https://www.youtube.com/watch?v=..."
        />
      </div>

      {/* Store Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Google Play Link
          </label>
          <input
            type="url"
            name="google_play_link"
            value={formData.google_play_link}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-shusmo focus:ring-2 focus:ring-shusmo-yellow focus:border-transparent"
            placeholder="https://play.google.com/..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            App Store Link
          </label>
          <input
            type="url"
            name="app_store_link"
            value={formData.app_store_link}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-shusmo focus:ring-2 focus:ring-shusmo-yellow focus:border-transparent"
            placeholder="https://apps.apple.com/..."
          />
        </div>
      </div>

      {/* Social Links */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-medium text-shusmo-black mb-4">Social Links</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Discord
            </label>
            <input
              type="url"
              name="discord"
              value={formData.social_links.discord}
              onChange={handleSocialChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-shusmo focus:ring-2 focus:ring-shusmo-yellow focus:border-transparent"
              placeholder="https://discord.gg/..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Twitter
            </label>
            <input
              type="url"
              name="twitter"
              value={formData.social_links.twitter}
              onChange={handleSocialChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-shusmo focus:ring-2 focus:ring-shusmo-yellow focus:border-transparent"
              placeholder="https://twitter.com/..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reddit
            </label>
            <input
              type="url"
              name="reddit"
              value={formData.social_links.reddit}
              onChange={handleSocialChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-shusmo focus:ring-2 focus:ring-shusmo-yellow focus:border-transparent"
              placeholder="https://reddit.com/r/..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              YouTube
            </label>
            <input
              type="url"
              name="youtube"
              value={formData.social_links.youtube}
              onChange={handleSocialChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-shusmo focus:ring-2 focus:ring-shusmo-yellow focus:border-transparent"
              placeholder="https://youtube.com/..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Instagram
            </label>
            <input
              type="url"
              name="instagram"
              value={formData.social_links.instagram}
              onChange={handleSocialChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-shusmo focus:ring-2 focus:ring-shusmo-yellow focus:border-transparent"
              placeholder="https://instagram.com/..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Facebook
            </label>
            <input
              type="url"
              name="facebook"
              value={formData.social_links.facebook}
              onChange={handleSocialChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-shusmo focus:ring-2 focus:ring-shusmo-yellow focus:border-transparent"
              placeholder="https://facebook.com/..."
            />
          </div>
        </div>
      </div>

      {/* Screenshots */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-medium text-shusmo-black mb-4">Screenshots</h3>
        
        <div className="flex gap-2 mb-4">
          <input
            type="url"
            value={newImage}
            onChange={(e) => setNewImage(e.target.value)}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-shusmo focus:ring-2 focus:ring-shusmo-yellow focus:border-transparent"
            placeholder="https://example.com/screenshot.jpg"
          />
          <button
            type="button"
            onClick={handleAddImage}
            className="px-4 py-3 bg-shusmo-yellow hover:bg-yellow-400 text-shusmo-black font-semibold rounded-shusmo transition-colors"
          >
            Add
          </button>
        </div>

        {formData.images.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {formData.images.map((image, index) => (
              <div key={index} className="relative group">
                <img
                  src={image}
                  alt={`Screenshot ${index + 1}`}
                  className="w-full h-32 object-cover rounded-shusmo"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Form Actions */}
      <div className="flex gap-4 pt-6 border-t">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-shusmo-yellow hover:bg-yellow-400 text-shusmo-black font-semibold px-6 py-3 rounded-shusmo transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Saving...' : (game ? 'Update Game' : 'Add Game')}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-shusmo hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}

export default GameForm
