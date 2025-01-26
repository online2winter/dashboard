/**
* @typedef {Object} TokenState
* @property {string|null} token - The current token address or identifier
* @property {string} network - Current network (mainnet/testnet)
* @property {boolean} isLoading - Loading state for token operations
* @property {Object} networkConfig - Network-specific configurations
* @property {string|null} error - Current error message if any
*/

/**
* @typedef {Object} TokenOperations
* @property {(newToken: string) => Promise<boolean>} setToken - Sets a new token address
* @property {() => Promise<boolean>} clearToken - Clears the current token
* @property {(newNetwork: string) => void} setNetwork - Changes the network
*/

import React, { createContext, useContext, useState, useCallback } from 'react';
import PropTypes from 'prop-types';

/**
* React Context for token management and operations.
* Used in conjunction with WalletContext for complete Web3 functionality.
* @type {React.Context<TokenState & TokenOperations>}
*/
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
* Provider component for token and network management. Manages token state and provides
* operations for token interactions across the application.
* 
* @component
* @param {Object} props - The provider component props
* @param {React.ReactNode} props.children - Child components to be wrapped
* 
* @example
* // Basic usage
* function App() {
*   return (
*     <TokenContextProvider>
*       <YourComponent />
*     </TokenContextProvider>
*   );
* }
* 
* @example
* // Usage with WalletContext
* function App() {
*   return (
*     <WalletContextProvider>
*       <TokenContextProvider>
*         <YourComponent />
*       </TokenContextProvider>
*     </WalletContextProvider>
*   );
* }
*/
export const TokenContextProvider = ({ children }) => {
    /** @type {[string|null, React.Dispatch<React.SetStateAction<string|null>>]} */
    const [token, setTokenState] = useState(null);
    
    /** @type {[string, React.Dispatch<React.SetStateAction<string>>]} */
    const [network, setNetwork] = useState('mainnet');
    
    /** @type {[boolean, React.Dispatch<React.SetStateAction<boolean>>]} */
    const [isLoading, setIsLoading] = useState(false);
    
    /** @type {[string|null, React.Dispatch<React.SetStateAction<string|null>>]} */
    const [error, setError] = useState(null);
    
    /** 
    * @type {[{
    *   networks: string[],
    *   rpcEndpoint: string
    * }, React.Dispatch<React.SetStateAction<{
    *   networks: string[],
    *   rpcEndpoint: string
    * }>>]}
    */
    const [networkConfig] = useState({
        networks: ['mainnet', 'testnet'],
        rpcEndpoint: 'https://api.mainnet.solana.com'
    });

    /**
    * Sets a new token address/identifier and handles the associated state updates.
    * 
    * @async
    * @function
    * @param {string} newToken - The new token address or identifier to set
    * @returns {Promise<boolean>} Success status of the token update operation
    * @throws {Error} When token validation fails
    * 
    * @example
    * const { setToken } = useTokenContext();
    * try {
    *   await setToken("0x1234...");
    * } catch (error) {
    *   console.error("Failed to set token:", error);
    * }
    */
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

    /**
    * Clears the current token and resets associated state.
    * 
    * @async
    * @function
    * @returns {Promise<boolean>} Success status of the clear operation
    * @throws {Error} When the clear operation fails
    * 
    * @example
    * const { clearToken } = useTokenContext();
    * try {
    *   await clearToken();
    * } catch (error) {
    *   console.error("Failed to clear token:", error);
    * }
    */
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

    /**
    * Handles network changes and validates the new network selection.
    * Updates the network state if validation passes.
    * 
    * @function
    * @param {string} newNetwork - The new network to switch to (mainnet/testnet)
    * @throws {Error} When an invalid network is specified
    * 
    * @example
    * const { setNetwork } = useTokenContext();
    * try {
    *   setNetwork("testnet");
    * } catch (error) {
    *   console.error("Network change failed:", error);
    * }
    */
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
