import { ImageResponse } from 'next/og'
 
// Route segment config
export const runtime = 'edge'
 
// Image metadata
export const size = {
  width: 32,
  height: 32,
}
export const contentType = 'image/png'
 
// Image generation
export default function Icon() {
  return new ImageResponse(
    (
      // ImageResponse JSX element
      <div
        style={{
          background: 'linear-gradient(135deg, #1a1a1a 0%, #000000 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          borderRadius: '4px',
        }}
      >
        {/* Stylized EE with better typography */}
        <div
          style={{
            fontSize: 18,
            color: '#ffffff',
            fontWeight: '900',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            letterSpacing: '-1px',
            textShadow: '0 1px 2px rgba(0,0,0,0.5)',
          }}
        >
          EE
        </div>
        {/* Small accent dot */}
        <div
          style={{
            position: 'absolute',
            bottom: '4px',
            right: '4px',
            width: '4px',
            height: '4px',
            background: '#ffffff',
            borderRadius: '50%',
            opacity: 0.8,
          }}
        />
      </div>
    ),
    // ImageResponse options
    {
      ...size,
    }
  )
}
