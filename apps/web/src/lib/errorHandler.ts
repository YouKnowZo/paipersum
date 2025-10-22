interface ErrorInfo {
  error: Error
  errorInfo?: any
  context?: string
  userId?: string
  timestamp: number
}

class ErrorHandler {
  private static instance: ErrorHandler
  private errors: ErrorInfo[] = []
  private maxErrors = 100

  static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler()
    }
    return ErrorHandler.instance
  }

  logError(error: Error, context?: string, errorInfo?: any) {
    const errorData: ErrorInfo = {
      error,
      errorInfo,
      context,
      userId: this.getCurrentUserId(),
      timestamp: Date.now()
    }

    this.errors.push(errorData)
    
    // Keep only recent errors
    if (this.errors.length > this.maxErrors) {
      this.errors = this.errors.slice(-this.maxErrors)
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error logged:', errorData)
    }

    // Send to error reporting service
    this.reportError(errorData)
  }

  private getCurrentUserId(): string | undefined {
    try {
      const user = localStorage.getItem('user')
      return user ? JSON.parse(user).id : undefined
    } catch {
      return undefined
    }
  }

  private async reportError(errorData: ErrorInfo) {
    try {
      // Send to Sentry if available
      if (window.Sentry) {
        window.Sentry.captureException(errorData.error, {
          contexts: {
            react: {
              componentStack: errorData.errorInfo?.componentStack
            }
          },
          tags: {
            context: errorData.context,
            userId: errorData.userId
          }
        })
      }

      // Send to custom error reporting endpoint
      await fetch('/api/errors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: errorData.error.message,
          stack: errorData.error.stack,
          context: errorData.context,
          userId: errorData.userId,
          timestamp: errorData.timestamp,
          userAgent: navigator.userAgent,
          url: window.location.href
        })
      })
    } catch (reportingError) {
      console.error('Failed to report error:', reportingError)
    }
  }

  getRecentErrors(limit = 10): ErrorInfo[] {
    return this.errors.slice(-limit)
  }

  clearErrors() {
    this.errors = []
  }
}

export const errorHandler = ErrorHandler.getInstance()

// Global error handler
window.addEventListener('error', (event) => {
  errorHandler.logError(event.error, 'Global error handler')
})

window.addEventListener('unhandledrejection', (event) => {
  errorHandler.logError(
    new Error(event.reason),
    'Unhandled promise rejection'
  )
})