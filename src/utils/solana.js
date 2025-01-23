import * as web3 from '@solana/web3.js';

export const createConnection = () => {
return new web3.Connection(
    web3.clusterApiUrl('devnet'),
    'confirmed'
);
};

export const getBalance = async (publicKey) => {
try {
    const connection = createConnection();
    const balance = await connection.getBalance(new web3.PublicKey(publicKey));
    return balance / web3.LAMPORTS_PER_SOL;
} catch (error) {
    console.error('Error getting balance:', error);
    return 0;
}
};

export const getRecentBlockhash = async () => {
try {
    const connection = createConnection();
    return await connection.getRecentBlockhash();
} catch (error) {
    console.error('Error getting recent blockhash:', error);
    return null;
}
};

export const createWallet = () => {
return web3.Keypair.generate();
};

