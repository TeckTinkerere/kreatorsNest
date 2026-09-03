/**
 * prerender
 *
 * KreatorNest is a client-rendered React app, so the HTML the server sends is
 * an empty <div id="root">. Googlebot renders JavaScript and copes; the AI
 * crawlers that increasingly mediate discovery — GPTBot, ClaudeBot,
 * PerplexityBot — do not. They read raw HTML and move on.
 *
 * This script closes that gap without a framework migration: it serves the
 * production build, visits every route in headless Chromium, and writes the
 * fully rendered HTML back to disk as that route's index.html. Netlify then
 * serves real content on first byte, and React takes over on load as before.
 *
 * Run automatically as part of `npm run build`.
 *
 *   node scripts/prerender.mjs [--build-dir build] [--verbose]
 */
import { createServer } from 'node:http';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(here, '..');

const args = process.argv.slice(2);
const VERBOSE = args.includes('--verbose');
const buildDirArg = args.indexOf('--build-dir');
const BUILD_DIR = resolve(
  projectRoot,
  buildDirArg !== -1 ? args[buildDirArg + 1] : 'build'
);

/** Where Playwright's bundled Chromium lives in CI images. */
const CHROMIUM_PATH = process.env.PLAYWRIGHT_CHROMIUM_PATH || '/opt/pw-browsers/chromium';

/**
 * Public origin. Required: the app resolves canonical URLs and JSON-LD ids
 * against it, falling back to window.location.origin when it is unset — which
 * during prerendering is the local server, so an unguarded run would bake
 * http://127.0.0.1 canonicals into every page.
 */
const SITE_URL = (process.env.REACT_APP_SITE_URL || '').trim();

/** Give a route this long to finish rendering before giving up on it. */
const ROUTE_TIMEOUT_MS = 20000;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.webmanifest': 'application/manifest+json',
  '.woff2': 'font/woff2',
};

/**
 * Serve the build directory with SPA fallback, exactly as Netlify's
 * `/* /index.html 200` rule does, so prerendering exercises the real routing.
 *
 * @returns {Promise<{server: import('node:http').Server, port: number}>}
 */
async function serveBuild() {
  // Captured before any route is written. Without this the SPA fallback would
  // serve an already-prerendered page as the shell for the next route, and each
  // snapshot would inherit the previous page's <head> — most visibly its JSON-LD.
  const pristineShell = await readFile(join(BUILD_DIR, 'index.html'));

  const server = createServer(async (req, res) => {
    const url = new URL(req.url, 'http://localhost');
    let filePath = join(BUILD_DIR, decodeURIComponent(url.pathname));

    try {
      if (!extname(filePath) || !existsSync(filePath)) {
        res.writeHead(200, { 'Content-Type': MIME['.html'] });
        res.end(pristineShell);
        return;
      }
      const body = await readFile(filePath);
      res.writeHead(200, { 'Content-Type': MIME[extname(filePath)] || 'application/octet-stream' });
      res.end(body);
    } catch {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not found');
    }
  });

  return new Promise((resolvePort) => {
    server.listen(0, '127.0.0.1', () => resolvePort({ server, port: server.address().port }));
  });
}

/**
 * Read the routes to prerender.
 *
 * Static routes are fixed; scenario article routes come from the bundled
 * content, which is the same content the prerender captures.
 *
 * @returns {Promise<string[]>} Site paths.
 */
async function collectRoutes() {
  const staticRoutes = [
    '/',
    '/starter-kit',
    '/essentials',
    '/resources',
    '/documents',
    '/more',
    '/community',
    '/scenarios',
    '/contributors',
    '/feedback',
  ];

  const { scenarioPosts } = await import(
    new URL('../src/data/scenarioPosts.js', import.meta.url).href
  );

  return [...staticRoutes, ...scenarioPosts.map((post) => `/scenarios/${post.slug}`)];
}

/**
 * Strip artefacts that must not be baked into a static snapshot.
 *
 * Two matter. The service worker registration and PWA capture scripts belong to
 * the live page, not the snapshot — but they are already in index.html and get
 * re-executed on load, so they stay. What must go is Framer Motion's
 * pre-animation state: elements parked at `opacity: 0` waiting for a viewport
 * trigger read to a crawler as hidden content, which is exactly the wrong
 * signal for text we want cited.
 *
 * @param {string} html - Rendered HTML.
 * @returns {string} Snapshot-safe HTML.
 */
