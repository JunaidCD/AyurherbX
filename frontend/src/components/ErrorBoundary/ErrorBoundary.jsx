import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details
    console.warn('Error caught by boundary:', error, errorInfo);
    
    // Check if it's a MetaMask-related error
    const isMetaMaskError = error.message && (
      error.message.includes('MetaMask') ||
      error.message.includes('inpage.js') ||
      error.message.includes('ethereum') ||
      error.message.includes('Failed to connect')
    );

    if (isMetaMaskError) {
      console.log('🔧 MetaMask-related error suppressed - using mock blockchain');
      // Don't show error UI for MetaMask issues, just log and continue
      this.setState({ hasError: false });
      return;
    }

    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError && this.state.error) {
      // Fallback UI for non-MetaMask errors
      return (
        <div className="min-h-screen bg-dark-900 text-white flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-dark-800 rounded-lg p-6 border border-dark-700">
            <div className="text-center">
              <div className="text-red-500 text-4xl mb-4">⚠️</div>
              <h2 className="text-xl font-bold mb-4">Something went wrong</h2>
              <p className="text-gray-300 mb-4">
                The application encountered an unexpected error.
              </p>
              <button
                onClick={() => {
                  this.setState({ hasError: false, error: null, errorInfo: null });
                  window.location.reload();
                }}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Reload Application
              </button>
              
              {process.env.NODE_ENV === 'development' && (
                <details className="mt-4 text-left">
                  <summary className="cursor-pointer text-gray-400 hover:text-white">
                    Error Details (Development)
                  </summary>
                  <pre className="mt-2 text-xs bg-dark-900 p-2 rounded overflow-auto max-h-32">
                    {this.state.error && this.state.error.toString()}
                    <br />
                    {this.state.errorInfo.componentStack}
                  </pre>
                </details>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
