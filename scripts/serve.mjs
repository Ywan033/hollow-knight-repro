// 本地静态服务：仅绑定 127.0.0.1，端口由系统分配（或用 --port 指定）。
// 用法: node scripts/serve.mjs [--port N] [--open]
import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path'; import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'game');
const args = process.argv.slice(2);
const open = args.includes('--open');
const pi = args.indexOf('--port');
const port = pi >= 0 ? Number(args[pi + 1]) : 0;
if (!fs.existsSync(path.join(root, 'index.html'))) { console.error('找不到 ' + path.join(root, 'index.html')); process.exit(1); }
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8', '.png': 'image/png', '.svg': 'image/svg+xml' };
const srv = http.createServer((req, res) => {
  const p = path.join(root, decodeURIComponent(new URL(req.url, 'http://x').pathname).replace(/^\/+/, '') || 'index.html');
  if (!(p === root || p.startsWith(root + path.sep)) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) { res.writeHead(404); return res.end('not found'); }
  res.writeHead(200, { 'content-type': TYPES[path.extname(p).toLowerCase()] || 'application/octet-stream', 'cache-control': 'no-store' });
  fs.createReadStream(p).pipe(res);
});
srv.on('error', e => { console.error('服务启动失败: ' + e.message); process.exit(1); });
srv.listen(port, '127.0.0.1', () => {
  const url = `http://127.0.0.1:${srv.address().port}/index.html`;
  console.log(url);
  console.log('按 Ctrl+C 停止。');
  if (open && process.platform === 'win32') spawn('cmd', ['/c', 'start', '', url], { stdio: 'ignore', detached: true }).unref();
});
