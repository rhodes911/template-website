// Serve the static favicon from /public directly
export const runtime = 'nodejs'
import fs from 'fs'
import path from 'path'

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'public', 'favicon.ico')
    const file = await fs.promises.readFile(filePath)
    return new Response(new Uint8Array(file), {
      headers: {
        'Content-Type': 'image/x-icon',
        'Cache-Control': 'public, max-age=86400, immutable',
      },
    })
  } catch {
    return new Response('favicon not found', { status: 404 })
  }
}
