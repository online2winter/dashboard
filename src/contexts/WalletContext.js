/**
* @typedef {Object} WalletState
* @property {boolean} isConnected - Indicates if wallet is currently connected
* @property {string} address - Current wallet address (empty string if not connected)
* @property {number|null} chainId - Current chain ID (null if not connected)
* @property {ethers.providers.Web3Provider|null} provider - Ethers provider instance
* @property {ethers.providers.JsonRpcSigner|null} signer - Ethers signer instance
*/

/**
* @typedef {Object} WalletError
* @property {string} code - Error code (e.g., 'USER_REJECTED', 'NETWORK_ERROR')
* @property {string} message - Human-readable error message
*/

/**
* @typedef {Object} NetworkConfig
* @property {number} chainId - Network chain ID
* @property {string} name - Network name (e.g., 'Mainnet', 'Ropsten')
* @property {string} rpcUrl - Network RPC URL
*/

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { ethers } from 'ethers';

/**
* React Context for Ethereum wallet functionality
* @type {React.Context<{
*   isConnected: boolean,
*   address: string,
*   chainId: number|null,
*   provider: ethers.providers.Web3Provider|null,
*   signer: ethers.providers.JsonRpcSigner|null,
*   connect: () => Promise<void>,
*   disconnect: () => void,
*   switchNetwork: (chainId: number) => Promise<void>
* }>}
*/
const EthereumWalletContext = createContext({
isConnected: false,
address: '',
chainId: null,
provider: null,
signer: null,
connect: async () => {},
disconnect: () => {},
switchNetwork: async () => {},
});

/**
* Provider component for Ethereum wallet functionality
* @component
* @example
* return (
*   <EthereumWalletProvider>
*     <App />
*   </EthereumWalletProvider>
* )
* 
* @param {Object} props - Component props
* @param {React.ReactNode} props.children - Child components to render
* @returns {React.ReactElement} Provider component
*/
export function EthereumWalletProvider({ children }) {
const [isConnected, setIsConnected] = useState(false);
const [address, setAddress] = useState('');
const [chainId, setChainId] = useState(null);
const [provider, setProvider] = useState(null);
const [signer, setSigner] = useState(null);

/**
* Check and establish connection with existing wallet
* @type {() => Promise<void>}
* @private
*/
const checkConnection = useCallback(async () => {
    if (window.ethereum) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const accounts = await provider.listAccounts();
    
    if (accounts.length > 0) {
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        const network = await provider.getNetwork();
        
        setProvider(provider);
        setSigner(signer);
        setAddress(address);
        setChainId(network.chainId);
        setIsConnected(true);
    }
    }
}, []);

/**
* Connect to Ethereum wallet
* @async
* @throws {Error} When no Web3 wallet is detected
* @throws {Error} When user rejects connection
* @returns {Promise<void>}
*/
const connect = async () => {
    if (window.ethereum) {
    try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        const network = await provider.getNetwork();
        
        setProvider(provider);
        setSigner(signer);
        setAddress(address);
        setChainId(network.chainId);
        setIsConnected(true);
    } catch (error) {
        console.error("Failed to connect wallet:", error);
    }
    } else {
    console.error("No Web3 wallet detected");
    }
};

/**
* Disconnect from current wallet
* @returns {void}
*/
const disconnect = () => {
    setProvider(null);
    setSigner(null);
    setAddress('');
    setChainId(null);
    setIsConnected(false);
};

/**
* Switch to a different Ethereum network
* @async
* @param {number} chainId - The chain ID of the target network
* @throws {Error} When network switch fails or is rejected
* @returns {Promise<void>}
* @example
* // Switch to Ethereum mainnet
* await switchNetwork(1);
* 
* // Switch to Goerli testnet
* await switchNetwork(5);
*/
const switchNetwork = async (chainId) => {
    if (!window.ethereum) return;
    
    try {
    await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${chainId.toString(16)}` }],
    });
    } catch (error) {
    console.error("Failed to switch network:", error);
    }
};

useEffect(() => {
    checkConnection();
    
    if (window.ethereum) {
    window.ethereum.on('accountsChanged', checkConnection);
    window.ethereum.on('chainChanged', checkConnection);
    
    return () => {
        window.ethereum.removeListener('accountsChanged', checkConnection);
        window.ethereum.removeListener('chainChanged', checkConnection);
    };
    }
}, [checkConnection]);

const value = {
    isConnected,
    address,
    chainId,
    provider,
    signer,
    connect,
    disconnect,
    switchNetwork,
};

return (
    <EthereumWalletContext.Provider value={value}>
    {children}
    </EthereumWalletContext.Provider>
);
}

EthereumWalletProvider.propTypes = {
children: PropTypes.node.isRequired,
};

/**
* Custom hook to access Ethereum wallet functionality
* @returns {Object} Wallet context object
* @property {boolean} isConnected - Whether a wallet is connected
* @property {string} address - Current wallet address
* @property {number|null} chainId - Current chain ID
* @property {ethers.providers.Web3Provider|null} provider - Ethers provider instance
* @property {ethers.providers.JsonRpcSigner|null} signer - Ethers signer instance
* @property {() => Promise<void>} connect - Function to connect wallet
* @property {() => void} disconnect - Function to disconnect wallet
* @property {(chainId: number) => Promise<void>} switchNetwork - Function to switch networks
* @throws {Error} If used outside of EthereumWalletProvider
* @example
* const { isConnected, address, connect } = useEthereumWallet();
* 
* return (
*   <button onClick={connect} disabled={isConnected}>
*     {isConnected ? `Connected: ${address}` : 'Connect Wallet'}
*   </button>
* );
*/
export function useEthereumWallet() {
const context = useContext(EthereumWalletContext);
if (!context) {
    throw new Error('useEthereumWallet must be used within an EthereumWalletProvider');
}
return context;
}

export default EthereumWalletContext;

