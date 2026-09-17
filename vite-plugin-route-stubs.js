import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'

const SITE = 'https://shusmo.io'

/**
 * GitHub Pages has no SPA rewrite: it looks for a real file at the request path
 * and serves 404.html when it finds none. Every client-side route therefore
 * answered with a genuine HTTP 404 that only *looked* fine, because 404.html
 * stashed the path and bounced to "/" for the router to pick up. Humans never
 * noticed; crawlers and link-preview scrapers read the status code and left.
 *
 * This plugin writes a copy of the built index.html to each route's directory,
 * so /games is dist/games/index.html -- a real 200, with its own title, meta
 * description and Open Graph tags. The copy is the full app shell, so the SPA
 * boots directly at that URL with no redirect hop.
 *
 * Game pages are enumerated from Supabase at build time. That call is allowed
 * to fail: a build must not depend on the database being reachable, so a
 * failure logs a warning and simply produces fewer stubs.
 */
export default function routeStubs() {
  return {
    name: 'shusmo-route-stubs',
    apply: 'build',
    enforce: 'post',

    // writeBundle, not closeBundle: closeBundle also fires on a FAILED build,
    // where it would happily stamp stubs out of a stale dist/index.html left
    // by the previous run. writeBundle only runs once the bundle is written.
    async writeBundle(options) {
      const outDir = options.dir || 'dist'
      let shell
      try {
        shell = await readFile(join(outDir, 'index.html'), 'utf8')
      } catch {
        this.warn('route-stubs: dist/index.html not found, skipping')
        return
      }

      const routes = [
        {
          path: 'games',
          title: 'Our Games | Shusmo',
          description:
            'Every game we have made. Browse the full Shusmo catalogue and find your next favourite.',
        },
        {
          path: 'about',
          title: 'About | Shusmo',
          description:
            'Who we are and why we make games that feel like home. Meet the studio behind Shusmo.',
        },
      ]

      for (const game of await fetchGames(this)) {
        routes.push({
          path: `games/${game.slug}`,
          title: `${game.name} | Shusmo`,
          description:
            firstSentence(game.short_description) ||
            `${game.name}, a mobile game by Shusmo.`,
          image: game.cover_url?.trim() || game.icon_url?.trim() || undefined,
        })
      }

      for (const route of routes) {
        const file = join(outDir, route.path, 'index.html')
        await mkdir(dirname(file), { recursive: true })
        await writeFile(file, render(shell, route), 'utf8')
      }

      await writeFile(join(outDir, 'sitemap.xml'), sitemap(routes), 'utf8')

      this.info?.(
        `route-stubs: wrote ${routes.length} route stubs + sitemap.xml`,
      )
    },
  }
}

async function fetchGames(ctx) {
  const url = process.env.VITE_SUPABASE_URL
  const key = process.env.VITE_SUPABASE_ANON_KEY
  if (!url || !key) {
    ctx.warn('route-stubs: Supabase env absent, no per-game stubs written')
    return []
  }

  const query =
    '/rest/v1/games?published=eq.true&slug=not.is.null' +
    '&select=slug,name,short_description,cover_url,icon_url'

  try {
    const res = await fetch(url.replace(/\/$/, '') + query, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
    })
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
    const rows = await res.json()
    return rows.filter((row) => row.slug?.trim() && row.name?.trim())
  } catch (err) {
    ctx.warn(`route-stubs: could not list games (${err.message}), no per-game stubs`)
    return []
  }
}

/**
 * The canonical URL of a stub carries a trailing slash, because that is what
 * Pages actually serves: a request for /games is 301'd to /games/, which is
 * where dist/games/index.html lives. Pointing canonical at the redirecting
 * form would make every page's declared URL disagree with the one that
 * answers 200.
 */
function canonicalUrl(path) {
  return `${SITE}/${path}/`
}

/** Rewrites the shell's head for one route. Body and script tags are untouched. */
function render(shell, route) {
  const url = canonicalUrl(route.path)
  const image = absolute(route.image) || `${SITE}/logo.png`
  const title = esc(route.title)
  const description = esc(route.description)

  return (
    shell
      .replace(/<title>[\s\S]*?<\/title>/, `<title>${title}</title>`)
      .replace(/(<meta name="title" content=)"[^"]*"/, `$1"${title}"`)
      .replace(
        /<meta name="description"\s*\n?\s*content="[^"]*">/,
        `<meta name="description" content="${description}">`,
      )
      .replace(/(<meta property="og:url" content=)"[^"]*"/, `$1"${url}"`)
      .replace(/(<meta property="og:title" content=)"[^"]*"/, `$1"${title}"`)
      .replace(
        /<meta property="og:description"\s*\n?\s*content="[^"]*">/,
        `<meta property="og:description" content="${description}">`,
      )
      .replace(/(<meta property="og:image" content=)"[^"]*"/, `$1"${image}"`)
      .replace(/(<meta property="twitter:url" content=)"[^"]*"/, `$1"${url}"`)
      .replace(/(<meta property="twitter:title" content=)"[^"]*"/, `$1"${title}"`)
      .replace(
        /<meta property="twitter:description"\s*\n?\s*content="[^"]*">/,
        `<meta property="twitter:description" content="${description}">`,
      )
      .replace(/(<meta property="twitter:image" content=)"[^"]*"/, `$1"${image}"`)
      // Tell search engines which URL is canonical for this route.
      .replace('</head>', `  <link rel="canonical" href="${url}">\n</head>`)
  )
}

/** Scrapers do not resolve relative og:image paths -- they need an absolute URL. */
function absolute(src) {
  if (!src?.trim()) return undefined
  const value = src.trim()
  if (/^https?:\/\//i.test(value)) return value
  return SITE + (value.startsWith('/') ? value : `/${value}`)
}

function firstSentence(text) {
  const value = text?.trim()
  if (!value) return undefined
  const clipped = value.length > 200 ? `${value.slice(0, 197).trimEnd()}...` : value
  return clipped.replace(/\s+/g, ' ')
}

/**
 * A crawlable route nothing links to is still invisible, so the plugin also
 * publishes the list it just generated. Only URLs that answer 200 belong here:
 * the stub routes, the home page, and the hand-written static pages. /admin
 * never gets a stub and so never appears, which is what we want.
 */
function sitemap(routes) {
  const lastmod = new Date().toISOString().slice(0, 10)
  const entries = [
    { loc: `${SITE}/`, priority: '1.0' },
    ...routes.map((route) => ({
      loc: canonicalUrl(route.path),
      priority: route.path.includes('/') ? '0.8' : '0.9',
    })),
    { loc: `${SITE}/privacy.html`, priority: '0.3' },
    { loc: `${SITE}/terms.html`, priority: '0.3' },
    { loc: `${SITE}/platform.html`, priority: '0.3' },
  ]

  const urls = entries
    .map(
      ({ loc, priority }) =>
        `  <url>\n` +
        `    <loc>${esc(loc)}</loc>\n` +
        `    <lastmod>${lastmod}</lastmod>\n` +
        `    <priority>${priority}</priority>\n` +
        `  </url>`,
    )
    .join('\n')

  return (
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    `${urls}\n` +
    '</urlset>\n'
  )
}

function esc(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
