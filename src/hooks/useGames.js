import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

/**
 * Custom hook to fetch games data from Supabase
 * @returns {Object} - { games, loading, error }
 */
export function useGames() {
  const [games, setGames] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchGames() {
      try {
        const { data, error } = await supabase
          .from('games')
          .select('*')
          .eq('published', true)
          .order('created_at', { ascending: false })

        if (error) throw error
        setGames(data || [])
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchGames()
  }, [])

  return { games, loading, error }
}

/**
 * Custom hook to fetch a single game by slug from Supabase
 * @param {string|number} slug - Game slug or ID
 * @returns {Object} - { game, loading, error }
 */
export function useGame(slug) {
  const [game, setGame] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchGame() {
      try {
        // Check if slug is actually a number (ID fallback)
        const isNumeric = !isNaN(slug) && !isNaN(parseFloat(slug))
        
        let query
        if (isNumeric) {
          // If slug is numeric, try to find by ID first
          query = supabase
            .from('games')
            .select('*')
            .eq('id', slug)
        } else {
          // Otherwise search by slug
          query = supabase
            .from('games')
            .select('*')
            .eq('slug', slug)
        }
        
        const { data, error } = await query.single()

        if (error) throw error
        setGame(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    if (slug) {
      fetchGame()
    }
  }, [slug])

  return { game, loading, error }
}
