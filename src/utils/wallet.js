import { web3 } from '@solana/web3.js';
import { toast } from 'react-hot-toast';

export const connectWallet = async (wallet) => {
try {
    await wallet.connect();
    const publicKey = wallet.publicKey.toString();
    toast.success(`Connected to wallet: ${publicKey.slice(0, 4)}...${publicKey.slice(-4)}`);
    return true;
} catch (error) {
    toast.error('Failed to connect wallet');
    return false;
}
};

export const checkBalance = async (publicKey, connection) => {
try {
    const balance = await connection.getBalance(publicKey);
    return balance / web3.LAMPORTS_PER_SOL;
} catch (error) {
    toast.error('Failed to fetch balance');
    throw error;
}
};

export const validateConnection = async (connection) => {
try {
    const version = await connection.getVersion();
    return version !== null;
} catch (error) {
    toast.error('Connection validation failed');
    return false;
}
};

