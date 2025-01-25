export const NETWORKS = {
MAINNET: {
    id: 1,
    name: 'Ethereum Mainnet',
    nativeCurrency: {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18
    },
    rpcUrl: 'https://mainnet.infura.io/v3/your-api-key',
    blockExplorer: 'https://etherscan.io'
},
GOERLI: {
    id: 5,
    name: 'Goerli Testnet',
    nativeCurrency: {
    name: 'Goerli Ether',
    symbol: 'ETH',
    decimals: 18
    },
    rpcUrl: 'https://goerli.infura.io/v3/your-api-key',
    blockExplorer: 'https://goerli.etherscan.io'
},
SEPOLIA: {
    id: 11155111,
    name: 'Sepolia Testnet',
    nativeCurrency: {
    name: 'Sepolia Ether',
    symbol: 'ETH',
    decimals: 18
    },
    rpcUrl: 'https://sepolia.infura.io/v3/your-api-key',
    blockExplorer: 'https://sepolia.etherscan.io'
},
POLYGON: {
    id: 137,
    name: 'Polygon Mainnet',
    nativeCurrency: {
    name: 'MATIC',
    symbol: 'MATIC',
    decimals: 18
    },
    rpcUrl: 'https://polygon-rpc.com',
    blockExplorer: 'https://polygonscan.com'
},
MUMBAI: {
    id: 80001,
    name: 'Mumbai Testnet',
    nativeCurrency: {
    name: 'MATIC',
    symbol: 'MATIC',
    decimals: 18
    },
    rpcUrl: 'https://rpc-mumbai.maticvigil.com',
    blockExplorer: 'https://mumbai.polygonscan.com'
},
BSC: {
    id: 56,
    name: 'BNB Smart Chain',
    nativeCurrency: {
    name: 'BNB',
    symbol: 'BNB',
    decimals: 18
    },
    rpcUrl: 'https://bsc-dataseed.binance.org',
    blockExplorer: 'https://bscscan.com'
}
};

