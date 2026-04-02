import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

/**
 * AuthCallback Component
 * Handles OAuth callback from Supabase after Google login
 * Works with hash-based routing for GitHub Pages
 */
function AuthCallback() {
  const navigate = useNavigate()
  const [error, setError] = useState(null)

  useEffect(() => {
    const handleCallback = async () => {
      try {
        console.log('AuthCallback: Starting session handling...')
        console.log('AuthCallback: Current URL:', window.location.href)
        console.log('AuthCallback: Hash:', window.location.hash)
        console.log('AuthCallback: Search:', window.location.search)
        
        // For hash-based routing, Supabase tokens may be in the hash
        // We need to manually extract and set the session
        const hash = window.location.hash
        const hashParams = new URLSearchParams(hash.replace(/^#\/auth\/callback[?#]?/, '#').replace('#', ''))
        
        // Check if we have access_token in the hash (after the route)
        const fullHash = window.location.href.split('#/auth/callback')[1]
        if (fullHash && fullHash.startsWith('#')) {
          // Tokens are after #/auth/callback#
          const tokenHash = fullHash.substring(1) // Remove leading #
          console.log('AuthCallback: Found token hash:', tokenHash.substring(0, 50) + '...')
          
          // Parse the token parameters
          const tokenParams = new URLSearchParams(tokenHash)
          const accessToken = tokenParams.get('access_token')
          const refreshToken = tokenParams.get('refresh_token')
          
          if (accessToken) {
            console.log('AuthCallback: Extracting tokens from hash')
            // Set the session manually using the tokens
            const { data: { session }, error: sessionError } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken || ''
            })
            
            if (sessionError) {
              console.error('AuthCallback: Error setting session:', sessionError)
              throw sessionError
            }
            
            console.log('AuthCallback: Session set successfully')
            
            if (session) {
              console.log('AuthCallback: User email:', session.user?.email)
              
              // Check if user email is @shusmo.io domain
              const userEmail = session.user?.email || ''
              if (!userEmail.endsWith('@shusmo.io')) {
                console.log('AuthCallback: User not authorized')
                await supabase.auth.signOut()
                navigate('/')
                return
              }
            }
          }
        }
        
        // Also try getSession (works if Supabase stored tokens in query params)
        let { data: { session }, error: sessionError } = await supabase.auth.getSession()
        
        if (sessionError) {
          console.error('AuthCallback: Session error:', sessionError)
          throw sessionError
        }

        console.log('AuthCallback: Session obtained:', session ? 'YES' : 'NO')
        
        if (session) {
          console.log('AuthCallback: User email:', session.user?.email)
          
          // Check if user email is @shusmo.io domain
          const userEmail = session.user?.email || ''
          if (!userEmail.endsWith('@shusmo.io')) {
            console.log('AuthCallback: User not authorized, redirecting to home')
            await supabase.auth.signOut()
            navigate('/')
            return
          }

          // Clean up the URL and redirect to admin
          console.log('AuthCallback: User authorized, redirecting to admin')
          // Remove any remaining hash params and do a clean redirect
          window.location.href = '/admin'
        } else {
          // No session, redirect to admin
          console.log('AuthCallback: No session, redirecting to admin')
          navigate('/admin', { replace: true })
        }
      } catch (err) {
        console.error('AuthCallback: Error handling auth callback:', err)
        setError('Authentication failed. Please try again.')
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
