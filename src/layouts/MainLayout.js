import React from 'react';
import PropTypes from 'prop-types';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { Card, LoadingSpinner } from '../components/common';
import Navigation from '../components/Navigation';

/**
* Main layout component that wraps the application content
* @param {Object} props - Component props
* @param {React.ReactNode} props.children - Child components to render
* @param {boolean} [props.isLoading] - Whether the content is loading
*/
const MainLayout = ({ children, isLoading = false }) => {
return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
    <Navigation />
    <main className="flex-grow max-w-7xl w-full mx-auto py-6 sm:px-6 lg:px-8">
        <ErrorBoundary>
        <div className="px-4 py-6 sm:px-0">
            {isLoading ? (
            <div className="flex justify-center items-center h-64">
                <LoadingSpinner size="lg" />
            </div>
            ) : (
            children
            )}
        </div>
        </ErrorBoundary>
    </main>
    <footer className="mt-auto py-6">
        <Card className="shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
            <p className="text-center text-gray-500 text-sm">
            © 2024 Crypto Dashboard. All rights reserved.
            </p>
        </div>
        </Card>
    </footer>
    </div>
);
};

MainLayout.propTypes = {
/** Child components to be rendered in the layout */
children: PropTypes.node.isRequired,
/** Flag indicating if the layout content is loading */
isLoading: PropTypes.bool,
};

export default MainLayout;
