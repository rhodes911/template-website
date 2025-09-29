'use client';

import Image from 'next/image';

interface ClientImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  style?: React.CSSProperties;
  priority?: boolean;
  fallbackSrc?: string;
}

export default function ClientImage({ 
  src, 
  alt, 
  width, 
  height, 
  className, 
  style, 
  priority, 
  fallbackSrc 
}: ClientImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      style={style}
      priority={priority}
      onError={(e) => {
        if (fallbackSrc) {
          console.log(`${alt} failed to load, using fallback`);
          e.currentTarget.src = fallbackSrc;
        }
      }}
    />
  );
}
