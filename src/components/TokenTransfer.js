import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { TokenContext } from '../contexts/TokenContext';
import { Button, Card, LoadingSpinner, ErrorFallback } from './common';
import toast from 'react-hot-toast';
const TokenTransfer = ({ className }) => {
const { publicKey, signTransaction } = useWallet();
const { tokenBalance, sendToken, estimateGas, isLoading: contextLoading } = useContext(TokenContext);
const [recipient, setRecipient] = useState('');
const [amount, setAmount] = useState('');
const [isLoading, setIsLoading] = useState(false);
const [transactionStatus, setTransactionStatus] = useState('idle');
const [gasEstimate, setGasEstimate] = useState(null);
const [error, setError] = useState('');

const validateAddress = (address) => {
    try {
    new PublicKey(address);
    return true;
    } catch (error) {
    return false;
    }
};

const handleRecipientChange = (e) => {
    setRecipient(e.target.value);
    setError('');
};

const handleAmountChange = async (e) => {
    const value = e.target.value;
    setAmount(value);
    setError('');
    
    if (value && recipient) {
    try {
        const estimate = await estimateGas(recipient, value);
        setGasEstimate(estimate);
    } catch (err) {
        console.error('Gas estimation failed:', err);
    }
    }
};

const handleSubmit = async (e) => {
    e.preventDefault();
    setTransactionStatus('processing');
    setIsLoading(true);

    try {
    if (!publicKey) {
        throw new Error('Please connect your wallet');
    }

    if (!validateAddress(recipient)) {
        throw new Error('Invalid recipient address');
    }

    if (isNaN(amount) || amount <= 0) {
        throw new Error('Invalid amount');
    }

    if (amount > tokenBalance) {
        throw new Error('Insufficient balance');
    }

    const result = await sendToken(recipient, amount);
    if (result.success) {
        toast.success('Transaction completed successfully!');
        setAmount('');
        setRecipient('');
        setGasEstimate(null);
        setTransactionStatus('success');
    } else {
        toast.error(result.error || 'Transaction failed');
        setTransactionStatus('error');
    }
} catch (err) {
    toast.error(err.message, {
    style: {
        border: '1px solid #ef4444',
        padding: '16px',
        color: '#ef4444',
    },
    });
    setTransactionStatus('error');
} finally {
    setIsLoading(false);
}
};

return (
    <Card className={className}>
        <h2 className="text-2xl font-bold mb-4">Transfer Tokens</h2>
    
    <form onSubmit={handleSubmit} className="space-y-4">
        <div>
        <label className="block text-sm font-medium text-gray-700">
            Recipient Address
        </label>
        <input
            type="text"
            value={recipient}
            onChange={handleRecipientChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Enter recipient address"
            required
        />
        </div>

        <div>
        <label className="block text-sm font-medium text-gray-700">
            Amount
        </label>
        <input
            type="number"
            value={amount}
            onChange={handleAmountChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Enter amount"
            min="0"
            step="any"
            required
        />
        </div>

        {gasEstimate && (
        <div className="text-sm text-gray-600">
            Estimated Gas: {gasEstimate} SOL
        </div>
        )}

        {error && (
        <div className="text-red-600 text-sm">{error}</div>
        )}

        <Button
            type="submit"
            variant="primary"
            fullWidth
            isLoading={isLoading}
            disabled={isLoading}
            loadingText="Processing..."
        >
            Send Tokens
        </Button>
    </form>
    </Card>
);
};

TokenTransfer.propTypes = {
    className: PropTypes.string,
};

TokenTransfer.defaultProps = {
    className: '',
};

export default TokenTransfer;
