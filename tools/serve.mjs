#!/usr/bin/env node
// @ts-check
/**
 * Zero-dependency static server for dist/ that behaves like GitHub Pages:
 *  - serves under site.basePath (e.g. http://localhost:4000/kingdom-love-springs/)
 *  - "/path/" → path/index.html, "/path" → 301 to "/path/" when it's a folder
 *  - unknown paths → dist/404.html with status 404
 *  - live reload via Server-Sent Events (dev builds inject /__livereload.js)
 *
 *   node tools/serve.mjs            serve the existing dist/
 *   node tools/serve.mjs --watch    dev build + watch + live reload (npm run dev)
 *   node tools/serve.mjs --port 4001
 */

import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { gzipSync } from 'node:zlib';

import { DIST, SRC, watch } from './build.mjs';
import { normaliseBase } from '../src/lib/url.mjs';

const args = process.argv.slice(2);
const portArg = args.indexOf('--port');
const PORT = Number(portArg >= 0 ? args[portArg + 1] : process.env.PORT || 4000);
const WATCH = args.includes('--watch');

const site = JSON.parse(await readFile(path.join(SRC, 'data/site.json'), 'utf8'));
const BASE = normaliseBase(process.env.BASE_PATH ?? site.basePath ?? '');

/** @type {Record<string, string>} */
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.pdf': 'application/pdf',
  '.md': 'text/plain; charset=utf-8',
};

/** @type {Set<http.ServerResponse>} */
const clients = new Set();

const LIVERELOAD_JS = `// dev only
const es = new EventSource(${JSON.stringify(BASE + '/__livereload')});
es.addEventListener('reload', () => location.reload());
`;

/** @param {string} file */
async function isFile(file) {
  try {
    return (await stat(file)).isFile();
  } catch {
    return false;
  }
}

/** @param {string} dir */
async function isDir(dir) {
  try {
    return (await stat(dir)).isDirectory();
  } catch {
    return false;
  }
}

/** Text types are gzipped, as GitHub Pages does. */
const COMPRESSIBLE = /^(text\/|application\/(json|xml)|image\/svg)/;

/**
 * @param {http.ServerResponse} res
 * @param {number} status
 * @param {string} file
 * @param {string} [acceptEncoding]
 */
async function sendFile(res, status, file, acceptEncoding = '') {
  let body = await readFile(file);
  const type = MIME[path.extname(file).toLowerCase()] || 'application/octet-stream';
  /** @type {Record<string, string>} */
  const headers = { 'Content-Type': type, 'Cache-Control': 'no-cache', Vary: 'Accept-Encoding' };
  if (COMPRESSIBLE.test(type) && /\bgzip\b/.test(acceptEncoding)) {
    body = gzipSync(body);
    headers['Content-Encoding'] = 'gzip';
  }
  res.writeHead(status, headers);
  res.end(body);
}

/**
 * @param {http.ServerResponse} res
 * @param {http.IncomingMessage} req
 */
async function notFound(res, req) {
  const file = path.join(DIST, '404.html');
  if (await isFile(file)) return sendFile(res, 404, file, req.headers['accept-encoding']);
  res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('404 Not Found');
}

const server = http.createServer(async (req, res) => {
  try {
    const { pathname: rawPath } = new URL(req.url || '/', 'http://localhost');
    let pathname = decodeURIComponent(rawPath);

    // Live reload endpoints
    if (pathname === BASE + '/__livereload') {
      res.writeHead(200, { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', Connection: 'keep-alive' });
      res.write(': connected\n\n');
      clients.add(res);
      req.on('close', () => clients.delete(res));
      return;
    }
    if (pathname === BASE + '/__livereload.js') {
      res.writeHead(200, { 'Content-Type': MIME['.js'], 'Cache-Control': 'no-cache' });
      res.end(LIVERELOAD_JS);
      return;
    }

    // Everything lives under the base path, as on github.io/<repo>/
    if (BASE) {
      if (pathname === '/' ) {
        res.writeHead(302, { Location: BASE + '/' });
        res.end();
        return;
      }
      if (pathname !== BASE && !pathname.startsWith(BASE + '/')) return notFound(res, req);
      pathname = pathname.slice(BASE.length) || '/';
    }

    const target = path.normalize(path.join(DIST, pathname));
    if (target !== DIST && !target.startsWith(DIST + path.sep)) return notFound(res, req); // path traversal

    if (pathname.endsWith('/')) {
      const index = path.join(target, 'index.html');
      return (await isFile(index)) ? sendFile(res, 200, index, req.headers['accept-encoding']) : notFound(res, req);
    }
    if (await isFile(target)) return sendFile(res, 200, target, req.headers['accept-encoding']);
    if (await isDir(target)) {
      res.writeHead(301, { Location: BASE + pathname + '/' });
      res.end();
      return;
    }
    return notFound(res, req);
  } catch (err) {
    console.error(err);
    res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('500 Internal Server Error');
  }
});

// Keep SSE connections alive through proxies/sleep
setInterval(() => {
  for (const c of clients) c.write(': ping\n\n');
}, 25_000).unref();

server.listen(PORT, () => {
  console.log(`→ http://localhost:${PORT}${BASE}/`);
});

if (WATCH) {
  watch({
    onRebuild: () => {
      for (const c of clients) c.write('event: reload\ndata: now\n\n');
    },
  });
}
