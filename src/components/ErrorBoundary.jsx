import React from 'react';
import PropTypes from 'prop-types';

export const ErrorFallback = ({ error, resetErrorBoundary }) => {
return (
    <div role="alert" className="error-boundary-fallback">
    <h2>Something went wrong:</h2>
    <pre className="error-message">{error.message}</pre>
    {resetErrorBoundary && (
        <button onClick={resetErrorBoundary}>Try again</button>
    )}
    </div>
);
};

ErrorFallback.propTypes = {
error: PropTypes.shape({
    message: PropTypes.string.isRequired,
}).isRequired,
resetErrorBoundary: PropTypes.func,
};

export class ErrorBoundary extends React.Component {
constructor(props) {
    super(props);
    this.state = { error: null, errorInfo: null };
}

static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { error };
}

componentDidCatch(error, errorInfo) {
    // You can log the error to an error reporting service here
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    this.setState({
    error,
    errorInfo,
    });

    if (this.props.onError) {
    this.props.onError(error, errorInfo);
    }
}

resetErrorBoundary = () => {
    this.setState({ error: null, errorInfo: null });
    if (this.props.onReset) {
    this.props.onReset();
    }
};

render() {
    if (this.state.error) {
    const FallbackComponent = this.props.FallbackComponent || ErrorFallback;
    return (
        <FallbackComponent
        error={this.state.error}
        errorInfo={this.state.errorInfo}
        resetErrorBoundary={this.resetErrorBoundary}
        />
    );
    }

    return this.props.children;
}
}

ErrorBoundary.propTypes = {
children: PropTypes.node.isRequired,
FallbackComponent: PropTypes.elementType,
onError: PropTypes.func,
onReset: PropTypes.func,
};

ErrorBoundary.defaultProps = {
FallbackComponent: ErrorFallback,
};

