import { useState, useEffect, useCallback } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { handleError, WalletError } from '../utils/errorHandler';
import { showErrorToast } from '../utils/notifications';

/**
* Custom hook for wallet-related functionality
* @returns {{ balance: number, loading: boolean, error: Error|null, refreshBalance: Function }} Hook state and methods
*/
export const useWalletBalance = () => {
const [balance, setBalance] = useState(0);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);
const { connection } = useConnection();
const { publicKey } = useWallet();

const fetchBalance = useCallback(async () => {
    if (!connection || !publicKey) return;

    try {
    setLoading(true);
    const balance = await connection.getBalance(publicKey);
    setBalance(balance);
    setError(null);
    } catch (err) {
    const handledError = err instanceof WalletError ? err : handleError(err);
    setError(handledError);
    showErrorToast(handledError.message);
    } finally {
    setLoading(false);
    }
}, [connection, publicKey]);

useEffect(() => {
    let mounted = true;

    const initBalance = async () => {
    if (mounted) {
        await fetchBalance();
    }
    };

    initBalance();

    return () => {
    mounted = false;
    };
}, [fetchBalance]);

return { balance, loading, error, refreshBalance: fetchBalance };
};

