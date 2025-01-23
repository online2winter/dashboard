import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useWallet } from '@solana/wallet-adapter-react';
import { useTokenContext } from '../context/TokenContext';
import { LoadingSpinner } from './common';
import toast from 'react-hot-toast';

const StatCard = ({ title, value, change }) => {
return (
    <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <p className="mt-2 text-3xl font-semibold text-gray-900">{value}</p>
        {change && (
        <p className={`mt-2 ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {change >= 0 ? '↑' : '↓'} {Math.abs(change)}%
        </p>
        )}
    </div>
);
};

StatCard.propTypes = {
title: PropTypes.string.isRequired,
value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
change: PropTypes.number
};

return (
<div className="bg-white p-6 rounded-lg shadow">
    <h3 className="text-sm font-medium text-gray-500">{title}</h3>
    <p className="mt-2 text-3xl font-semibold text-gray-900">{value}</p>
    {change && (
    <p className={`mt-2 ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
        {change >= 0 ? '↑' : '↓'} {Math.abs(change)}%
    </p>
    )}
</div>
);

const TokenStats = ({ tokenAddress }) => {
TokenStats.propTypes = {
    tokenAddress: PropTypes.string.isRequired
};

const { publicKey } = useWallet();
const { tokenData, isLoading, error, transactions, getTokenBalance } = useTokenContext();
const [walletBalance, setWalletBalance] = useState(null);
const [isLoadingBalance, setIsLoadingBalance] = useState(false);

useEffect(() => {
const fetchWalletBalance = async () => {
    if (publicKey && tokenAddress) {
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
    }
};

fetchWalletBalance();
const interval = setInterval(fetchWalletBalance, 10000);

return () => clearInterval(interval);
}, [publicKey, tokenAddress]);

if (isLoading || isLoadingBalance) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white p-6 rounded-lg shadow flex items-center justify-center">
                    <LoadingSpinner size="md" />
                </div>
            ))}
        </div>
    );
}

if (error) {
    return (
    <div className="text-red-500 p-4 bg-red-50 rounded-lg">
        Error loading token data: {error}
    </div>
    );
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

export default TokenStats;

