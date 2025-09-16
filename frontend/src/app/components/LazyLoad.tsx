// src/components/LazyLoad.tsx - New component for lazy loading
'use client'

import { useEffect, useRef, useState, ReactNode } from 'react'

interface LazyLoadProps {
  children: ReactNode
  threshold?: number
  rootMargin?: string
  once?: boolean
  className?: string
}

export default function LazyLoad({ 
  children, 
  threshold = 0.1, 
  rootMargin = '0px', 
  once = true,
  className = '' 
}: LazyLoadProps) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isVisible && once) return

    const currentRef = ref.current // Capture the current ref value
    if (!currentRef) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          if (once) {
            observer.unobserve(currentRef)
          }
        }
      },
      { threshold, rootMargin }
    )

    observer.observe(currentRef)

    return () => {
      observer.unobserve(currentRef)
    }
  }, [isVisible, once, threshold, rootMargin])

  return (
    <div ref={ref} className={className}>
      {isVisible ? children : (
        <div className="w-full h-full bg-gray-200 animate-pulse rounded"></div>
      )}
    </div>
  )
}