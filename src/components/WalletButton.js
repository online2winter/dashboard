import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useState, useEffect } from 'react';
import { Connection, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { clusterApiUrl } from '@solana/web3.js';
import '@solana/wallet-adapter-react-ui/styles.css';

const WalletButton = () => {
const { wallet, publicKey, connected } = useWallet();
const { network, switchNetwork } = useContext(TokenContext);
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
}, [publicKey, network]);

return (
    <div className="relative inline-block">
    <WalletMultiButton className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded" />
    {connected && balance !== null && (
        <div className="mt-2 text-sm text-gray-600">
        <p>Balance: {balance.toFixed(4)} SOL</p>
        <p className="truncate w-32">Address: {publicKey.toString()}</p>
        </div>
    )}
    </div>
);
};

export default WalletButton;

