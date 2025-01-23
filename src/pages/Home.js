import React, { useState, useEffect, useCallback } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import CoinChart from '../components/CoinChart';
import TokenStats from '../components/TokenStats';
import TokenTransfer from '../components/TokenTransfer';
import TransactionHistory from '../components/TransactionHistory';
import { ErrorBoundary } from 'react-error-boundary';

const TOKEN_CONFIG = {
address: 'YOUR_TOKEN_ADDRESS',
id: 'YOUR_TOKEN_ID',
decimals: 9,
symbol: 'TOKEN'
};

const ErrorFallback = ({ error, resetErrorBoundary }) => (
<div className="text-center p-4 bg-red-50 rounded-lg">
    <h3 className="text-red-800 font-medium">Something went wrong:</h3>
    <p className="text-red-600 mt-2">{error.message}</p>
    <button
    onClick={resetErrorBoundary}
    className="mt-4 px-4 py-2 bg-red-100 text-red-800 rounded hover:bg-red-200"
    >
    Try again
    </button>
</div>
);

const Home = () => {
const { connection } = useConnection();
const { publicKey } = useWallet();
const [isLoading, setIsLoading] = useState(true);
const [tokenData, setTokenData] = useState(null);
const [error, setError] = useState(null);

const fetchTokenData = useCallback(async () => {
    if (!connection || !publicKey) return;

    try {
    setIsLoading(true);
    // Fetch token data here using TOKEN_CONFIG
    const data = await connection.getTokenAccountBalance(/* token account */);
    setTokenData(data);
    setError(null);
    } catch (err) {
    setError(err.message);
    } finally {
    setIsLoading(false);
    }
}, [connection, publicKey]);

useEffect(() => {
    fetchTokenData();
    
    // Set up WebSocket connection for real-time updates
    const wsConnection = connection?.onAccountChange(
    publicKey,
    () => fetchTokenData(),
    'confirmed'
    );

    return () => {
    wsConnection?.unsubscribe();
    };
}, [connection, publicKey, fetchTokenData]);

if (error) {
    return <ErrorFallback error={{ message: error }} resetErrorBoundary={fetchTokenData} />;
}

return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <ErrorBoundary FallbackComponent={ErrorFallback}>
                <div className="bg-white rounded-lg shadow px-5 py-6 sm:px-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                        Market Overview
                    </h2>
                    <TokenStats
                        isLoading={isLoading}
                        tokenConfig={TOKEN_CONFIG}
                        tokenData={tokenData}
                        onError={setError}
                    />
                </div>
            </ErrorBoundary>

            <ErrorBoundary FallbackComponent={ErrorFallback}>
                <div className="bg-white rounded-lg shadow px-5 py-6 sm:px-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                        Price Chart
                    </h2>
                    <CoinChart
                        isLoading={isLoading}
                        tokenConfig={TOKEN_CONFIG}
                        tokenData={tokenData}
                        onError={setError}
                    />
                </div>
            </ErrorBoundary>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ErrorBoundary FallbackComponent={ErrorFallback}>
                <div className="bg-white rounded-lg shadow px-5 py-6 sm:px-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                        Token Transfer
                    </h2>
                    <TokenTransfer
                        isLoading={isLoading}
                        tokenConfig={TOKEN_CONFIG}
                        tokenData={tokenData}
                        onError={setError}
                    />
                </div>
            </ErrorBoundary>

            <ErrorBoundary FallbackComponent={ErrorFallback}>
                <div className="bg-white rounded-lg shadow px-5 py-6 sm:px-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                        Transaction History
                    </h2>
                    <TransactionHistory
                        isLoading={isLoading}
                        tokenConfig={TOKEN_CONFIG}
                        tokenData={tokenData}
                        onError={setError}
                    />
                </div>
            </ErrorBoundary>
        </div>
    </div>
);
};

export default Home;

