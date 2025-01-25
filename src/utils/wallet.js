import { Connection, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { toast } from 'react-hot-toast';

export class WalletError extends Error {
constructor(message) {
    super(message);
    this.name = 'WalletError';
}
}

/**
* Connect to a wallet
* @param {Object} wallet Wallet instance
* @returns {Promise<boolean>} Connection success
*/
export const connectWallet = async (wallet) => {
try {
    await wallet.connect();
    const publicKey = wallet.publicKey.toString();
    const truncatedKey = `${publicKey.slice(0, 4)}...${publicKey.slice(-4)}`;
    toast.success(`Connected to wallet: ${truncatedKey}`);
    return true;
} catch (error) {
    toast.error('Failed to connect wallet');
    throw new WalletError('Failed to connect wallet');
}
};

/**
* Check wallet balance
* @param {PublicKey} publicKey Wallet public key
* @param {Connection} connection Solana connection instance
* @returns {Promise<number>} Balance in SOL
*/
export const checkBalance = async (publicKey, connection) => {
try {
    const balance = await connection.getBalance(publicKey);
    return balance / LAMPORTS_PER_SOL;
} catch (error) {
    toast.error('Failed to fetch balance');
    throw new WalletError('Failed to fetch wallet balance');
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