function cleanSnapshot(html) {
  return html
    // Framer Motion leaves inline opacity/transform on not-yet-revealed cards.
    .replace(/style="([^"]*?)opacity:\s*0;?([^"]*?)"/g, (match, before, after) => {
      const rest = `${before}${after}`.trim();
      return rest ? `style="${rest}"` : '';
    })
    // Remove the empty style attributes the replacement above can leave behind.
    .replace(/\s+style=""/g, '');
}

/**
 * Prerender every route.
 *
 * @returns {Promise<void>}
 */
async function main() {
  if (!existsSync(join(BUILD_DIR, 'index.html'))) {
    console.error(`prerender: no build found at ${BUILD_DIR} — run the build first.`);
    process.exit(1);
  }

  if (!SITE_URL) {
    console.warn(
      'prerender: REACT_APP_SITE_URL is not set — skipping.\n' +
      '           Prerendering without it would bake localhost canonical URLs and\n' +
      '           JSON-LD ids into every page. Set it to the public origin\n' +
      '           (e.g. https://kreatornest.com) to enable static rendering.'
    );
    return;
  }

  let chromium;
  try {
    ({ chromium } = await import('playwright'));
  } catch {
    console.warn('prerender: playwright not installed — skipping (pages stay client-rendered).');
    return;
  }

  const routes = await collectRoutes();
  const { server, port } = await serveBuild();
  const origin = `http://127.0.0.1:${port}`;

  const launchOptions = { args: ['--no-sandbox', '--disable-dev-shm-usage'] };
  if (existsSync(CHROMIUM_PATH)) launchOptions.executablePath = CHROMIUM_PATH;

  const browser = await chromium.launch(launchOptions);
  const context = await browser.newContext({
    viewport: { width: 1280, height: 1600 },
    // Announce ourselves honestly; nothing should serve this build differently,
    // but a surprising user agent in a log is worse than a boring one.
    userAgent: 'KreatorNestPrerender/1.0 (+build-time static rendering)',
  });

  // The snapshot must reflect the content committed in src/data/, not whatever
  // the live sheet happens to hold during a build, so block the sheet fetch and
  // any third-party beacon. Both re-run in the real browser after hydration.
  await context.route('**://docs.google.com/**', (route) => route.abort());
  await context.route('**://cloud.umami.is/**', (route) => route.abort());

  let succeeded = 0;
  const failures = [];

  for (const routePath of routes) {
    const page = await context.newPage();
    try {
      // 'domcontentloaded' rather than 'networkidle': the service worker and
      // font loading can keep the network busy indefinitely, and readiness is
      // established by the content check below anyway.
      await page.goto(`${origin}${routePath}`, {
        waitUntil: 'domcontentloaded',
        timeout: ROUTE_TIMEOUT_MS,
      });

      // Wait for a lazily-loaded route chunk to replace the Suspense fallback.
      await page.waitForFunction(
        () => {
          const root = document.getElementById('root');
          if (!root) return false;
          if (root.querySelector('[data-page-loader]')) return false;
          return (root.textContent || '').trim().length > 200;
        },
        { timeout: ROUTE_TIMEOUT_MS }
      );

      // Scroll the full page so viewport-triggered content is in its revealed
      // state, then settle, so the snapshot is the page as a reader sees it.
      await page.evaluate(async () => {
        const step = window.innerHeight;
        for (let y = 0; y < document.body.scrollHeight; y += step) {
          window.scrollTo(0, y);
          await new Promise((r) => setTimeout(r, 60));
        }
        window.scrollTo(0, 0);
      });
      await page.waitForTimeout(300);

      const html = cleanSnapshot(await page.content());

      const outPath = routePath === '/'
        ? join(BUILD_DIR, 'index.html')
        : join(BUILD_DIR, routePath, 'index.html');

      await mkdir(dirname(outPath), { recursive: true });
      await writeFile(outPath, html, 'utf8');

      succeeded += 1;
      if (VERBOSE) {
        console.log(`  ${routePath.padEnd(42)} ${(html.length / 1024).toFixed(0)} kB`);
      }
    } catch (error) {
      failures.push({ routePath, message: error.message.split('\n')[0] });
    } finally {
      await page.close();
    }
  }

  await browser.close();
  server.close();

  console.log(`prerender: ${succeeded}/${routes.length} routes written to static HTML`);

  if (failures.length > 0) {
    // A route that fails to prerender still works — it just falls back to
    // client rendering — so this is a warning, never a failed build.
    console.warn('prerender: these routes stayed client-rendered:');
    failures.forEach(({ routePath, message }) => console.warn(`  ${routePath} — ${message}`));
  }
}

main().catch((error) => {
  console.error('prerender: failed —', error.message);
  // Never fail the build over prerendering; a client-rendered site still ships.
  process.exit(0);
});
