import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useWallet } from '@solana/wallet-adapter-react';
import { useTokenContext } from '../contexts/TokenContext';
import { LoadingSpinner, Card, StatCard } from './common';
import { ErrorBoundary, ErrorFallback } from './ErrorBoundary';
import toast from 'react-hot-toast';

/**
* TokenStats component displays key statistics about a token
* @component
* @param {Object} props
* @param {string} props.tokenAddress - The address of the token to display stats for
*/



const TokenStats = ({ tokenAddress }) => {
const { publicKey } = useWallet();
const { 
    tokenData = {
    price: 0,
    priceChange: 0,
    marketCap: 0,
    volume: 0,
    holders: 0
    },
    isLoading,
    error,
    transactions,
    getTokenBalance
} = useTokenContext();
const [walletBalance, setWalletBalance] = useState(null);
const [isLoadingBalance, setIsLoadingBalance] = useState(false);

useEffect(() => {
const fetchWalletBalance = async () => {
    if (!publicKey || !tokenAddress) return;
    
    setIsLoadingBalance(true);
    try {
    const balance = await getTokenBalance(publicKey, tokenAddress);
    setWalletBalance(balance);
    toast.success('Balance updated successfully');
    } catch (err) {
    console.error('Error fetching wallet balance:', err);
    toast.error('Failed to fetch wallet balance');
    setWalletBalance(null);
    } finally {
    setIsLoadingBalance(false);
    }
};

fetchWalletBalance();
const interval = setInterval(fetchWalletBalance, 10000);

return () => {
    clearInterval(interval);
};
}, [publicKey, tokenAddress, getTokenBalance]);

if (isLoading || isLoadingBalance) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
                <Card key={i} className="flex items-center justify-center">
                    <LoadingSpinner size="md" />
                </Card>
            ))}
        </div>
    );
}

if (error) {
    return <ErrorFallback error={error} />;
}

return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    <StatCard
        title="Price"
        value={`$${tokenData.price.toLocaleString(undefined, { minimumFractionDigits: 8 })}`}
        change={tokenData.priceChange}
    />
    <StatCard
        title="Market Cap"
        value={`$${(tokenData.marketCap).toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
        change={tokenData.priceChange}
    />
    <StatCard
        title="24h Volume"
        value={`$${tokenData.volume.toLocaleString()}`}
        change={null}
    />
    <StatCard
        title="Holders"
        value={tokenData.holders.toLocaleString()}
        change={null}
    />
    </div>
);
};

TokenStats.propTypes = {
tokenAddress: PropTypes.string.isRequired,
tokenData: PropTypes.shape({
    price: PropTypes.number.isRequired,
    priceChange: PropTypes.number,
    marketCap: PropTypes.number.isRequired,
    volume: PropTypes.number.isRequired,
    holders: PropTypes.number.isRequired
}).isRequired,
isLoading: PropTypes.bool,
error: PropTypes.object,
transactions: PropTypes.arrayOf(PropTypes.object),
getTokenBalance: PropTypes.func.isRequired
};

export default TokenStats;
