interface PerformanceMetrics {
  loadTime: number
  renderTime: number
  memoryUsage: number
  bundleSize: number
  apiResponseTime: number
}

class PerformanceMonitor {
  private static instance: PerformanceMonitor
  private metrics: PerformanceMetrics[] = []
  private observers: PerformanceObserver[] = []

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor()
    }
    return PerformanceMonitor.instance
  }

  init() {
    this.setupPerformanceObserver()
    this.trackBundleSize()
    this.trackMemoryUsage()
  }

  private setupPerformanceObserver() {
    if ('PerformanceObserver' in window) {
      // Track navigation timing
      const navObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry) => {
          if (entry.entryType === 'navigation') {
            this.trackNavigationTiming(entry as PerformanceNavigationTiming)
          }
        })
      })
      navObserver.observe({ entryTypes: ['navigation'] })

      // Track resource timing
      const resourceObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry) => {
          if (entry.name.includes('/api/')) {
            this.trackApiResponseTime(entry as PerformanceResourceTiming)
          }
        })
      })
      resourceObserver.observe({ entryTypes: ['resource'] })

      this.observers.push(navObserver, resourceObserver)
    }
  }

  private trackNavigationTiming(entry: PerformanceNavigationTiming) {
    const loadTime = entry.loadEventEnd - entry.loadEventStart
    const renderTime = entry.domContentLoadedEventEnd - entry.domContentLoadedEventStart

    this.recordMetric({
      loadTime,
      renderTime,
      memoryUsage: this.getMemoryUsage(),
      bundleSize: this.getBundleSize(),
      apiResponseTime: 0
    })
  }

  private trackApiResponseTime(entry: PerformanceResourceTiming) {
    const responseTime = entry.responseEnd - entry.requestStart
    
    this.recordMetric({
      loadTime: 0,
      renderTime: 0,
      memoryUsage: this.getMemoryUsage(),
      bundleSize: 0,
      apiResponseTime: responseTime
    })
  }

  private getMemoryUsage(): number {
    if ('memory' in performance) {
      return (performance as any).memory.usedJSHeapSize
    }
    return 0
  }

  private getBundleSize(): number {
    // Estimate bundle size from loaded scripts
    const scripts = document.querySelectorAll('script[src]')
    let totalSize = 0
    
    scripts.forEach((script) => {
      const src = script.getAttribute('src')
      if (src && src.includes('assets/')) {
        // This is a rough estimate - in production you'd want more accurate measurement
        totalSize += 100000 // Estimated 100KB per chunk
      }
    })
    
    return totalSize
  }

  private trackBundleSize() {
    // Track when bundles are loaded
    const scripts = document.querySelectorAll('script[src]')
    scripts.forEach((script) => {
      script.addEventListener('load', () => {
        this.recordMetric({
          loadTime: 0,
          renderTime: 0,
          memoryUsage: this.getMemoryUsage(),
          bundleSize: this.getBundleSize(),
          apiResponseTime: 0
        })
      })
    })
  }

  private trackMemoryUsage() {
    // Track memory usage every 30 seconds
    setInterval(() => {
      this.recordMetric({
        loadTime: 0,
        renderTime: 0,
        memoryUsage: this.getMemoryUsage(),
        bundleSize: 0,
        apiResponseTime: 0
      })
    }, 30000)
  }

  private recordMetric(metric: PerformanceMetrics) {
    this.metrics.push(metric)
    
    // Keep only last 100 metrics
    if (this.metrics.length > 100) {
      this.metrics = this.metrics.slice(-100)
    }

    // Send to analytics
    this.sendToAnalytics(metric)
  }

  private sendToAnalytics(metric: PerformanceMetrics) {
    if (window.gtag) {
      window.gtag('event', 'performance_metric', {
        load_time: metric.loadTime,
        render_time: metric.renderTime,
        memory_usage: metric.memoryUsage,
        bundle_size: metric.bundleSize,
        api_response_time: metric.apiResponseTime
      })
    }
  }

  getMetrics(): PerformanceMetrics[] {
    return [...this.metrics]
  }

  getAverageMetrics(): Partial<PerformanceMetrics> {
    if (this.metrics.length === 0) return {}

    const totals = this.metrics.reduce((acc, metric) => ({
      loadTime: acc.loadTime + metric.loadTime,
      renderTime: acc.renderTime + metric.renderTime,
      memoryUsage: acc.memoryUsage + metric.memoryUsage,
      bundleSize: acc.bundleSize + metric.bundleSize,
      apiResponseTime: acc.apiResponseTime + metric.apiResponseTime
    }), { loadTime: 0, renderTime: 0, memoryUsage: 0, bundleSize: 0, apiResponseTime: 0 })

    const count = this.metrics.length
    return {
      loadTime: totals.loadTime / count,
      renderTime: totals.renderTime / count,
      memoryUsage: totals.memoryUsage / count,
      bundleSize: totals.bundleSize / count,
      apiResponseTime: totals.apiResponseTime / count
    }
  }

  cleanup() {
    this.observers.forEach(observer => observer.disconnect())
    this.observers = []
  }
}

export const performanceMonitor = PerformanceMonitor.getInstance()