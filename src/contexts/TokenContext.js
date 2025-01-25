import React, { createContext, useContext, useState, useCallback } from 'react';
import PropTypes from 'prop-types';

const TokenContext = createContext(null);

/** 
* Custom hook to access the token context
* @returns {Object} The token context value
* @property {string|null} token - The current token
* @property {Function} setToken - Function to set the token, returns Promise
* @property {Function} clearToken - Function to clear the token
* @property {string} network - Current network (mainnet/testnet)
* @property {Function} setNetwork - Function to set network
* @property {boolean} isLoading - Loading state
* @property {Object} networkConfig - Network configuration
* @property {string|null} error - Current error message, if any
* @throws {Error} If used outside of TokenContextProvider
*/
export const useTokenContext = () => {
    const context = useContext(TokenContext);
    if (context === null) {
        throw new Error('useTokenContext must be used within a TokenContextProvider');
    }
    return context;
};

/**
* Provider component for token and network management
* @param {{ children: React.ReactNode }} props
*/
export const TokenContextProvider = ({ children }) => {
    const [token, setTokenState] = useState(null);
    const [network, setNetwork] = useState('mainnet');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [networkConfig] = useState({
        networks: ['mainnet', 'testnet'],
        rpcEndpoint: 'https://api.mainnet.solana.com'
    });

    const setToken = useCallback(async (newToken) => {
        setIsLoading(true);
        setError(null);
        try {
            // First update token state
            setTokenState(newToken);
            // Then simulate async operation
            await new Promise(resolve => setTimeout(resolve, 0));
            setIsLoading(false);
            return true;
        } catch (err) {
            setError(err.message);
            setIsLoading(false);
            return false;
        }
    }, []);

    const clearToken = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            setTokenState(null);
            await new Promise(resolve => setTimeout(resolve, 0));
            setIsLoading(false);
            return true;
        } catch (err) {
            setError(err.message);
            setIsLoading(false);
            return false;
        }
    }, []);

    const handleNetworkChange = (newNetwork) => {
        setError(null);
        if (!networkConfig.networks.includes(newNetwork)) {
            setError('Invalid network specified');
            return;
        }
        setNetwork(newNetwork);
    };

    const value = {
        token,
        setToken,
        clearToken,
        network,
        setNetwork: handleNetworkChange,
        isLoading,
        networkConfig,
        error
    };

    return (
        <TokenContext.Provider value={value}>
            {children}
        </TokenContext.Provider>
    );
};

TokenContextProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export default TokenContext;
