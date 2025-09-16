// src/components/LoadingSpinner.tsx
export default function LoadingSpinner({ size = 'medium' }: { size?: 'small' | 'medium' | 'large' }) {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  }

  return (
    <div className="flex justify-center items-center">
      <div className={`animate-spin rounded-full border-2 border-solid border-current border-r-transparent ${sizeClasses[size]}`}></div>
    </div>
  )
}