import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { useNavigate } from 'react-router-dom'
import AdminAuth from './AdminAuth'
import GameForm from '../../components/admin/GameForm'
import PageForm from '../../components/admin/PageForm'
import { deletePage } from '../../hooks/usePages'

/**
 * AdminPage Component
 * Game management dashboard for administrators
 */
function AdminPage() {
  const navigate = useNavigate()
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('games') // 'games' or 'pages'
  
  // Games state
  const [games, setGames] = useState([])
  const [gameView, setGameView] = useState('list') // 'list', 'add', 'edit'
  const [selectedGame, setSelectedGame] = useState(null)
  const [showGameDeleteModal, setShowGameDeleteModal] = useState(false)
  const [gameToDelete, setGameToDelete] = useState(null)
  const [gameDeleteConfirmText, setGameDeleteConfirmText] = useState('')
  const [isDeletingGame, setIsDeletingGame] = useState(false)
  
  // Pages state
  const [pages, setPages] = useState([])
  const [pageView, setPageView] = useState('list') // 'list', 'add', 'edit'
  const [selectedPage, setSelectedPage] = useState(null)
  const [showPageDeleteModal, setShowPageDeleteModal] = useState(false)
  const [pageToDelete, setPageToDelete] = useState(null)
  const [pageDeleteConfirmText, setPageDeleteConfirmText] = useState('')
  const [isDeletingPage, setIsDeletingPage] = useState(false)

  // Check authentication status and domain restriction
  useEffect(() => {
    // First check if there's a token stored by auth.html
    const storedToken = localStorage.getItem('sb-xwnyuazmtjryterxuzir-auth-token');
    if (storedToken) {
      console.log('AdminPage: Found stored token, refreshing session...');
    }
    
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        // Check if user email is @shusmo.io domain
        const userEmail = session.user?.email || ''
        if (!userEmail.endsWith('@shusmo.io')) {
          // Log out user and redirect to home
          supabase.auth.signOut()
          navigate('/')
          return
        }
      }
      setSession(session)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session) {
          // Check domain on auth state change
          const userEmail = session.user?.email || ''
          if (!userEmail.endsWith('@shusmo.io')) {
            supabase.auth.signOut()
            navigate('/')
            return
          }
        }
        setSession(session)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  // Fetch data when authenticated or tab changes
  useEffect(() => {
    if (session) {
      if (activeTab === 'games') {
        fetchGames()
      } else {
        fetchPages()
      }
    }
  }, [session, activeTab])

  const fetchGames = async () => {
    try {
      const { data, error } = await supabase
        .from('games')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setGames(data || [])
    } catch (error) {
      console.error('Error fetching games:', error)
    }
  }

  const fetchPages = async () => {
    try {
      const { data, error } = await supabase
        .from('pages')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setPages(data || [])
    } catch (error) {
      console.error('Error fetching pages:', error)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setSession(null)
  }

  const handleEditGame = (game) => {
    setSelectedGame(game)
    setGameView('edit')
  }

  const handleDeleteGame = (game) => {
    setGameToDelete(game)
    setShowGameDeleteModal(true)
    setGameDeleteConfirmText('')
  }

  const confirmDeleteGame = async () => {
    if (!gameToDelete) return

    // Check if the confirm text matches the game name
    if (gameDeleteConfirmText.trim() !== gameToDelete.name) {
      return
    }

    setIsDeletingGame(true)
    try {
      // First, delete associated images from storage
      const imagesToDelete = []

      if (gameToDelete.icon_url) {
        imagesToDelete.push(gameToDelete.icon_url)
      }
      if (gameToDelete.cover_url) {
        imagesToDelete.push(gameToDelete.cover_url)
      }
      if (gameToDelete.images && gameToDelete.images.length > 0) {
        imagesToDelete.push(...gameToDelete.images)
      }

      // Delete images from storage
      if (imagesToDelete.length > 0) {
        await deleteImagesFromStorage(imagesToDelete)
      }

      // Then delete the game from database
      const { error } = await supabase
        .from('games')
        .delete()
        .eq('id', gameToDelete.id)

      if (error) throw error

      setGames(games.filter(g => g.id !== gameToDelete.id))
      setShowGameDeleteModal(false)
      setGameToDelete(null)
      setGameDeleteConfirmText('')
    } catch (error) {
      alert('Error deleting game: ' + error.message)
    } finally {
      setIsDeletingGame(false)
    }
  }

  // Helper function to delete images from Supabase Storage
  const deleteImagesFromStorage = async (imageUrls) => {
    try {
      // Extract file paths from URLs
      const pathsToDelete = imageUrls
        .filter(url => url && url.includes('game-images'))
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

  const cancelDeleteGame = () => {
    setShowGameDeleteModal(false)
    setGameToDelete(null)
    setGameDeleteConfirmText('')
  }

  const handleGameSaveSuccess = () => {
    fetchGames()
    setGameView('list')
    setSelectedGame(null)
  }

  const handleEditPage = (page) => {
    setSelectedPage(page)
    setPageView('edit')
  }

  const handleDeletePage = (page) => {
    setPageToDelete(page)
    setShowPageDeleteModal(true)
    setPageDeleteConfirmText('')
  }

  const confirmDeletePage = async () => {
    if (!pageToDelete) return

    if (pageDeleteConfirmText.trim() !== pageToDelete.title) {
      return
    }

    setIsDeletingPage(true)
    try {
      const { error } = await deletePage(pageToDelete.id)
      if (error) throw error

      setPages(pages.filter(p => p.id !== pageToDelete.id))
      setShowPageDeleteModal(false)
      setPageToDelete(null)
      setPageDeleteConfirmText('')
    } catch (error) {
      alert('Error deleting page: ' + error.message)
    } finally {
      setIsDeletingPage(false)
    }
  }

  const cancelDeletePage = () => {
    setShowPageDeleteModal(false)
    setPageToDelete(null)
    setPageDeleteConfirmText('')
  }

  const handlePageSaveSuccess = () => {
    fetchPages()
    setPageView('list')
    setSelectedPage(null)
  }

  // Show auth screen if not logged in
  if (!session) {
    return <AdminAuth onLoginSuccess={() => {}} />
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-shusmo-black mb-2">Admin Dashboard</h1>
            <p className="text-gray-600">Manage your games and pages</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-3 bg-white px-4 py-2 rounded-shusmo shadow">
              <img
                src={session.user.user_metadata.avatar_url || '/logo.png'}
                alt={session.user.user_metadata.name || 'User'}
                className="w-8 h-8 rounded-full"
              />
              <span className="text-sm font-medium text-gray-700">
                {session.user.user_metadata.name || session.user.email}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-gray-600 hover:text-shusmo-black font-medium transition-colors"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => {
              setActiveTab('games')
              setGameView('list')
              setPageView('list')
            }}
            className={`px-6 py-3 font-semibold rounded-shusmo transition-all duration-200 ${
              activeTab === 'games'
                ? 'bg-shusmo-yellow text-shusmo-black shadow-md'
                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Games
            </div>
          </button>
          <button
            onClick={() => {
              setActiveTab('pages')
              setGameView('list')
              setPageView('list')
            }}
            className={`px-6 py-3 font-semibold rounded-shusmo transition-all duration-200 ${
              activeTab === 'pages'
                ? 'bg-shusmo-yellow text-shusmo-black shadow-md'
                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Pages
            </div>
          </button>
        </div>

        {/* Content */}
        <div className="bg-white rounded-shusmo shadow-lg p-6 md:p-8">
          {/* Games Tab Content */}
          {activeTab === 'games' && gameView === 'list' && (
            <>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-shusmo-black">Games</h2>
                <button
                  onClick={() => setGameView('add')}
                  className="flex items-center gap-2 bg-shusmo-yellow hover:bg-yellow-400 text-shusmo-black font-semibold px-5 py-2.5 rounded-shusmo transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Game
                </button>
              </div>

              {games.length === 0 ? (
                <div className="text-center py-12">
                  <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
                  </svg>
                  <p className="text-gray-600 text-lg mb-4">No games yet</p>
                  <button
                    onClick={() => setGameView('add')}
                    className="text-shusmo-yellow hover:text-yellow-600 font-medium"
                  >
                    Add your first game →
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Game</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 hidden md:table-cell">Status</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 hidden lg:table-cell">Genre</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 hidden lg:table-cell">Slug</th>
                        <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {games.map((game) => (
                        <tr
                          key={game.id}
                          className={`border-b hover:bg-gray-50 ${!game.published ? 'bg-gray-50' : ''}`}
                        >
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={game.icon_url?.trim() || '/logo.png'}
                                alt={game.name}
                                className="w-12 h-12 object-cover rounded-shusmo"
                              />
                              <div>
                                <p className="font-medium text-shusmo-black">{game.name}</p>
                                <p className="text-sm text-gray-500 truncate max-w-xs">{game.short_description || 'No description'}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4 hidden md:table-cell">
                            {game.published ? (
                              <span className="flex items-center gap-1.5 text-green-700">
                                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                <span className="text-sm font-medium">Published</span>
                              </span>
                            ) : (
                              <span className="flex items-center gap-1.5 text-gray-600">
                                <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                                <span className="text-sm font-medium">Draft</span>
                              </span>
                            )}
                          </td>
                          <td className="py-4 px-4 hidden lg:table-cell">
                            <span className="bg-shusmo-yellow/20 text-shusmo-black text-sm font-medium px-3 py-1 rounded-full">
                              {game.genre?.trim() || 'N/A'}
                            </span>
                          </td>
                          <td className="py-4 px-4 hidden lg:table-cell">
                            <code className="text-sm text-gray-600">{game.slug?.trim() || game.id}</code>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleEditGame(game)}
                                className="p-2 text-gray-600 hover:text-shusmo-yellow hover:bg-shusmo-yellow/10 rounded-full transition-colors"
                                title="Edit"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </button>
                              <button
                                onClick={() => handleDeleteGame(game)}
                                className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                                title="Delete"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}

          {activeTab === 'games' && (gameView === 'add' || gameView === 'edit') && (
            <div>
              <div className="flex items-center gap-2 mb-6">
                <button
                  onClick={() => {
                    setGameView('list')
                    setSelectedGame(null)
                  }}
                  className="p-2 text-gray-600 hover:text-shusmo-black hover:bg-gray-100 rounded-full transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <h2 className="text-xl font-bold text-shusmo-black">
                  {gameView === 'add' ? 'Add New Game' : 'Edit Game'}
                </h2>
              </div>
              <GameForm
                game={selectedGame}
                onSave={handleGameSaveSuccess}
                onCancel={() => {
                  setGameView('list')
                  setSelectedGame(null)
                }}
              />
            </div>
          )}

          {/* Pages Tab Content */}
          {activeTab === 'pages' && pageView === 'list' && (
            <>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-shusmo-black">Pages</h2>
                <button
                  onClick={() => setPageView('add')}
                  className="flex items-center gap-2 bg-shusmo-yellow hover:bg-yellow-400 text-shusmo-black font-semibold px-5 py-2.5 rounded-shusmo transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Page
                </button>
              </div>

              {pages.length === 0 ? (
                <div className="text-center py-12">
                  <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-gray-600 text-lg mb-4">No pages yet</p>
                  <button
                    onClick={() => setPageView('add')}
                    className="text-shusmo-yellow hover:text-yellow-600 font-medium"
                  >
                    Add your first page →
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Title</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 hidden md:table-cell">Status</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 hidden lg:table-cell">Slug</th>
                        <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pages.map((page) => (
                        <tr
                          key={page.id}
                          className={`border-b hover:bg-gray-50 ${!page.published ? 'bg-gray-50' : ''}`}
                        >
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-shusmo-yellow/20 rounded-shusmo flex items-center justify-center">
                                <svg className="w-6 h-6 text-shusmo-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                              </div>
                              <div>
                                <p className="font-medium text-shusmo-black">{page.title}</p>
                                <p className="text-sm text-gray-500 truncate max-w-xs">
                                  {page.content ? page.content.substring(0, 60) + '...' : 'No content'}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4 hidden md:table-cell">
                            {page.published ? (
                              <span className="flex items-center gap-1.5 text-green-700">
                                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                <span className="text-sm font-medium">Published</span>
                              </span>
                            ) : (
                              <span className="flex items-center gap-1.5 text-gray-600">
                                <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                                <span className="text-sm font-medium">Draft</span>
                              </span>
                            )}
                          </td>
                          <td className="py-4 px-4 hidden lg:table-cell">
                            <code className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">{page.slug}</code>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleEditPage(page)}
                                className="p-2 text-gray-600 hover:text-shusmo-yellow hover:bg-shusmo-yellow/10 rounded-full transition-colors"
                                title="Edit"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </button>
                              <button
                                onClick={() => handleDeletePage(page)}
                                className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                                title="Delete"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}

          {activeTab === 'pages' && (pageView === 'add' || pageView === 'edit') && (
            <div>
              <div className="flex items-center gap-2 mb-6">
                <button
                  onClick={() => {
                    setPageView('list')
                    setSelectedPage(null)
                  }}
                  className="p-2 text-gray-600 hover:text-shusmo-black hover:bg-gray-100 rounded-full transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <h2 className="text-xl font-bold text-shusmo-black">
                  {pageView === 'add' ? 'Add New Page' : 'Edit Page'}
                </h2>
              </div>
              <PageForm
                page={selectedPage}
                onSave={handlePageSaveSuccess}
                onCancel={() => {
                  setPageView('list')
                  setSelectedPage(null)
                }}
              />
            </div>
          )}
          {/* Game Delete Confirmation Modal */}
          {showGameDeleteModal && gameToDelete && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-shusmo max-w-md w-full p-6 shadow-xl">
                <div className="mb-4">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-shusmo-black mb-2">
                    Delete Game
                  </h3>
                  <p className="text-gray-600">
                    This action cannot be undone. This will permanently delete the game
                    <span className="font-semibold text-shusmo-black"> "{gameToDelete.name}"</span>
                    .
                  </p>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type <span className="font-semibold text-shusmo-black">"{gameToDelete.name}"</span> to confirm:
                  </label>
                  <input
                    type="text"
                    value={gameDeleteConfirmText}
                    onChange={(e) => setGameDeleteConfirmText(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-shusmo focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Enter game name"
                    autoFocus
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={confirmDeleteGame}
                    disabled={gameDeleteConfirmText.trim() !== gameToDelete.name || isDeletingGame}
                    className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-red-300 disabled:cursor-not-allowed text-white font-semibold px-4 py-2.5 rounded-shusmo transition-colors flex items-center justify-center gap-2"
                  >
                    {isDeletingGame ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Deleting...
                      </>
                    ) : (
                      'Delete Game'
                    )}
                  </button>
                  <button
                    onClick={cancelDeleteGame}
                    disabled={isDeletingGame}
                    className="flex-1 border border-gray-300 text-gray-700 font-semibold px-4 py-2.5 rounded-shusmo hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Page Delete Confirmation Modal */}
          {showPageDeleteModal && pageToDelete && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-shusmo max-w-md w-full p-6 shadow-xl">
                <div className="mb-4">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-shusmo-black mb-2">
                    Delete Page
                  </h3>
                  <p className="text-gray-600">
                    This action cannot be undone. This will permanently delete the page
                    <span className="font-semibold text-shusmo-black"> "{pageToDelete.title}"</span>
                    .
                  </p>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type <span className="font-semibold text-shusmo-black">"{pageToDelete.title}"</span> to confirm:
                  </label>
                  <input
                    type="text"
                    value={pageDeleteConfirmText}
                    onChange={(e) => setPageDeleteConfirmText(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-shusmo focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Enter page title"
                    autoFocus
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={confirmDeletePage}
                    disabled={pageDeleteConfirmText.trim() !== pageToDelete.title || isDeletingPage}
                    className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-red-300 disabled:cursor-not-allowed text-white font-semibold px-4 py-2.5 rounded-shusmo transition-colors flex items-center justify-center gap-2"
                  >
                    {isDeletingPage ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Deleting...
                      </>
                    ) : (
                      'Delete Page'
                    )}
                  </button>
                  <button
                    onClick={cancelDeletePage}
                    disabled={isDeletingPage}
                    className="flex-1 border border-gray-300 text-gray-700 font-semibold px-4 py-2.5 rounded-shusmo hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminPage
