import React from 'react';
import Navigation from '../components/Navigation';

const MainLayout = ({ children }) => {
return (
    <div className="min-h-screen bg-gray-100">
    <Navigation />
    <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
        {children}
        </div>
    </main>
    <footer className="bg-white">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <p className="text-center text-gray-500 text-sm">
            © 2024 Crypto Dashboard. All rights reserved.
        </p>
        </div>
    </footer>
    </div>
);
};

export default MainLayout;

