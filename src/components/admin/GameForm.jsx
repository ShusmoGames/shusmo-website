import { useState, useEffect, useRef } from 'react'
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
    published: true,
    social_links: { discord: '', twitter: '', reddit: '', youtube: '', instagram: '', facebook: '' },
    images: []
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [newImage, setNewImage] = useState('')
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [pendingSave, setPendingSave] = useState(null)
  const [showExitConfirmModal, setShowExitConfirmModal] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(null) // 'icon', 'cover', or 'screenshot'
  const iconInputRef = useRef(null)
  const coverInputRef = useRef(null)
  const screenshotInputRef = useRef(null)

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
        published: game.published !== undefined ? game.published : true,
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
    setHasUnsavedChanges(true)
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
    setHasUnsavedChanges(true)
  }

  const handleAddImage = () => {
    if (newImage.trim()) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, newImage.trim()]
      }))
      setNewImage('')
      setHasUnsavedChanges(true)
    }
  }

  const handleRemoveImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
    setHasUnsavedChanges(true)
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
    setHasUnsavedChanges(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Prepare social_links object (only include non-empty values)
    const socialLinks = Object.fromEntries(
      Object.entries(formData.social_links).filter(([_, value]) => value.trim())
    )

    const gameData = {
      ...formData,
      social_links: socialLinks
    }

    // Store pending save and show confirmation modal
    setPendingSave(gameData)
    setShowConfirmModal(true)
  }

  const confirmSave = async () => {
    setLoading(true)
    setError(null)
    setShowConfirmModal(false)

    try {
      // If updating, clean up old images
      if (game) {
        const oldImages = []
        
        // Collect old image URLs to delete
        if (game.icon_url && game.icon_url !== formData.icon_url) {
          oldImages.push(game.icon_url)
        }
        if (game.cover_url && game.cover_url !== formData.cover_url) {
          oldImages.push(game.cover_url)
        }
        
        // Find removed screenshots
        if (game.images && game.images.length > 0) {
          const removedScreenshots = game.images.filter(
            url => !formData.images.includes(url)
          )
          oldImages.push(...removedScreenshots)
        }
        
        // Delete old images from storage
        if (oldImages.length > 0) {
          await deleteImagesFromStorage(oldImages)
        }
      }

      const { error } = pendingSave && game
        ? await supabase
            .from('games')
            .update(pendingSave)
            .eq('id', game.id)
        : await supabase
            .from('games')
            .insert([pendingSave])

      if (error) throw error

      setPendingSave(null)
      onSave()
    } catch (err) {
      setError(err.message)
      setPendingSave(null)
    } finally {
      setLoading(false)
    }
  }

  // Helper function to delete images from Supabase Storage
  const deleteImagesFromStorage = async (imageUrls) => {
    try {
      // Extract file paths from URLs
      const pathsToDelete = imageUrls
        .filter(url => url.includes('game-images'))
        .map(url => {
          // Extract path from URL: https://xxx.supabase.co/storage/v1/object/public/game-images/icon/xxx.png
          const parts = url.split('/game-images/')
          return parts.length > 1 ? parts[1] : null
        })
        .filter(path => path !== null)

      if (pathsToDelete.length === 0) return

      // Delete from storage
      const { error } = await supabase.storage
        .from('game-images')
        .remove(pathsToDelete)

      if (error) {
        console.error('Error deleting images:', error)
      }
    } catch (err) {
      console.error('Error in image cleanup:', err)
    }
  }

  const cancelSave = () => {
    setPendingSave(null)
    setShowConfirmModal(false)
  }

  const handleCancel = () => {
    // Always show exit confirmation when editing an existing game
    if (game) {
      setShowExitConfirmModal(true)
    } else {
      // For new games (add mode), only show if there are changes
      if (hasUnsavedChanges) {
        setShowExitConfirmModal(true)
      } else {
        onCancel()
      }
    }
  }

  const confirmExit = () => {
    setShowExitConfirmModal(false)
    setHasUnsavedChanges(false)
    onCancel()
  }

  const cancelExit = () => {
    setShowExitConfirmModal(false)
  }

  // Handle image upload to Supabase Storage
  const handleImageUpload = async (e, type) => {
    const file = e.target.files[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB')
      return
    }

    setUploadingImage(type)
    setError(null)

    try {
      // Create unique filename
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
      const filePath = `${type}/${fileName}`

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('game-images')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('game-images')
        .getPublicUrl(filePath)

      // Update form data based on type
      if (type === 'icon') {
        setFormData(prev => ({ ...prev, icon_url: publicUrl }))
      } else if (type === 'cover') {
        setFormData(prev => ({ ...prev, cover_url: publicUrl }))
      } else if (type === 'screenshot') {
        setFormData(prev => ({ ...prev, images: [...prev.images, publicUrl] }))
      }

      setHasUnsavedChanges(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setUploadingImage(null)
      // Reset file input
      e.target.value = ''
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
          <p className="mt-1 text-xs text-gray-500">The title of your game as it will appear to users</p>
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
          <p className="mt-1 text-xs text-gray-500">URL-friendly identifier (e.g., cosmic-dreams). Auto-generated for new games.</p>
        </div>
      </div>

      {/* URLs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Icon URL */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Icon URL
          </label>
          <div className="relative">
            <input
              type="url"
              name="icon_url"
              value={formData.icon_url}
              onChange={handleChange}
              className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-shusmo focus:ring-2 focus:ring-shusmo-yellow focus:border-transparent"
              placeholder="https://example.com/icon.png"
            />
            <input
              type="file"
              ref={iconInputRef}
              onChange={(e) => handleImageUpload(e, 'icon')}
              accept="image/*"
              className="hidden"
            />
            <button
              type="button"
              onClick={() => iconInputRef.current?.click()}
              disabled={uploadingImage === 'icon'}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-shusmo-yellow transition-colors disabled:opacity-50"
              title="Upload icon image"
            >
              {uploadingImage === 'icon' ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-shusmo-black"></div>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
              )}
            </button>
          </div>
          <p className="mt-1 text-xs text-gray-500">Small square image for the game details page. Leave empty to use default logo.</p>
        </div>

        {/* Cover URL */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cover URL
          </label>
          <div className="relative">
            <input
              type="url"
              name="cover_url"
              value={formData.cover_url}
              onChange={handleChange}
              className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-shusmo focus:ring-2 focus:ring-shusmo-yellow focus:border-transparent"
              placeholder="https://example.com/cover.jpg"
            />
            <input
              type="file"
              ref={coverInputRef}
              onChange={(e) => handleImageUpload(e, 'cover')}
              accept="image/*"
              className="hidden"
            />
            <button
              type="button"
              onClick={() => coverInputRef.current?.click()}
              disabled={uploadingImage === 'cover'}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-shusmo-yellow transition-colors disabled:opacity-50"
              title="Upload cover image"
            >
              {uploadingImage === 'cover' ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-shusmo-black"></div>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
              )}
            </button>
          </div>
          <p className="mt-1 text-xs text-gray-500">Large banner image for game cards. Leave empty to use default logo.</p>
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
        <p className="mt-1 text-xs text-gray-500">Category or type of the game (optional)</p>
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
        <p className="mt-1 text-xs text-gray-500">Brief tagline shown under the game title</p>
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
        <p className="mt-1 text-xs text-gray-500">Detailed description of the game, features, and gameplay</p>
      </div>

      {/* Published Toggle */}
      <div>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            name="published"
            checked={formData.published}
            onChange={(e) => setFormData(prev => ({ ...prev, published: e.target.checked }))}
            className="w-5 h-5 text-shusmo-yellow border-gray-300 rounded focus:ring-2 focus:ring-shusmo-yellow focus:border-transparent"
          />
          <div>
            <span className="text-sm font-medium text-gray-700">Published</span>
            <p className="text-xs text-gray-500">Unpublished games are hidden from the public games page</p>
          </div>
        </label>
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
        <p className="mt-1 text-xs text-gray-500">YouTube video URL for autoplay background and trailer modal</p>
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
          <p className="mt-1 text-xs text-gray-500">Link to the game on Google Play Store</p>
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
          <p className="mt-1 text-xs text-gray-500">Link to the game on Apple App Store</p>
        </div>
      </div>

      {/* Social Links */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-medium text-shusmo-black mb-4">Social Links</h3>
        <p className="text-xs text-gray-500 mb-4">Add links to your game's social media pages (optional)</p>
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
            <p className="mt-1 text-xs text-gray-500">Discord server invite link</p>
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
            <p className="mt-1 text-xs text-gray-500">Twitter/X profile or game page</p>
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
            <p className="mt-1 text-xs text-gray-500">Subreddit for the game</p>
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
            <p className="mt-1 text-xs text-gray-500">YouTube channel link</p>
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
            <p className="mt-1 text-xs text-gray-500">Instagram profile or game page</p>
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
            <p className="mt-1 text-xs text-gray-500">Facebook page link</p>
          </div>
        </div>
      </div>

      {/* Screenshots */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-medium text-shusmo-black mb-4">Screenshots</h3>
        <p className="text-xs text-gray-500 mb-4">Add gameplay screenshots to showcase your game (optional)</p>

        <div className="flex gap-2 mb-4">
          <div className="relative flex-1">
            <input
              type="url"
              value={newImage}
              onChange={(e) => setNewImage(e.target.value)}
              className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-shusmo focus:ring-2 focus:ring-shusmo-yellow focus:border-transparent"
              placeholder="https://example.com/screenshot.jpg"
            />
            <input
              type="file"
              ref={screenshotInputRef}
              onChange={(e) => handleImageUpload(e, 'screenshot')}
              accept="image/*"
              className="hidden"
            />
            <button
              type="button"
              onClick={() => screenshotInputRef.current?.click()}
              disabled={uploadingImage === 'screenshot'}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-shusmo-yellow transition-colors disabled:opacity-50"
              title="Upload screenshot"
            >
              {uploadingImage === 'screenshot' ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-shusmo-black"></div>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
              )}
            </button>
          </div>
          <button
            type="button"
            onClick={handleAddImage}
            className="px-6 py-3 bg-shusmo-yellow hover:bg-yellow-400 text-shusmo-black font-semibold rounded-shusmo transition-colors"
          >
            Add
          </button>
        </div>
        <p className="text-xs text-gray-500 -mt-3 mb-4">Upload images or paste URLs. Click on a screenshot to remove it.</p>

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
          disabled={loading || uploadingImage !== null}
          className="flex-1 bg-shusmo-yellow hover:bg-yellow-400 text-shusmo-black font-semibold px-6 py-3 rounded-shusmo transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Saving...' : uploadingImage !== null ? 'Uploading...' : (game ? 'Update Game' : 'Add Game')}
        </button>
        <button
          type="button"
          onClick={handleCancel}
          disabled={loading || uploadingImage !== null}
          className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-shusmo hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-shusmo max-w-md w-full p-6 shadow-xl">
            <h3 className="text-xl font-bold text-shusmo-black mb-2">
              {game ? 'Update Game?' : 'Add New Game?'}
            </h3>
            <p className="text-gray-600 mb-6">
              {game 
                ? `Are you sure you want to update "${game.name}"?`
                : `Are you sure you want to add "${formData.name}"?`
              }
            </p>
            <div className="flex gap-3">
              <button
                onClick={confirmSave}
                className="flex-1 bg-shusmo-yellow hover:bg-yellow-400 text-shusmo-black font-semibold px-4 py-2.5 rounded-shusmo transition-colors"
              >
                Confirm
              </button>
              <button
                onClick={cancelSave}
                className="flex-1 border border-gray-300 text-gray-700 font-semibold px-4 py-2.5 rounded-shusmo hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Exit Confirmation Modal */}
      {showExitConfirmModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-shusmo max-w-md w-full p-6 shadow-xl">
            <div className="mb-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-shusmo-black mb-2">
                Unsaved Changes
              </h3>
              <p className="text-gray-600">
                You have unsaved changes. Are you sure you want to exit without saving?
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={confirmExit}
                className="flex-1 bg-shusmo-yellow hover:bg-yellow-400 text-shusmo-black font-semibold px-4 py-2.5 rounded-shusmo transition-colors"
              >
                Exit Without Saving
              </button>
              <button
                onClick={cancelExit}
                className="flex-1 border border-gray-300 text-gray-700 font-semibold px-4 py-2.5 rounded-shusmo hover:bg-gray-50 transition-colors"
              >
                Continue Editing
              </button>
            </div>
          </div>
        </div>
      )}
    </form>
  )
}

export default GameForm
