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

      this.info?.(`route-stubs: wrote ${routes.length} route stubs`)
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

/** Rewrites the shell's head for one route. Body and script tags are untouched. */
function render(shell, route) {
  const url = `${SITE}/${route.path}`
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

function esc(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
