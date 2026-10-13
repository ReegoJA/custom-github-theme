import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {extname, resolve, sep} from 'node:path';

const root = resolve('.');
const types = {'.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.jpg': 'image/jpeg'};

createServer(async (request, response) => {
  try {
    const url = new URL(request.url, 'http://localhost');
    const relative = decodeURIComponent(url.pathname).replace(/^\//, '') || 'index.html';
    const allowed = /^(src\/|examples\/|assets\/|index\.html$|demo\.(css|js)$)/.test(relative);
    const path = resolve(root, relative);
    if (!allowed || !path.startsWith(root + sep)) {
      response.writeHead(404).end('Not found');
      return;
    }
    const body = await readFile(path);
    response.writeHead(200, {
      'Content-Type': `${types[extname(path)] || 'application/octet-stream'}; charset=utf-8`,
      'X-Content-Type-Options': 'nosniff',
    }).end(body);
  } catch {
    response.writeHead(404).end('Not found');
  }
}).listen(4174, '127.0.0.1', () => {
  console.log('Demo: http://127.0.0.1:4174');
});
