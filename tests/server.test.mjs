import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');

function requestRaw(port, reqPath) {
  return new Promise((resolve, reject) => {
    const req = http.request(
      { host: '127.0.0.1', port, path: reqPath, method: 'GET' },
      (res) => {
        const chunks = [];
        res.on('data', (c) => chunks.push(c));
        res.on('end', () => {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: Buffer.concat(chunks).toString('utf8'),
          });
        });
      }
    );
    req.on('error', reject);
    req.end();
  });
}

test('Static server serves index.html, ES modules, CSS, and blocks path traversal', async () => {
  const port = 4391;
  const child = spawn(process.execPath, [path.join(repoRoot, 'server.mjs')], {
    cwd: repoRoot,
    env: { ...process.env, PORT: String(port) },
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  await new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('Server failed to start within 5s')), 5000);
    child.stdout.on('data', (d) => {
      if (d.toString().includes(String(port))) {
        clearTimeout(timer);
        resolve();
      }
    });
    child.on('exit', (code) => {
      clearTimeout(timer);
      reject(new Error(`Server exited prematurely with code ${code}`));
    });
  });

  try {
    const home = await requestRaw(port, '/');
    assert.equal(home.status, 200);
    assert.match(home.headers['content-type'], /text\/html/);
    assert.ok(home.body.includes('XENOPHORA'));

    const mainJs = await requestRaw(port, '/src/main.js');
    assert.equal(mainJs.status, 200);
    assert.match(mainJs.headers['content-type'], /javascript/);

    const css = await requestRaw(port, '/styles.css');
    assert.equal(css.status, 200);
    assert.match(css.headers['content-type'], /text\/css/);

    const missing = await requestRaw(port, '/does-not-exist.xyz');
    assert.equal(missing.status, 404);

    // Directory traversal attempt must be rejected (403 or 404, never 200)
    const trav = await requestRaw(port, '/..%2f..%2fpackage.json');
    assert.notEqual(trav.status, 200);
  } finally {
    child.kill();
  }
});
