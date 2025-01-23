import { web3 } from '@solana/web3.js';
import { toast } from 'react-hot-toast';

export const calculateFee = async (connection) => {
const { feeCalculator } = await connection.getRecentBlockhash();
return feeCalculator.lamportsPerSignature;
};

export const createTransaction = async ({
fromPubkey,
toPubkey,
amount,
connection,
}) => {
try {
    const transaction = new web3.Transaction().add(
    web3.SystemProgram.transfer({
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
    throw error;
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

