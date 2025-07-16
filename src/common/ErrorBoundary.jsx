```jsx
import React from 'react';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from './SafeIcon';

const { FiAlertTriangle, FiRefreshCw } = FiIcons;

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center p-6 bg-white rounded-lg shadow-sm border border-gray-200 max-w-md">
            <SafeIcon 
              icon={FiAlertTriangle} 
              className="w-16 h-16 text-red-500 mx-auto mb-4"
            />
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Something went wrong
            </h2>
            <p className="text-gray-600 mb-6">
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            <button 
              onClick={this.handleReset}
              className="flex items-center justify-center space-x-2 mx-auto px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <SafeIcon icon={FiRefreshCw} className="w-4 h-4" />
              <span>Try again</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
```