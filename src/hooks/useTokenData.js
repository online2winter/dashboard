import { useState, useEffect } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { handleError } from '../utils/errorHandler';
import { getTokenData } from '../services/token';

export const useTokenData = (tokenAddress) => {
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
const [tokenData, setTokenData] = useState(null);
const { connection } = useConnection();
const { publicKey } = useWallet();

useEffect(() => {
    const fetchTokenData = async () => {
    try {
        setLoading(true);
        const data = await getTokenData(connection, tokenAddress, publicKey);
        setTokenData(data);
        setError(null);
    } catch (err) {
        const handledError = handleError(err);
        setError(handledError);
        setTokenData(null);
    } finally {
        setLoading(false);
    }
    };

    if (connection && tokenAddress) {
    fetchTokenData();
    }
}, [connection, tokenAddress, publicKey]);

return { tokenData, loading, error };
};

