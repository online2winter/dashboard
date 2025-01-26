// React and third-party imports
import React, { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Menu } from '@heroicons/react/24/outline';

// Context imports
import { useTokenContext } from '../contexts/TokenContext';

// Component imports
import WalletButton from './WalletButton';
import NetworkSelector from './NetworkSelector';
import NetworkStatus from './NetworkStatus';
import { LoadingSpinner, Button, Card } from './common';
import { ErrorBoundary } from './ErrorBoundary';

/**
* Navigation component that handles the top navigation bar
* @component
* @returns {React.ReactElement} The Navigation component
*/
const Navigation = () => {
const { network, networkConfig, setNetwork, isLoading } = useTokenContext();
const { connected } = useWallet();
const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

const handleNetworkChange = (newNetwork) => {
    setNetwork(newNetwork);
};

const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
};

return (
<ErrorBoundary>
    <Card className="shadow-sm">
    <nav className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
            <h1 className="text-xl font-bold text-gray-900">Crypto Dashboard</h1>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-4">
            {isLoading ? (
                <LoadingSpinner size="sm" />
            ) : (
                <NetworkSelector
                currentNetwork={network}
                networks={networkConfig.networks}
                onNetworkChange={handleNetworkChange}
                />
            )}
            <NetworkStatus
                connected={connected}
                network={network}
                rpcEndpoint={networkConfig.rpcEndpoint}
            />
            <WalletButton />
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
            <Button
                variant="ghost"
                className="p-2"
                onClick={toggleMobileMenu}
                aria-label="Toggle menu"
            >
                <Menu className="h-6 w-6" />
            </Button>
            </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
            <div className="md:hidden absolute top-16 inset-x-0 bg-white shadow-lg rounded-b-lg">
            <div className="px-2 pt-2 pb-3 space-y-1">
                {isLoading ? (
                <div className="flex justify-center py-2">
                    <LoadingSpinner size="sm" />
                </div>
                ) : (
                <NetworkSelector
                    currentNetwork={network}
                    networks={networkConfig.networks}
                    onNetworkChange={handleNetworkChange}
                />
                )}
                <NetworkStatus
                connected={connected}
                network={network}
                rpcEndpoint={networkConfig.rpcEndpoint}
                />
                <div className="px-2 py-2">
                <WalletButton />
                </div>
            </div>
            </div>
        )}
        </div>
    </nav>
    </Card>
</ErrorBoundary>
);
};

export default Navigation;
