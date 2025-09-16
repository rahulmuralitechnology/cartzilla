// src/components/Image.tsx
'use client'

import { useState } from 'react'
import Image from 'next/image'

interface OptimizedImageProps {
  src: string
  alt: string
  width: number
  height: number
  className?: string
  priority?: boolean
  fill?: boolean
  sizes?: string
}

export default function OptimizedImage({ 
  src, 
  alt, 
  width, 
  height, 
  className = '', 
  priority = false,
  fill = false,
  sizes
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true)

  // Check if the image is from an external source
  const isExternal = src.startsWith('http')

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <Image
        src={src}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        className={`
          transition-opacity duration-300 object-cover
          ${isLoading ? 'opacity-0' : 'opacity-100'}
        `}
        onLoad={() => setIsLoading(false)}
        priority={priority}
        fill={fill}
        sizes={sizes}
        unoptimized={isExternal} // External images are not optimized by Next.js
      />
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
    </div>
  )
}