import { spawn } from 'node:child_process';
import process from 'node:process';
import path from 'node:path';

const BASE_URL = 'http://127.0.0.1:4176';
const ROUTES = [
  '/',
  '/storia',
  '/fermate',
  '/come-salire',
  '/info-utili',
  '/meteo',
  '/privacy',
  '/cookie-policy',
  '/note-legali',
  '/accessibilita',
];
const READY_TIMEOUT_MS = 15_000;

function waitForPreview(child) {
  return new Promise((resolve, reject) => {
    let recentOutput = '';
    const timeoutId = setTimeout(() => {
      reject(new Error(`Timed out waiting for preview server on ${BASE_URL}\n${recentOutput}`.trim()));
    }, READY_TIMEOUT_MS);

    const onData = (chunk) => {
      const text = chunk.toString();
       recentOutput = `${recentOutput}${text}`.slice(-1200);
      if (text.includes(BASE_URL)) {
        clearTimeout(timeoutId);
        resolve();
      }
    };

    const onExit = (code) => {
      clearTimeout(timeoutId);
      reject(new Error(`Preview server exited early with code ${code ?? 'unknown'}\n${recentOutput}`.trim()));
    };

    child.stdout.on('data', onData);
    child.stderr.on('data', onData);
    child.once('exit', onExit);
  });
}

async function assertRoute(route) {
  const response = await fetch(`${BASE_URL}${route}`);
  if (!response.ok) {
    throw new Error(`Route ${route} returned ${response.status}`);
  }

  const html = await response.text();
  if (!html.includes('<div id="root"></div>')) {
    throw new Error(`Route ${route} did not return the expected application shell`);
  }
}

async function main() {
  const viteCliPath = path.join(process.cwd(), 'node_modules', 'vite', 'bin', 'vite.js');
  const preview = spawn(
    process.execPath,
    [viteCliPath, 'preview', '--host', '127.0.0.1', '--port', '4176', '--strictPort'],
    {
      cwd: process.cwd(),
      stdio: ['ignore', 'pipe', 'pipe'],
    },
  );

  try {
    await waitForPreview(preview);
    for (const route of ROUTES) {
      await assertRoute(route);
    }
    console.log(`Smoke OK: ${ROUTES.length} routes responded with the app shell.`);
  } finally {
    preview.kill('SIGTERM');
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
