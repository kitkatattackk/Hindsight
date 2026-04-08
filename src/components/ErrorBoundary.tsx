import React, { ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex flex-col items-center justify-center p-8 text-center space-y-6 bg-white border-4 border-black shadow-retro rounded-2xl m-4">
          <div className="w-16 h-16 bg-brand-pink/20 rounded-full flex items-center justify-center border-4 border-black">
            <AlertCircle className="w-10 h-10 text-brand-pink" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-display">Something went wrong</h2>
            <p className="text-sm text-black/60 max-w-xs mx-auto">
              Molly encountered an unexpected error. Don't worry, your data is safe.
            </p>
          </div>
          <button 
            onClick={this.handleReset}
            className="retro-button flex items-center gap-2"
          >
            <RefreshCw className="w-5 h-5" />
            Try Again
          </button>
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-4 p-4 bg-gray-100 rounded-lg text-left overflow-auto max-w-full">
              <p className="text-[10px] font-mono text-red-600 whitespace-pre-wrap">
                {this.state.error?.toString()}
              </p>
            </div>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
