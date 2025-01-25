import { 
Connection, 
Transaction, 
SystemProgram, 
PublicKey
} from '@solana/web3.js';
import { toast } from 'react-hot-toast';

export class TransactionError extends Error {
constructor(message) {
    super(message);
    this.name = 'TransactionError';
}
}

/**
* Calculates the transaction fee
* @param {Connection} connection - Solana connection instance
* @returns {Promise<number>} Transaction fee in lamports
*/
export const calculateFee = async (connection) => {
try {
    const { feeCalculator } = await connection.getRecentBlockhash();
    return feeCalculator.lamportsPerSignature;
} catch (error) {
    toast.error('Error calculating fee');
    throw new TransactionError('Failed to calculate transaction fee');
}
};

/**
* Creates a new transaction
* @param {Object} params Transaction parameters
* @param {PublicKey} params.fromPubkey Sender's public key
* @param {PublicKey} params.toPubkey Recipient's public key
* @param {number} params.amount Amount in lamports
* @param {Connection} params.connection Solana connection instance
* @returns {Promise<Transaction>} Created transaction
*/
export const createTransaction = async ({
fromPubkey,
toPubkey,
amount,
connection,
}) => {
try {
    const transaction = new Transaction().add(
    SystemProgram.transfer({
        fromPubkey,
        toPubkey,
        lamports: amount,
    })
    );

    const { blockhash } = await connection.getRecentBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = fromPubkey;

    return transaction;
} catch (error) {
    toast.error('Error creating transaction');
    throw new TransactionError('Failed to create transaction');
}
};

export const validateTransaction = async (transaction, connection) => {
try {
    const simulation = await connection.simulateTransaction(transaction);
    return simulation.value.err === null;
} catch (error) {
    toast.error('Transaction validation failed');
    return false;
}
};

