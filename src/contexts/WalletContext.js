import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { ethers } from 'ethers';

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

export function EthereumWalletProvider({ children }) {
const [isConnected, setIsConnected] = useState(false);
const [address, setAddress] = useState('');
const [chainId, setChainId] = useState(null);
const [provider, setProvider] = useState(null);
const [signer, setSigner] = useState(null);

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

const disconnect = () => {
    setProvider(null);
    setSigner(null);
    setAddress('');
    setChainId(null);
    setIsConnected(false);
};

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

export function useEthereumWallet() {
const context = useContext(EthereumWalletContext);
if (!context) {
    throw new Error('useEthereumWallet must be used within an EthereumWalletProvider');
}
return context;
}

export default EthereumWalletContext;

