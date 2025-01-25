import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Connection, LAMPORTS_PER_SOL, clusterApiUrl } from '@solana/web3.js';
import { TokenContext } from '../contexts/TokenContext';
import { Card, LoadingSpinner } from './common';
import { ErrorBoundary } from './ErrorBoundary';
import '@solana/wallet-adapter-react-ui/styles.css';

/**
* WalletButton component provides wallet connection and balance display functionality
* @component
* @returns {React.ReactElement} Wallet connection button with balance display
*/
const WalletButton = ({ className, ...props }) => {
const { publicKey, connected } = useWallet();
const { network } = useContext(TokenContext);
const [balance, setBalance] = useState(null);
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState(null);

useEffect(() => {
    const getBalance = async () => {
    if (publicKey) {
        try {
        setIsLoading(true);
        setError(null);
        const connection = new Connection(clusterApiUrl(network));
        const balance = await connection.getBalance(publicKey);
        setBalance(balance / LAMPORTS_PER_SOL);
        } catch (error) {
        console.error('Error fetching balance:', error);
        setError('Failed to fetch balance');
        setBalance(null);
        } finally {
        setIsLoading(false);
        }
    }
    };

    getBalance();
    const interval = setInterval(getBalance, 30000);
    return () => clearInterval(interval);
}, [publicKey, network, connected]);

return (
<ErrorBoundary>
    <div className={`relative ${className || ''}`} {...props}>
    <WalletMultiButton 
        className="!bg-purple-600 hover:!bg-purple-700 transition-colors duration-200 !font-semibold !py-2 !px-4 !rounded-lg shadow-sm" 
    />
    {connected && (
        <Card className="mt-2">
        {isLoading ? (
            <div className="flex justify-center p-4">
            <LoadingSpinner size="sm" />
            </div>
        ) : error ? (
            <div className="text-red-500 text-sm p-2">{error}</div>
        ) : balance !== null && (
            <div className="space-y-1">
            <p className="text-sm text-gray-700">
                <span className="font-medium">Balance:</span> {balance.toFixed(4)} SOL
            </p>
            <p className="text-sm text-gray-700">
                <span className="font-medium">Address:</span>
                <span className="ml-1 block truncate text-xs text-gray-500">
                {publicKey.toString()}
                </span>
            </p>
            </div>
        )}
        </Card>
    )}
    </div>
</ErrorBoundary>
);
};

WalletButton.propTypes = {
/** Optional className for styling */
className: PropTypes.string,
/** Additional props to be spread */
props: PropTypes.object,
};

export default WalletButton;
