import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import AdminAuth from './AdminAuth'
import GameForm from '../../components/admin/GameForm'

/**
 * AdminPage Component
 * Game management dashboard for administrators
 */
function AdminPage() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [games, setGames] = useState([])
  const [view, setView] = useState('list') // 'list', 'add', 'edit'
  const [selectedGame, setSelectedGame] = useState(null)
  const [deletingId, setDeletingId] = useState(null)

  // Check authentication status
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  // Fetch games when authenticated
  useEffect(() => {
    if (session) {
      fetchGames()
    }
  }, [session])

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

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setSession(null)
  }

  const handleEdit = (game) => {
    setSelectedGame(game)
    setView('edit')
  }

  const handleDelete = async (id, name) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) {
      return
    }

    setDeletingId(id)
    try {
      const { error } = await supabase
        .from('games')
        .delete()
        .eq('id', id)

      if (error) throw error

      setGames(games.filter(g => g.id !== id))
    } catch (error) {
      alert('Error deleting game: ' + error.message)
    } finally {
      setDeletingId(null)
    }
  }

  const handleSaveSuccess = () => {
    fetchGames()
    setView('list')
    setSelectedGame(null)
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
            <p className="text-gray-600">Manage your games</p>
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

        {/* Content */}
        <div className="bg-white rounded-shusmo shadow-lg p-6 md:p-8">
          {view === 'list' && (
            <>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-shusmo-black">Games</h2>
                <button
                  onClick={() => setView('add')}
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
                    onClick={() => setView('add')}
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
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 hidden md:table-cell">Genre</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 hidden lg:table-cell">Slug</th>
                        <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {games.map((game) => (
                        <tr key={game.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={game.icon_url}
                                alt={game.name}
                                className="w-12 h-12 object-cover rounded-shusmo"
                              />
                              <div>
                                <p className="font-medium text-shusmo-black">{game.name}</p>
                                <p className="text-sm text-gray-500 truncate max-w-xs">{game.short_description}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4 hidden md:table-cell">
                            <span className="bg-shusmo-yellow/20 text-shusmo-black text-sm font-medium px-3 py-1 rounded-full">
                              {game.genre || 'N/A'}
                            </span>
                          </td>
                          <td className="py-4 px-4 hidden lg:table-cell">
                            <code className="text-sm text-gray-600">{game.slug}</code>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleEdit(game)}
                                className="p-2 text-gray-600 hover:text-shusmo-yellow hover:bg-shusmo-yellow/10 rounded-full transition-colors"
                                title="Edit"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </button>
                              <button
                                onClick={() => handleDelete(game.id, game.name)}
                                disabled={deletingId === game.id}
                                className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors disabled:opacity-50"
                                title="Delete"
                              >
                                {deletingId === game.id ? (
                                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-600"></div>
                                ) : (
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                )}
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

          {(view === 'add' || view === 'edit') && (
            <div>
              <div className="flex items-center gap-2 mb-6">
                <button
                  onClick={() => {
                    setView('list')
                    setSelectedGame(null)
                  }}
                  className="p-2 text-gray-600 hover:text-shusmo-black hover:bg-gray-100 rounded-full transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <h2 className="text-xl font-bold text-shusmo-black">
                  {view === 'add' ? 'Add New Game' : 'Edit Game'}
                </h2>
              </div>
              <GameForm
                game={selectedGame}
                onSave={handleSaveSuccess}
                onCancel={() => {
                  setView('list')
                  setSelectedGame(null)
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminPage
