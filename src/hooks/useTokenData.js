import { useState, useEffect } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { handleError, TokenError } from '../utils/errorHandler';
import { getTokenData } from '../utils/token';
import { showErrorToast } from '../utils/notifications';

/**
* Custom hook to fetch and manage token data
* @param {string} tokenAddress - The address of the token to fetch data for
* @returns {{ tokenData: Object|null, loading: boolean, error: Error|null }} Hook state
*/
export const useTokenData = (tokenAddress) => {
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);
const [tokenData, setTokenData] = useState(null);
const { connection } = useConnection();
const { publicKey } = useWallet();

useEffect(() => {
    let mounted = true;

    const fetchTokenData = async () => {
    if (!connection || !tokenAddress) return;
    
    try {
        setLoading(true);
        const data = await getTokenData(connection, tokenAddress, publicKey);
        if (mounted) {
        setTokenData(data);
        setError(null);
        }
    } catch (err) {
        const handledError = err instanceof TokenError ? err : handleError(err);
        if (mounted) {
        setError(handledError);
        setTokenData(null);
        showErrorToast(handledError.message);
        }
    } finally {
        if (mounted) {
        setLoading(false);
        }
    }
    };

    fetchTokenData();

    return () => {
    mounted = false;
    };
}, [connection, tokenAddress, publicKey]);

return { tokenData, loading, error };
};
