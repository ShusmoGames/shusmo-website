import { useParams, useNavigate } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize from 'rehype-sanitize'
import { usePage } from '../hooks/usePages'

/**
 * PageDetails Component
 * Public page for displaying dynamic CMS pages
 * Fetches published page content by slug and renders it
 */
function PageDetails() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { page, loading, error } = usePage(slug)

  // Handle loading state
  if (loading) {
    return (
      <section className="min-h-screen px-4 py-16 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-shusmo-yellow mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading page...</p>
        </div>
      </section>
    )
  }

  // Handle error or page not found
  if (error || !page) {
    const isNotFound = error?.includes('not found') || error === 'Page not found'
    
    return (
      <section className="min-h-screen px-4 py-16 flex items-center justify-center">
        <div className="text-center max-w-2xl mx-auto">
          <div className="mb-6">
            <svg className="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-shusmo-black mb-4">
            {isNotFound ? 'Page Not Found' : 'Error Loading Page'}
          </h2>
          <p className="text-gray-600 mb-2 text-lg">
            {isNotFound 
              ? `The page "${slug}" doesn't exist or hasn't been published yet.`
              : error || 'An unexpected error occurred while loading the page.'
            }
          </p>
          <p className="text-gray-500 mb-8 text-sm">
            Slug: <code className="bg-gray-100 px-2 py-1 rounded font-mono">{slug}</code>
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => navigate(-1)}
              className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-shusmo hover:bg-gray-50 transition-colors"
            >
              Go Back
            </button>
            <button
              onClick={() => navigate('/')}
              className="btn-primary"
            >
              Go Home
            </button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="min-h-screen px-4 py-16">
      <div className="max-w-4xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-shusmo-black mb-4">
            {page.title}
          </h1>
          <div className="w-20 h-1 bg-shusmo-yellow mx-auto rounded-shusmo"></div>
        </div>

        {/* Page Content */}
        <article className="prose prose-lg max-w-4xl mx-auto">
          {page.content?.trim() ? (
            <div className="
              prose-headings:text-shusmo-black prose-headings:font-bold prose-headings:mt-8 prose-headings:first:mt-0
              prose-h1:text-4xl md:prose-h1:text-5xl prose-h1:mb-6 prose-h1:pb-4 prose-h1:border-b-2 prose-h1:border-shusmo-yellow/20
              prose-h2:text-3xl md:prose-h2:text-4xl prose-h2:mb-4
              prose-h3:text-2xl md:prose-h3:text-3xl prose-h3:mb-3
              prose-h4:text-xl md:prose-h4:text-2xl
              prose-p:my-4 prose-p:leading-relaxed
              prose-a:text-shusmo-yellow prose-a:no-underline hover:prose-a:underline prose-a:font-medium
              prose-strong:text-shusmo-black prose-strong:font-semibold
              prose-code:bg-gray-100 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm prose-code:font-mono
              prose-pre:bg-shusmo-black prose-pre:text-white prose-pre:rounded-shusmo prose-pre:shadow-lg prose-pre:my-6
              prose-blockquote:border-l-4 prose-blockquote:border-shusmo-yellow prose-blockquote:bg-gray-50 prose-blockquote:px-6 prose-blockquote:py-4 prose-blockquote:rounded-r-shusmo prose-blockquote:italic prose-blockquote:my-6
              prose-ul:my-4 prose-ul:list-disc prose-ul:marker:text-shusmo-yellow prose-li:my-2
              prose-ol:my-4 prose-ol:list-decimal prose-ol:marker:text-shusmo-yellow prose-li:my-2
              prose-hr:border-gray-200 prose-hr:my-8
              prose-img:rounded-shusmo prose-img:shadow-md prose-img:max-w-full prose-img:h-auto prose-img:mx-auto prose-img:my-6
              prose-table:my-6 prose-table:overflow-hidden
            ">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw, rehypeSanitize]}
                components={{
                  // Custom paragraph rendering to preserve spacing
                  p: ({ node, ...props }) => (
                    <p className="my-4 leading-relaxed first:mt-0 last:mb-0" {...props} />
                  ),
                  // Custom link rendering - external links open in new tab
                  a: ({ node, ...props }) => {
                    const href = props.href || ''
                    const isExternal = href.startsWith('http') || href.startsWith('//')
                    
                    return (
                      <a
                        {...props}
                        className="text-shusmo-yellow hover:underline font-medium transition-colors"
                        target={isExternal ? '_blank' : undefined}
                        rel={isExternal ? 'noopener noreferrer' : undefined}
                      />
                    )
                  },
                  // Custom code block rendering
                  code: ({ node, inline, className, children, ...props }) => {
                    const match = /language-(\w+)/.exec(className || '')
                    const hasLanguage = match && !inline
                    
                    if (hasLanguage) {
                      return (
                        <div className="my-6 rounded-shusmo overflow-hidden shadow-lg">
                          <div className="bg-gray-800 px-4 py-2 flex items-center justify-between">
                            <span className="text-gray-300 text-xs font-mono">{match[1]}</span>
                            <button
                              onClick={() => navigator.clipboard?.writeText(String(children))}
                              className="text-gray-400 hover:text-white transition-colors text-xs"
                              title="Copy code"
                            >
                              Copy
                            </button>
                          </div>
                          <pre className="bg-shusmo-black text-white p-4 overflow-x-auto m-0">
                            <code className={className} {...props}>
                              {children}
                            </code>
                          </pre>
                        </div>
                      )
                    }
                    
                    return (
                      <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono text-shusmo-black" {...props}>
                        {children}
                      </code>
                    )
                  },
                  // Custom image rendering
                  img: ({ node, ...props }) => (
                    <img
                      {...props}
                      className="rounded-shusmo shadow-md max-w-full h-auto mx-auto"
                      loading="lazy"
                      alt={props.alt || 'Image'}
                    />
                  ),
                  // Custom table rendering (GFM)
                  table: ({ node, ...props }) => (
                    <div className="overflow-x-auto my-6 rounded-shusmo shadow-md border border-gray-200">
                      <table className="w-full border-collapse" {...props} />
                    </div>
                  ),
                  th: ({ node, ...props }) => (
                    <th className="bg-shusmo-black text-white px-4 py-3 text-left font-semibold border-b-2" {...props} />
                  ),
                  td: ({ node, ...props }) => (
                    <td className="px-4 py-3 border-b border-gray-200" {...props} />
                  ),
                  tr: ({ node, ...props }) => (
                    <tr className="hover:bg-gray-50 transition-colors even:bg-gray-50/50" {...props} />
                  ),
                  // Custom blockquote
                  blockquote: ({ node, ...props }) => (
                    <blockquote className="border-l-4 border-shusmo-yellow bg-gray-50 px-6 py-4 rounded-r-shusmo italic text-gray-700 my-6" {...props} />
                  ),
                  // Custom horizontal rule
                  hr: ({ node, ...props }) => (
                    <hr className="my-8 border-gray-200" {...props} />
                  ),
                  // Custom list items with better spacing
                  li: ({ node, ...props }) => (
                    <li className="my-2 leading-relaxed" {...props} />
                  ),
                }}
              >
                {page.content}
              </ReactMarkdown>
            </div>
          ) : (
            <p className="text-gray-400 italic text-center text-lg">No content available.</p>
          )}
        </article>
      </div>
    </section>
  )
}

export default PageDetails
