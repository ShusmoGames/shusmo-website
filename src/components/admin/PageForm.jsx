import { useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize from 'rehype-sanitize'
import { createPage, updatePage } from '../../hooks/usePages'

/**
 * PageForm Component
 * Form for adding and editing CMS pages
 * Matches the existing GameForm design patterns
 */
function PageForm({ page, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    published: true
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [pendingSave, setPendingSave] = useState(null)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [showExitConfirmModal, setShowExitConfirmModal] = useState(false)
  const [previewMode, setPreviewMode] = useState(false) // 'edit' or 'preview'

  // Load page data when editing
  useEffect(() => {
    if (page) {
      setFormData({
        title: page.title || '',
        slug: page.slug || '',
        content: page.content || '',
        published: page.published !== undefined ? page.published : true
      })
    }
  }, [page])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    setHasUnsavedChanges(true)
  }

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
      .replace(/-+/g, '-') // Replace multiple consecutive dashes with single dash
  }

  const handleTitleChange = (e) => {
    const title = e.target.value
    if (!page) { // Only auto-generate slug for new pages
      setFormData(prev => ({
        ...prev,
        title,
        slug: generateSlug(title)
      }))
    } else {
      setFormData(prev => ({ ...prev, title }))
    }
    setHasUnsavedChanges(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validate required fields
    if (!formData.title.trim() || !formData.slug.trim()) {
      setError('Title and slug are required fields.')
      return
    }

    // Normalize slug: trim, lowercase, replace multiple dashes
    const normalizedSlug = formData.slug.trim().toLowerCase().replace(/-+/g, '-')

    const pageData = {
      title: formData.title.trim(),
      slug: normalizedSlug,
      content: formData.content.trim(),
      published: !!formData.published
    }

    // Store pending save and show confirmation modal
    setPendingSave(pageData)
    setShowConfirmModal(true)
  }

  const confirmSave = async () => {
    setLoading(true)
    setError(null)
    setShowConfirmModal(false)

    try {
      const { error } = page
        ? await updatePage(page.id, pendingSave)
        : await createPage(pendingSave)

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

  const cancelSave = () => {
    setPendingSave(null)
    setShowConfirmModal(false)
  }

  const handleCancel = () => {
    // Always show exit confirmation when editing an existing page
    if (page) {
      setShowExitConfirmModal(true)
    } else {
      // For new pages, only show if there are changes
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-shusmo">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {/* Title and Slug */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Page Title *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleTitleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-shusmo focus:ring-2 focus:ring-shusmo-yellow focus:border-transparent"
            placeholder="Enter page title"
          />
          <p className="mt-1 text-xs text-gray-500">The title of the page as it will appear to users</p>
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
            placeholder="page-name"
          />
          <p className="mt-1 text-xs text-gray-500">URL-friendly identifier (e.g., privacy-policy). Auto-generated for new pages.</p>
        </div>
      </div>

      {/* Content */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Content <span className="text-shusmo-yellow font-semibold">(Markdown)</span>
          </label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setPreviewMode(false)}
              className={`px-4 py-2 text-sm font-medium rounded-shusmo transition-all duration-200 ${
                !previewMode
                  ? 'bg-shusmo-yellow text-shusmo-black shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit
              </div>
            </button>
            <button
              type="button"
              onClick={() => setPreviewMode(true)}
              className={`px-4 py-2 text-sm font-medium rounded-shusmo transition-all duration-200 ${
                previewMode
                  ? 'bg-shusmo-yellow text-shusmo-black shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Preview
              </div>
            </button>
          </div>
        </div>

        {previewMode ? (
          /* Preview Mode */
          <div className="min-h-[300px] p-6 border border-gray-300 rounded-shusmo bg-white prose prose-sm max-w-none overflow-y-auto
            prose-headings:text-shusmo-black prose-headings:font-bold prose-headings:mt-6 prose-headings:first:mt-0
            prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg
            prose-p:my-3 prose-p:leading-relaxed prose-p:first:mt-0 prose-p:last:mb-0
            prose-a:text-shusmo-yellow prose-a:no-underline hover:prose-a:underline prose-a:font-medium
            prose-strong:text-shusmo-black prose-strong:font-semibold
            prose-code:bg-gray-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-xs prose-code:font-mono
            prose-pre:bg-shusmo-black prose-pre:text-white prose-pre:rounded-shusmo prose-pre:my-4 prose-pre:p-3
            prose-blockquote:border-l-4 prose-blockquote:border-shusmo-yellow prose-blockquote:bg-gray-50 prose-blockquote:px-4 prose-blockquote:py-2 prose-blockquote:rounded-r-shusmo prose-blockquote:italic prose-blockquote:my-4
            prose-ul:my-3 prose-ul:list-disc prose-ul:marker:text-shusmo-yellow prose-li:my-1.5
            prose-ol:my-3 prose-ol:list-decimal prose-ol:marker:text-shusmo-yellow prose-li:my-1.5
            prose-hr:border-gray-200 prose-hr:my-6
            prose-img:rounded-shusmo prose-img:shadow-md prose-img:max-w-full prose-img:h-auto
          ">
            {formData.content.trim() ? (
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw, rehypeSanitize]}
                components={{
                  p: ({ node, ...props }) => (
                    <p className="my-3 leading-relaxed first:mt-0 last:mb-0" {...props} />
                  ),
                  a: ({ node, ...props }) => (
                    <a
                      {...props}
                      className="text-shusmo-yellow hover:underline font-medium"
                      target={props.href?.startsWith('http') ? '_blank' : undefined}
                      rel={props.href?.startsWith('http') ? 'noopener noreferrer' : undefined}
                    />
                  ),
                  code: ({ node, inline, className, children, ...props }) => {
                    const match = /language-(\w+)/.exec(className || '')
                    const hasLanguage = match && !inline
                    
                    if (hasLanguage) {
                      return (
                        <div className="my-4 rounded-shusmo overflow-hidden shadow">
                          <div className="bg-gray-800 px-3 py-1.5 flex items-center justify-between">
                            <span className="text-gray-300 text-xs font-mono">{match[1]}</span>
                          </div>
                          <pre className="bg-shusmo-black text-white p-3 overflow-x-auto m-0">
                            <code className={className} {...props}>
                              {children}
                            </code>
                          </pre>
                        </div>
                      )
                    }
                    
                    return (
                      <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs font-mono" {...props}>
                        {children}
                      </code>
                    )
                  },
                  img: ({ node, ...props }) => (
                    <img
                      {...props}
                      className="rounded-shusmo shadow-md max-w-full h-auto"
                      loading="lazy"
                    />
                  ),
                  li: ({ node, ...props }) => (
                    <li className="my-1.5 leading-relaxed" {...props} />
                  ),
                }}
              >
                {formData.content}
              </ReactMarkdown>
            ) : (
              <p className="text-gray-400 italic">No content to preview. Start typing in Edit mode.</p>
            )}
          </div>
        ) : (
          /* Edit Mode */
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            rows="12"
            className="w-full px-4 py-3 border border-gray-300 rounded-shusmo focus:ring-2 focus:ring-shusmo-yellow focus:border-transparent font-mono text-sm"
            placeholder="# Heading

This is a paragraph with **bold** and *italic* text.

## Subheading

- List item 1
- List item 2

> Blockquote

[Link text](https://example.com)"
          />
        )}
        <p className="mt-2 text-xs text-gray-500">
          Supports Markdown: # headings, **bold**, *italic*, - lists, {'>'} quotes, `code`, [links](url), ![images](url), | tables |
        </p>
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
            <p className="text-xs text-gray-500">Unpublished pages are hidden from public view</p>
          </div>
        </label>
      </div>

      {/* Form Actions */}
      <div className="flex gap-4 pt-6 border-t">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-shusmo-yellow hover:bg-yellow-400 text-shusmo-black font-semibold px-6 py-3 rounded-shusmo transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Saving...' : (page ? 'Update Page' : 'Add Page')}
        </button>
        <button
          type="button"
          onClick={handleCancel}
          disabled={loading}
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
              {page ? 'Update Page?' : 'Add New Page?'}
            </h3>
            <p className="text-gray-600 mb-6">
              {page
                ? `Are you sure you want to update "${page.title}"?`
                : `Are you sure you want to add "${formData.title}"?`
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

export default PageForm
