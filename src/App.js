import React, { useMemo } from 'react';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Toaster } from 'react-hot-toast';

// Components
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';

// Solana Wallet
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import {
PhantomWalletAdapter,
SolflareWalletAdapter,
TorusWalletAdapter
} from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';

// Context
import { TokenContextProvider } from './contexts/TokenContext';

// Styles
import '@solana/wallet-adapter-react-ui/styles.css';

function App() {
const endpoint = useMemo(() => {
    return clusterApiUrl(process.env.REACT_APP_SOLANA_NETWORK || 'devnet');
}, []);

const wallets = useMemo(() => [
new PhantomWalletAdapter({
    network: process.env.REACT_APP_SOLANA_NETWORK || 'devnet'
}),
new SolflareWalletAdapter({
    network: process.env.REACT_APP_SOLANA_NETWORK || 'devnet'
}),
new TorusWalletAdapter()
], []);

return (
<ErrorBoundary>
    <ConnectionProvider endpoint={endpoint}>
    <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
        <TokenContextProvider>
            <div className="min-h-screen bg-gray-100">
            <Toaster
                position="top-right"
                toastOptions={{
                duration: 4000,
                className: 'dark:bg-gray-800 dark:text-white',
                style: {
                    background: '#363636',
                    color: '#fff',
                },
                }}
            />
            <MainLayout>
                <Home />
            </MainLayout>
            </div>
        </TokenContextProvider>
        </WalletModalProvider>
    </WalletProvider>
    </ConnectionProvider>
</ErrorBoundary>
);
}

export default App;
