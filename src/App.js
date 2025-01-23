import React, { useMemo } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
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
import { TokenContextProvider } from './context/TokenContext';

// Styles
import '@solana/wallet-adapter-react-ui/styles.css';

function ErrorFallback({ error, resetErrorBoundary }) {
return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
    <div className="p-8 text-center bg-white rounded-lg shadow-xl">
        <h2 className="text-2xl font-bold text-red-600">Something went wrong:</h2>
        <pre className="mt-4 text-sm text-gray-600 bg-gray-100 p-4 rounded">{error.message}</pre>
        <button
        onClick={resetErrorBoundary}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
        Try again
        </button>
    </div>
    </div>
);
}

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
<ErrorBoundary FallbackComponent={ErrorFallback}>
    <ConnectionProvider endpoint={endpoint}>
    <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
        <TokenContextProvider>
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
            <ErrorBoundary FallbackComponent={ErrorFallback}>
                <Home />
            </ErrorBoundary>
            </MainLayout>
        </TokenContextProvider>
        </WalletModalProvider>
    </WalletProvider>
    </ConnectionProvider>
</ErrorBoundary>
);
}

export default App;
