import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

/**
 * Custom hook to fetch all pages from Supabase (admin use)
 * @returns {Object} - { pages, loading, error }
 */
export function usePages() {
  const [pages, setPages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchPages() {
      try {
        const { data, error } = await supabase
          .from('pages')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) throw error
        setPages(data || [])
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchPages()
  }, [])

  return { pages, loading, error }
}

/**
 * Custom hook to fetch a single page by slug from Supabase (public use)
 * @param {string} slug - Page slug
 * @returns {Object} - { page, loading, error }
 */
export function usePage(slug) {
  const [page, setPage] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchPage() {
      if (!slug) {
        setError('No slug provided')
        setLoading(false)
        return
      }

      try {
        // Clean the slug: trim whitespace and convert to lowercase
        const cleanSlug = slug.trim().toLowerCase()
        
        console.log('usePage: Fetching page with slug:', cleanSlug)

        const { data, error: fetchError } = await supabase
          .from('pages')
          .select('*')
          .eq('slug', cleanSlug)
          .eq('published', true)
          .maybeSingle() // Use maybeSingle instead of single to handle 0 results gracefully

        if (fetchError) {
          console.error('usePage: Error fetching page:', fetchError)
          throw fetchError
        }

        if (!data) {
          console.warn('usePage: No page found with slug:', cleanSlug)
          setError('Page not found')
        } else {
          console.log('usePage: Successfully fetched page:', data.title)
          setPage(data)
          setError(null)
        }
      } catch (err) {
        console.error('usePage: Exception occurred:', err)
        setError(err.message || 'Failed to fetch page')
      } finally {
        setLoading(false)
      }
    }

    fetchPage()
  }, [slug])

  return { page, loading, error }
}

/**
 * Fetch all pages (admin use - includes unpublished)
 * @returns {Promise<{data: Array, error: Object}>}
 */
export async function getPages() {
  try {
    const { data, error } = await supabase
      .from('pages')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return { data: data || [], error: null }
  } catch (err) {
    return { data: [], error: err }
  }
}

/**
 * Fetch a single published page by slug
 * @param {string} slug - Page slug
 * @returns {Promise<{data: Object, error: Object}>}
 */
export async function getPublishedPage(slug) {
  try {
    const { data, error } = await supabase
      .from('pages')
      .select('*')
      .eq('slug', slug)
      .eq('published', true)
      .single()

    if (error) throw error
    return { data, error: null }
  } catch (err) {
    return { data: null, error: err }
  }
}

/**
 * Create a new page
 * @param {Object} pageData - Page data
 * @returns {Promise<{data: Object, error: Object}>}
 */
export async function createPage(pageData) {
  try {
    const { data, error } = await supabase
      .from('pages')
      .insert([pageData])
      .select()
      .single()

    if (error) throw error
    return { data, error: null }
  } catch (err) {
    return { data: null, error: err }
  }
}

/**
 * Update an existing page
 * @param {string|number} id - Page ID
 * @param {Object} pageData - Updated page data
 * @returns {Promise<{data: Object, error: Object}>}
 */
export async function updatePage(id, pageData) {
  try {
    const { data, error } = await supabase
      .from('pages')
      .update(pageData)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return { data, error: null }
  } catch (err) {
    return { data: null, error: err }
  }
}

/**
 * Delete a page
 * @param {string|number} id - Page ID
 * @returns {Promise<{error: Object}>}
 */
export async function deletePage(id) {
  try {
    const { error } = await supabase
      .from('pages')
      .delete()
      .eq('id', id)

    if (error) throw error
    return { error: null }
  } catch (err) {
    return { error: err }
  }
}
