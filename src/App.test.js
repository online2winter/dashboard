import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import * as web3 from '@solana/web3.js';

// Mock web3 before importing App
jest.mock('@solana/web3.js', () => ({
clusterApiUrl: jest.fn(network => `https://api.${network}.solana.com`),
Connection: jest.fn()
}));

import App from './App';

jest.mock('@solana/wallet-adapter-wallets', () => ({
PhantomWalletAdapter: jest.fn().mockImplementation(() => ({
    connect: jest.fn(),
    disconnect: jest.fn()
})),
SolflareWalletAdapter: jest.fn().mockImplementation(() => ({
    connect: jest.fn(),
    disconnect: jest.fn()
})),
TorusWalletAdapter: jest.fn().mockImplementation(() => ({
    connect: jest.fn(),
    disconnect: jest.fn()
}))
}));

jest.mock('@solana/wallet-adapter-react', () => ({
ConnectionProvider: ({ children }) => <div data-testid="connection-provider">{children}</div>,
WalletProvider: ({ children }) => <div data-testid="wallet-provider">{children}</div>,
useConnection: () => ({ connection: {} }),
useWallet: () => ({
    publicKey: null,
    connected: false,
    connect: jest.fn(),
    disconnect: jest.fn(),
    connecting: false
})
}));

jest.mock('@solana/wallet-adapter-react-ui', () => ({
WalletModalProvider: ({ children }) => <div data-testid="wallet-modal-provider">{children}</div>
}));

jest.mock('react-router-dom', () => ({
BrowserRouter: ({ children }) => <div data-testid="browser-router">{children}</div>
}));

jest.mock('react-hot-toast', () => ({
Toaster: () => <div data-testid="toaster" />
}));

jest.mock('./components/ErrorBoundary', () => ({
ErrorBoundary: ({ children }) => <div data-testid="error-boundary">{children}</div>
}));

jest.mock('./layouts/MainLayout', () => ({
__esModule: true,
default: ({ children }) => <div data-testid="main-layout">{children}</div>
}));

jest.mock('./pages/Home', () => ({
__esModule: true,
default: () => <div data-testid="home-page" />
}));

jest.mock('./contexts/TokenContext', () => ({
TokenContextProvider: ({ children }) => <div data-testid="token-context-provider">{children}</div>
}));
describe('App', () => {
beforeEach(() => {
    jest.clearAllMocks();
});

it('renders without crashing', () => {
    render(<App />);
    expect(web3.clusterApiUrl).toHaveBeenCalledWith('devnet');
    expect(screen.getByTestId('app-container')).toBeInTheDocument();
});

it('renders all required providers and components', () => {
    render(<App />);
    expect(screen.getByTestId('browser-router')).toBeInTheDocument();
    expect(screen.getByTestId('error-boundary')).toBeInTheDocument();
    expect(screen.getByTestId('connection-provider')).toBeInTheDocument();
    expect(screen.getByTestId('wallet-provider')).toBeInTheDocument();
    expect(screen.getByTestId('wallet-modal-provider')).toBeInTheDocument();
    expect(screen.getByTestId('token-context-provider')).toBeInTheDocument();
    expect(screen.getByTestId('main-layout')).toBeInTheDocument();
    expect(screen.getByTestId('home-page')).toBeInTheDocument();
    expect(screen.getByTestId('toaster')).toBeInTheDocument();
});
});
