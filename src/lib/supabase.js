import { createClient } from '@supabase/supabase-js'

// Validate environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Missing Supabase environment variables. Please check your .env file.')
}

// Production-optimized Supabase client configuration
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Auto-refresh tokens before expiry
    autoRefreshToken: true,
    // Persist session in localStorage
    persistSession: true,
    // Detect session changes in other tabs
    detectSessionInUrl: true,
  },
  // Global fetch options for better performance
  global: {
    headers: {
      'X-Client-Info': 'shusmo-website/1.0.0',
    },
  },
  // Realtime configuration (disabled for static content, enabled for auth)
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
})

// Helper function to check if Supabase is properly configured
export function isSupabaseConfigured() {
  return !!(supabaseUrl && supabaseAnonKey)
}

// Helper function to get the current user safely
export async function getCurrentUser() {
  try {
    const { data: { session } } = await supabase.auth.getSession()
    return session?.user || null
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}

// Helper function to check if user is admin (@shusmo.io domain)
export function isAdminUser(user) {
  if (!user) return false
  const email = user.email || ''
  return email.endsWith('@shusmo.io')
}
