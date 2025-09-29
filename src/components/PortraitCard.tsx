'use client'

import Image from 'next/image'
import { useRef } from 'react'

type PortraitCardProps = {
  src: string
  alt: string
  width?: number
  height?: number
  size?: 'sm' | 'md' | 'lg'
  className?: string
  shape?: 'rounded' | 'circle'
  flipOnHover?: boolean
  back?: React.ReactNode
  objectPosition?: string
  focus?: { x?: number; y?: number; zoom?: number }
}

// Interactive portrait with subtle tilt and gradient ring
export default function PortraitCard({ src, alt, size = 'md', className, shape = 'rounded', flipOnHover = false, back, objectPosition, focus }: PortraitCardProps) {
  const ref = useRef<HTMLDivElement>(null)

  const handleMove = (e: React.MouseEvent) => {
    if (flipOnHover) return
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const rx = ((y / rect.height) - 0.5) * -6 // rotateX
    const ry = ((x / rect.width) - 0.5) * 6  // rotateY
    el.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg)`
  }

  const reset = () => {
    if (flipOnHover) return
    const el = ref.current
    if (el) el.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)'
  }

  const sizeClass = size === 'sm'
    ? 'w-[min(80vw,380px)]'
    : size === 'lg'
    ? 'w-[min(92vw,560px)]'
    : 'w-[min(86vw,480px)]'

  const roundedClass = shape === 'circle' ? 'rounded-full' : 'rounded-[2rem]'
  const ringInset = shape === 'circle' ? 'rounded-full' : 'rounded-[2rem]'
  const aspectClass = shape === 'circle' ? 'aspect-square' : 'aspect-[4/5]'

  // Compute pan from focus (0-100). Positive X moves image right (so visible area shows more left of image), hence translateX by (fx - 50)/50 * range.
  const fx = typeof focus?.x === 'number' ? Math.min(100, Math.max(0, focus.x)) : undefined
  const fy = typeof focus?.y === 'number' ? Math.min(100, Math.max(0, focus.y)) : undefined
  const panRange = 15 // max percentage to pan in either direction
  const tx = typeof fx === 'number' ? ((fx - 50) / 50) * panRange : 0
  const ty = typeof fy === 'number' ? ((fy - 50) / 50) * panRange : 0
  // Base scale to avoid gaps; allow overrides via focus.zoom (%), clamped
  const baseScale = shape === 'circle' ? 1.08 : 1.12
  const zoomScale = typeof focus?.zoom === 'number' ? Math.max(1, Math.min(2.2, focus.zoom / 100)) : 1.15
  const scale = Math.max(baseScale, zoomScale)

  // Flip-on-hover variant
  if (flipOnHover) {
    return (
      <div className={`group relative ${className ?? ''}`} aria-label={alt}>
        {/* Glow */}
        <div className={`absolute -inset-1 ${roundedClass} bg-gradient-to-br from-primary-500/30 via-primary-400/20 to-transparent blur-xl opacity-50 group-hover:opacity-80 transition-opacity`} />

        {/* Scene (perspective) */}
        <div className={`relative ${aspectClass} ${sizeClass} ${roundedClass} overflow-visible flip-scene`}>
          {/* Flipper */}
          <div className={`absolute inset-0 ${roundedClass} bg-transparent flip-inner`}>
            {/* Front face */}
            <div className={`absolute inset-0 ${roundedClass} bg-white/60 backdrop-blur shadow-2xl border border-neutral-200/60 overflow-hidden flip-face`}> 
              {/* Gradient ring */}
              <div className={`absolute inset-0 ${ringInset} p-[2px]`}>
                <div className={`h-full w-full ${ringInset} bg-gradient-to-br from-primary-300/30 via-transparent to-primary-600/20`} />
              </div>
              <div className={`relative ${roundedClass} overflow-hidden h-full w-full`}>
                <Image
                  src={src}
                  alt={alt}
                  fill
                  sizes="(max-width: 768px) 88vw, 520px"
                  className={`object-cover`}
                  style={{
                    objectPosition: objectPosition,
                    transform: `translate(${tx}%, ${ty}%) scale(${scale})`,
                    transformOrigin: 'center',
                  }}
                  priority
                />
              </div>
            </div>

            {/* Back face */}
            <div className={`absolute inset-0 ${roundedClass} bg-white shadow-2xl border border-neutral-200 overflow-hidden flip-face flip-back`}>
              {back ?? (
                <div className="h-full w-full flex items-center justify-center p-6">
                  <div className="text-center">
                    <p className="text-neutral-700">More info</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <style jsx>{`
          .flip-scene { perspective: 1000px; }
          .flip-inner {
            transform-style: preserve-3d;
            transform: rotateY(0deg);
            transition: transform 500ms ease;
          }
          .group:hover .flip-inner { transform: rotateY(180deg); }
          .flip-face { backface-visibility: hidden; }
          .flip-back { transform: rotateY(180deg); }
        `}</style>
      </div>
    )
  }

  // Default tilt variant
  return (
    <div
      className={`group relative [perspective:1000px] ${className ?? ''}`}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      aria-label={alt}
    >
      {/* Glow */}
      <div className={`absolute -inset-1 ${roundedClass} bg-gradient-to-br from-primary-500/30 via-primary-400/20 to-transparent blur-xl opacity-50 group-hover:opacity-80 transition-opacity`} />

      {/* Card */}
      <div
        ref={ref}
        className={`relative ${roundedClass} bg-white/60 backdrop-blur shadow-2xl border border-neutral-200/60 overflow-hidden transition-transform duration-200 will-change-transform`}
        style={{ transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg)' }}
      >
        {/* Gradient ring */}
        <div className={`absolute inset-0 ${ringInset} p-[2px]`}>
          <div className={`h-full w-full ${ringInset} bg-gradient-to-br from-primary-300/30 via-transparent to-primary-600/20`} />
        </div>

        {/* Image wrapper: crop in to remove any phone chrome from the asset */}
        <div className={`relative ${roundedClass} overflow-hidden`}>
          <div className={`relative ${aspectClass} ${sizeClass}`}>
            <Image
              src={src}
              alt={alt}
              fill
              sizes="(max-width: 768px) 88vw, 520px"
              className={`object-cover`}
              style={{
                objectPosition: objectPosition,
                transform: `translate(${tx}%, ${ty}%) scale(${scale})`,
                transformOrigin: 'center',
              }}
              priority
            />
          </div>
        </div>
      </div>
    </div>
  )
}
