import { Connection, PublicKey, LAMPORTS_PER_SOL, Keypair, clusterApiUrl } from '@solana/web3.js';

/**
* Creates a new Solana connection
* @returns {Connection} Solana connection instance
*/
export const createConnection = () => {
try {
    return new Connection(
    clusterApiUrl('devnet'),
    'confirmed'
    );
} catch (error) {
    console.error('Failed to create connection:', error);
    throw new Error('Failed to create Solana connection');
}
};

/**
* Gets account balance in SOL
* @param {string} publicKey - Account public key
* @returns {Promise<number>} Balance in SOL
*/
export const getBalance = async (publicKey) => {
try {
    const connection = createConnection();
    const balance = await connection.getBalance(new PublicKey(publicKey));
    return balance / LAMPORTS_PER_SOL;
} catch (error) {
    console.error('Error getting balance:', error);
    throw new Error('Failed to get account balance');
}
};

/**
* Gets recent blockhash
* @returns {Promise<Object>} Recent blockhash and fee calculator
*/
export const getRecentBlockhash = async () => {
try {
    const connection = createConnection();
    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
    return { blockhash, lastValidBlockHeight };
} catch (error) {
    console.error('Error getting recent blockhash:', error);
    throw new Error('Failed to get recent blockhash');
}
};

/**
* Creates a new Solana wallet
* @returns {Keypair} Generated keypair
*/
export const createWallet = () => {
try {
    return Keypair.generate();
} catch (error) {
    console.error('Error generating wallet:', error);
    throw new Error('Failed to create wallet');
}
};
