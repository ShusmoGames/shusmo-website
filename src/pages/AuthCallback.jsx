import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

/**
 * AuthCallback Component
 * Handles OAuth callback from Supabase after Google login
 * Extracts tokens from URL and redirects to admin page
 */
function AuthCallback() {
  const navigate = useNavigate()
  const [error, setError] = useState(null)

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Supabase JS client automatically handles the OAuth callback
        // when there are auth parameters in the URL
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()

        if (sessionError) throw sessionError

        if (session) {
          // Check if user email is @shusmo.io domain
          const userEmail = session.user?.email || ''
          if (!userEmail.endsWith('@shusmo.io')) {
            await supabase.auth.signOut()
            navigate('/')
            return
          }

          // Redirect to admin page with clean URL (no hash conflicts)
          navigate('/admin', { replace: true })
        } else {
          // No session, redirect to admin (auth state will be handled by AdminPage)
          navigate('/admin', { replace: true })
        }
      } catch (err) {
        console.error('Error handling auth callback:', err)
        setError('Authentication failed. Please try again.')
        // Redirect to admin after a short delay
        setTimeout(() => navigate('/admin', { replace: true }), 2000)
      }
    }

    handleCallback()
  }, [navigate])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-shusmo-yellow mx-auto"></div>
        <p className="mt-4 text-gray-600 font-medium">
          {error ? error : 'Completing sign in...'}
        </p>
        {error && (
          <p className="mt-2 text-sm text-gray-500">
            Redirecting you back...
          </p>
        )}
      </div>
    </div>
  )
}

export default AuthCallback
