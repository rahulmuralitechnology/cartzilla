// src/components/ErrorBoundary.tsx - Enhanced version
'use client'

import { Component, ErrorInfo, ReactNode } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExclamationTriangle, faRefresh } from '@fortawesome/free-solid-svg-icons'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  componentName?: string
}

interface State {
  hasError: boolean
  error?: Error
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Component Error:', {
      error: error.message,
      stack: error.stack,
      component: this.props.componentName || 'Unknown',
      info: errorInfo.componentStack
    })
    
    // You can integrate with error logging service here
    // logErrorToService(error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="p-6 text-center bg-red-50 rounded-lg">
          <FontAwesomeIcon 
            icon={faExclamationTriangle} 
            className="text-red-500 text-4xl mb-4" 
          />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Something went wrong
          </h2>
          <p className="text-gray-600 mb-4">
            We apologize for the inconvenience. Please try refreshing the page.
          </p>
          {this.state.error && (
            <details className="text-left mb-4">
              <summary className="cursor-pointer text-sm text-gray-500">
                Error details
              </summary>
              <pre className="text-xs text-gray-600 mt-2 p-2 bg-gray-100 rounded">
                {this.state.error.message}
              </pre>
            </details>
          )}
          <button 
            onClick={() => {
              this.setState({ hasError: false, error: undefined })
              window.location.reload()
            }}
            className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark transition-colors flex items-center gap-2 mx-auto"
          >
            <FontAwesomeIcon icon={faRefresh} />
            Reload Page
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary