import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle } from 'lucide-react';

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      return (
        <div className="min-h-[50vh] flex flex-col items-center justify-center p-8 bg-red-50/50 rounded-3xl border border-red-100 m-4">
          <AlertCircle className="text-red-500 mb-4" size={48} />
          <h2 className="text-xl font-bold text-red-700 mb-2 font-serif">A Critical Component Crashed</h2>
          <p className="text-red-600/80 mb-6 text-sm max-w-2xl text-center">
            The application encountered a fatal error while trying to render this section. 
            Please take a screenshot of the error below and send it to your developer.
          </p>
          
          <div className="bg-white p-6 rounded-xl border border-red-100 w-full max-w-4xl overflow-auto text-left shadow-sm">
            <h3 className="font-mono text-sm font-bold text-red-600 mb-2">Error Details:</h3>
            <pre className="text-xs text-red-500 font-mono whitespace-pre-wrap break-words">
              {this.state.error?.toString()}
            </pre>
            
            {this.state.errorInfo && (
              <>
                <h3 className="font-mono text-sm font-bold text-slate-600 mt-6 mb-2">Component Stack Trace:</h3>
                <pre className="text-[10px] text-slate-500 font-mono whitespace-pre-wrap">
                  {this.state.errorInfo.componentStack}
                </pre>
              </>
            )}
          </div>
          
          <button 
            onClick={() => window.location.reload()}
            className="mt-8 px-6 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-colors"
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
