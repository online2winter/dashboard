import { Connection, PublicKey } from '@solana/web3.js';
import axios from 'axios';

export const NETWORK = 'mainnet-beta';
export const CLUSTER_URL = 'https://api.mainnet-beta.solana.com';

export async function getTokenMetadata(tokenAddress) {
try {
    const connection = new Connection(CLUSTER_URL);
    const tokenPublicKey = new PublicKey(tokenAddress);
    const accountInfo = await connection.getParsedAccountInfo(tokenPublicKey);
    return accountInfo.value?.data;
} catch (error) {
    console.error('Error fetching token metadata:', error);
    throw error;
}
}

export async function getTokenPrice(tokenAddress) {
try {
    // Replace with your preferred price feed API (e.g., CoinGecko, Jupiter, etc.)
    const response = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${tokenAddress}&vs_currencies=usd`);
    return response.data[tokenAddress].usd;
} catch (error) {
    console.error('Error fetching token price:', error);
    throw error;
}
}

export async function getTokenSupply(tokenAddress) {
try {
    const connection = new Connection(CLUSTER_URL);
    const tokenPublicKey = new PublicKey(tokenAddress);
    const supply = await connection.getTokenSupply(tokenPublicKey);
    return supply.value;
} catch (error) {
    console.error('Error fetching token supply:', error);
    throw error;
}
}

export async function getHolderCount(tokenAddress) {
try {
    const connection = new Connection(CLUSTER_URL);
    const tokenPublicKey = new PublicKey(tokenAddress);
    const accounts = await connection.getTokenLargestAccounts(tokenPublicKey);
    return accounts.value.length;
} catch (error) {
    console.error('Error fetching holder count:', error);
    throw error;
}
}

export async function handleTokenTransaction(fromPubkey, toPubkey, amount, connection) {
try {
    // Implement token transfer logic here
    // This is a placeholder for the actual implementation
    const transaction = await createTransferTransaction(fromPubkey, toPubkey, amount);
    const signature = await connection.sendTransaction(transaction);
    return signature;
} catch (error) {
    console.error('Error processing transaction:', error);
    throw error;
}
}

export async function subscribeToTokenUpdates(tokenAddress, callback) {
const connection = new Connection(CLUSTER_URL);
const tokenPublicKey = new PublicKey(tokenAddress);

// Subscribe to account changes
const subscriptionId = connection.onAccountChange(
    tokenPublicKey,
    callback,
    'confirmed'
);

return subscriptionId;
}

