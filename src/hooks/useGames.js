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
 * Custom hook to fetch a single game by ID from Supabase
 * @param {number} id - Game ID
 * @returns {Object} - { game, loading, error }
 */
export function useGame(id) {
  const [game, setGame] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchGame() {
      try {
        const { data, error } = await supabase
          .from('games')
          .select('*')
          .eq('id', id)
          .single()

        if (error) throw error
        setGame(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchGame()
    }
  }, [id])

  return { game, loading, error }
}
