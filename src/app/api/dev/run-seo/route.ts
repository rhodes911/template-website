import { NextResponse } from 'next/server';
import { spawn } from 'child_process';

export async function POST(request: Request) {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ message: 'Not available in production' }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const path = searchParams.get('path') || '/';

  // Run the aggregate SEO tests scoped to a single page via PAGE_PATH
  // We'll run headings + meta + images + links sequentially
  const scripts: { name: string; cmd: string; args: string[] }[] = [
    { name: 'headings', cmd: 'node', args: ['scripts/test-headings.js'] },
    { name: 'meta', cmd: 'node', args: ['scripts/test-seo-meta.js'] },
    { name: 'images', cmd: 'node', args: ['scripts/test-seo-images.js'] },
    { name: 'links', cmd: 'node', args: ['scripts/test-seo-links.js'] },
  ];

  let failed = false;
  const results: { name: string; code: number; log: string }[] = [];

  for (const s of scripts) {
    const { code, log } = await new Promise<{ code: number; log: string }>((resolve) => {
      let buffer = '';
      const child = spawn(s.cmd, s.args, {
        env: {
          ...process.env,
          PAGE_PATH: path,
          TEST_URL: process.env.TEST_URL || 'http://localhost:3000',
          STRICT_PAGE_SCOPE: '1',
          // Ensure hidden/visually-hidden headings (e.g., sr-only) are included in checks
          INCLUDE_HIDDEN: '1',
        },
        cwd: process.cwd(),
        shell: process.platform === 'win32',
      });
      child.stdout.on('data', (d) => (buffer += d.toString()));
      child.stderr.on('data', (d) => (buffer += d.toString()));
      child.on('close', (code) => resolve({ code: code ?? 1, log: buffer }));
    });
    results.push({ name: s.name, code, log });
    if (code !== 0) failed = true;
  }

  const message = failed ? '❌ Some SEO checks failed' : '✅ SEO checks passed for this page';
  return NextResponse.json({ message, results, page: path });
}
