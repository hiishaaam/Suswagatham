import React, { Component, ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  sectionName?: string
}

interface State {
  hasError: boolean
  error: Error | null
}

export class SectionErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error(`ErrorBoundary caught an error in ${this.props.sectionName || 'a section'}:`, error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback
      
      return (
        <div className="p-6 border border-error/20 bg-error/5 rounded-sm flex flex-col items-center justify-center text-center">
          <div className="w-8 h-8 rounded-full bg-error/10 text-error flex items-center justify-center mb-3 text-lg font-bold">!</div>
          <h3 className="font-display font-bold text-ink mb-1">Failed to load content</h3>
          <p className="text-xs text-muted mb-4 uppercase tracking-widest">{this.props.sectionName}</p>
          <button 
            onClick={() => this.setState({ hasError: false, error: null })}
            className="text-[10px] text-error font-bold uppercase tracking-widest border-b border-error/30 hover:border-error transition-colors pb-0.5"
          >
            Try Again
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

