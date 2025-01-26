import { render, screen } from '@testing-library/react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { TokenContextProvider } from './contexts/TokenContext';
import App from './App';
import { clusterApiUrl } from '@solana/web3.js';

// Mock react-router-dom
jest.mock('react-router-dom', () => ({
BrowserRouter: ({ children }) => <div data-testid="browser-router">{children}</div>
}));

// Mock providers to avoid integration issues
jest.mock('@solana/wallet-adapter-react', () => ({
ConnectionProvider: ({ children }) => <div data-testid="connection-provider">{children}</div>,
WalletProvider: ({ children }) => <div data-testid="wallet-provider">{children}</div>,
}));

jest.mock('@solana/wallet-adapter-react-ui', () => ({
WalletModalProvider: ({ children }) => <div data-testid="wallet-modal-provider">{children}</div>,
}));

jest.mock('./contexts/TokenContext', () => ({
TokenContextProvider: ({ children }) => <div data-testid="token-provider">{children}</div>,
}));

const renderWithProviders = (component) => {
const endpoint = clusterApiUrl('devnet');
return render(
    <BrowserRouter>
    <ConnectionProvider endpoint={endpoint}>
        <WalletProvider>
        <WalletModalProvider>
            <TokenContextProvider>
            {component}
            </TokenContextProvider>
        </WalletModalProvider>
        </WalletProvider>
    </ConnectionProvider>
    </BrowserRouter>
);
};

describe('App Component', () => {
it('renders without crashing', () => {
    renderWithProviders(<App />);
    expect(screen.getByTestId('app-container')).toBeInTheDocument();
});

it('renders with navigation component', () => {
    renderWithProviders(<App />);
    expect(screen.getByTestId('navigation')).toBeInTheDocument();
});

it('wraps content in error boundary', () => {
    renderWithProviders(<App />);
    expect(screen.getByTestId('error-boundary')).toBeInTheDocument();
});

it('includes all required context providers', () => {
renderWithProviders(<App />);
expect(screen.getByTestId('browser-router')).toBeInTheDocument();
expect(screen.getByTestId('connection-provider')).toBeInTheDocument();
expect(screen.getByTestId('wallet-provider')).toBeInTheDocument();
expect(screen.getByTestId('wallet-modal-provider')).toBeInTheDocument();
expect(screen.getByTestId('token-provider')).toBeInTheDocument();
});
});
