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
 * @param {string} slug - Game slug
 * @returns {Object} - { game, loading, error }
 */
export function useGame(slug) {
  const [game, setGame] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchGame() {
      try {
        const { data, error } = await supabase
          .from('games')
          .select('*')
          .eq('slug', slug)
          .single()

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
