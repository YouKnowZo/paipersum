import { useEffect, useRef } from 'react'

interface PerformanceMetrics {
  loadTime: number
  renderTime: number
  memoryUsage?: number
}

export function usePerformance() {
  const startTime = useRef<number>(Date.now())
  const renderStartTime = useRef<number>(Date.now())

  useEffect(() => {
    renderStartTime.current = Date.now()
  })

  useEffect(() => {
    const loadTime = Date.now() - startTime.current
    const renderTime = Date.now() - renderStartTime.current
    
    // Log performance metrics
    console.log('Performance Metrics:', {
      loadTime,
      renderTime,
      memoryUsage: (performance as any).memory?.usedJSHeapSize
    })

    // Send to analytics if available
    if (window.gtag) {
      window.gtag('event', 'performance', {
        load_time: loadTime,
        render_time: renderTime
      })
    }
  }, [])

  return {
    startTime: startTime.current,
    renderStartTime: renderStartTime.current
  }
}