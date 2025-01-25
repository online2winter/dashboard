import { Connection, PublicKey, TransactionInstruction } from '@solana/web3.js';
import axios from 'axios';
import { NETWORKS } from '../config/networks';
import { TOKEN_CONFIG } from '../config/token.config';

/** @constant Default network configuration */
export const DEFAULT_NETWORK = NETWORKS.mainnet;

/** 
* Creates and returns a connection instance
* @param {string} [network=DEFAULT_NETWORK.endpoint] - Network endpoint URL
* @returns {Connection} Solana connection instance 
*/
export const getConnection = (network = DEFAULT_NETWORK.endpoint) => new Connection(network);

/**
* Fetch token metadata from the network
* @param {string} tokenAddress Token public key address
* @param {Connection} [connection] Optional connection instance
* @returns {Promise<Object>} Token metadata
*/
export const getTokenMetadata = async (tokenAddress, connection = getConnection()) => {
    try {
        const tokenPublicKey = new PublicKey(tokenAddress);
        const accountInfo = await connection.getParsedAccountInfo(tokenPublicKey);
        if (!accountInfo?.value?.data) {
            throw new Error('Token metadata not found');
        }
        return accountInfo.value.data;
    } catch (error) {
        console.error('Error fetching token metadata:', error);
        throw error;
    }
}

/**
* Get token balance for a given address
* @param {string} address Wallet public key
* @param {Connection} [connection] Optional connection instance
* @returns {Promise<number>} Token balance
*/
export const getTokenBalance = async (address, connection = getConnection()) => {
    try {
        const publicKey = new PublicKey(address);
        const balance = await connection.getBalance(publicKey);
        return balance / Math.pow(10, TOKEN_CONFIG.decimals);
    } catch (error) {
        console.error('Error fetching token balance:', error);
        throw error;
    }
}

/**
* Fetch token price from external API
* @param {string} tokenAddress Token identifier
* @returns {Promise<number>} Token price in USD
*/
export const getTokenPrice = async (tokenAddress) => {
    try {
        const response = await axios.get(
            `https://api.coingecko.com/api/v3/simple/price?ids=${tokenAddress}&vs_currencies=usd`,
            { timeout: 5000 }
        );
        if (!response.data?.[tokenAddress]?.usd) {
            throw new Error('Token price not found');
        }
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

