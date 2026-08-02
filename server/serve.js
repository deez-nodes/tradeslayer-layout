/**
 * Production static server for the TradeSlayer Pro WEB build (Vite `dist/`).
 * Serves real files directly; any unknown non-asset route falls back to
 * index.html so react-router client routing works on deep links.
 *
 * ESM (the package is "type": "module"). Node built-ins only.
 * Env: PORT (default 18115), BASE_PATH (default "/").
 * Health: GET /status and GET /health -> 200.
 */

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const STATIC_ROOT = path.resolve(__dirname, '..', 'dist');
const INDEX_PATH = path.join(STATIC_ROOT, 'index.html');
const basePath = (process.env.BASE_PATH || '/').replace(/\/+$/, '');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.otf': 'font/otf',
  '.map': 'application/json',
};

function sendFile(filePath, res, statusCode = 200) {
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';
  res.writeHead(statusCode, { 'content-type': contentType });
  res.end(fs.readFileSync(filePath));
}

function serveIndex(res, statusCode = 200) {
  if (!fs.existsSync(INDEX_PATH)) {
    res.writeHead(500, { 'content-type': 'text/plain' });
    res.end('Web build not found. Run `pnpm --filter @workspace/web run build` first.');
    return;
  }
  sendFile(INDEX_PATH, res, statusCode);
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url || '/', `http://${req.headers.host}`);
  let pathname = url.pathname;

  if (basePath && pathname.startsWith(basePath)) {
    pathname = pathname.slice(basePath.length) || '/';
  }

  if (pathname === '/status' || pathname === '/health' || pathname === '/healthz') {
    res.writeHead(200, { 'content-type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok' }));
    return;
  }

  if (pathname === '/') {
    return serveIndex(res);
  }

  const safePath = path.normalize(pathname).replace(/^(\.\.(\/|\\|$))+/, '');
  const filePath = path.join(STATIC_ROOT, safePath);

  if (!filePath.startsWith(STATIC_ROOT)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    return sendFile(filePath, res);
  }

  if (!path.extname(pathname)) {
    return serveIndex(res, 200);
  }

  res.writeHead(404);
  res.end('Not Found');
});

const port = parseInt(process.env.PORT || '18115', 10);
server.listen(port, '0.0.0.0', () => {
  console.log(`TradeSlayer Pro web build served on port ${port}`);
});
