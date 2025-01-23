import React from 'react';
import PropTypes from 'prop-types';
import { useTokenContext } from '../context';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletButton } from './WalletButton';
import { NetworkSelector } from './NetworkSelector';
import { NetworkStatus } from './NetworkStatus';
import { LoadingSpinner } from './common';

const Navigation = () => {
const { network, networkConfig, setNetwork, isLoading } = useTokenContext();
const { connected } = useWallet();

const handleNetworkChange = (newNetwork) => {
    setNetwork(newNetwork);
};

return (
    <nav className="bg-white shadow">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
        <div className="flex">
            <div className="flex-shrink-0 flex items-center">
            <h1 className="text-xl font-bold">Crypto Dashboard</h1>
            </div>
        </div>
        
        <div className="flex items-center space-x-4">
            <NetworkSelector
            currentNetwork={network}
            networks={networkConfig.networks}
            onNetworkChange={handleNetworkChange}
            />
            <NetworkStatus
            connected={connected}
            network={network}
            rpcEndpoint={networkConfig.rpcEndpoint}
            />
            <WalletButton />
        </div>
        </div>
    </div>
    </nav>
);
};

export default Navigation;
