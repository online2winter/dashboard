import { Connection, PublicKey, Transaction } from '@solana/web3.js';
import { NETWORKS } from '../config/networks';
import { TOKEN_CONFIG } from '../config/token.config';

export const getTokenBalance = async (connection, publicKey) => {
try {
    const balance = await connection.getBalance(publicKey);
    return balance / Math.pow(10, TOKEN_CONFIG.decimals);
} catch (error) {
    console.error('Error fetching token balance:', error);
    throw error;
}
};

export const transferTokens = async (connection, sender, recipient, amount) => {
try {
    const transaction = new Transaction().add(
    // Add transfer instruction here
    );
    
    return transaction;
} catch (error) {
    console.error('Error creating transfer transaction:', error);
    throw error;
}
};

export const subscribeToTokenEvents = (connection, address, callback) => {
const publicKey = new PublicKey(address);
const subscriptionId = connection.onAccountChange(
    publicKey,
    callback,
    'confirmed'
);

return () => {
    connection.removeAccountChangeListener(subscriptionId);
};
};

export const getTokenMetadata = async (connection, tokenAddress) => {
try {
    const publicKey = new PublicKey(tokenAddress);
    const accountInfo = await connection.getAccountInfo(publicKey);
    return accountInfo;
} catch (error) {
    console.error('Error fetching token metadata:', error);
    throw error;
}
};

