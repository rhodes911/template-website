#!/usr/bin/env node
/*
  Cross-platform build script for Vercel.
  If Tina env vars exist, build Tina schema first; then Next build.
*/
const { spawnSync } = require('child_process');

function hasEnv(name) {
  return !!process.env[name] && String(process.env[name]).trim() !== '';
}

function run(cmd, args, opts = {}) {
  const res = spawnSync(cmd, args, { stdio: 'inherit', shell: process.platform === 'win32', ...opts });
  if (res.status !== 0) process.exit(res.status || 1);
}

const hasTina = hasEnv('NEXT_PUBLIC_TINA_CLIENT_ID') && hasEnv('TINA_TOKEN');
if (hasTina) {
  console.log('[build:vercel] Detected Tina env; running tinacms build');
  run('npx', ['tinacms', 'build']);
} else {
  console.log('[build:vercel] Tina env not found; skipping tinacms build');
}

console.log('[build:vercel] Running next build');
run('npx', ['next', 'build']);
