import React from 'react';
import { render, act, screen, fireEvent, waitFor } from '@testing-library/react';
import { EthereumWalletProvider as WalletProvider, useEthereumWallet as useWallet } from '../WalletContext';

// Mock window.ethereum
const mockEthereum = {
request: jest.fn(),
addListener: jest.fn(),
removeListener: jest.fn(),
isMetaMask: true,
isConnected: jest.fn(),
_eventHandlers: {},
_state: {
    accounts: [],
    isConnected: false,
    chainId: '0x1'
},
// Helper to simulate events
_emit: function(eventName, data) {
    if (this._eventHandlers[eventName]) {
    this._eventHandlers[eventName].forEach(handler => handler(data));
    }
}
};

// Setup event handler mocks
mockEthereum.addListener.mockImplementation((event, handler) => {
if (!mockEthereum._eventHandlers[event]) {
    mockEthereum._eventHandlers[event] = [];
}
mockEthereum._eventHandlers[event].push(handler);
});

mockEthereum.removeListener.mockImplementation((event, handler) => {
if (mockEthereum._eventHandlers[event]) {
    mockEthereum._eventHandlers[event] = mockEthereum._eventHandlers[event]
    .filter(h => h !== handler);
}
});

beforeAll(() => {
global.window = {
    ethereum: mockEthereum
};
});

// Test component to access context
const TestComponent = () => {
const { 
    connect,
    disconnect,
    isConnected,
    address,
    chainId,
    isConnecting,
    switchNetwork,
    error 
} = useWallet();

return (
    <div>
    <div data-testid="wallet-status">
        {isConnected ? 'connected' : 'disconnected'}
    </div>
    <div data-testid="connecting-status">
        {isConnecting ? 'connecting' : 'idle'}
    </div>
    {address && <div data-testid="wallet-address">{address}</div>}
    {chainId && <div data-testid="chain-id">{chainId}</div>}
    {error && <div data-testid="error-message">{error}</div>}
    <button onClick={connect} data-testid="connect-button">
        Connect
    </button>
    <button onClick={disconnect} data-testid="disconnect-button">
        Disconnect
    </button>
    <button 
        onClick={() => switchNetwork('0x5')} 
        data-testid="switch-network-button"
    >
        Switch Network
    </button>
    </div>
);
};

describe('WalletContext', () => {
beforeEach(() => {
// Reset all mocks before each test
jest.clearAllMocks();
mockEthereum.request.mockReset();
mockEthereum._state.isConnected = false;
mockEthereum._state.accounts = [];
mockEthereum._state.chainId = '0x1';
mockEthereum.isConnected.mockReset();
mockEthereum._eventHandlers = {};

// Setup default behaviors
mockEthereum.request.mockImplementation(async ({ method, params }) => {
    switch (method) {
    case 'eth_requestAccounts':
        mockEthereum._state.accounts = ['0x123...'];
        mockEthereum._state.isConnected = true;
        mockEthereum._emit('accountsChanged', ['0x123...']);
        return ['0x123...'];
    case 'wallet_switchEthereumChain':
        const newChainId = params[0].chainId;
        mockEthereum._state.chainId = newChainId;
        mockEthereum._emit('chainChanged', newChainId);
        return null;
    default:
        return null;
    }
});

mockEthereum.isConnected.mockImplementation(() => mockEthereum._state.isConnected);
});

it('initializes with default values', () => {
    render(
    <WalletProvider>
        <TestComponent />
    </WalletProvider>
    );

    expect(screen.getByTestId('wallet-status')).toHaveTextContent('disconnected');
    expect(screen.getByTestId('connecting-status')).toHaveTextContent('idle');
});

it('handles wallet connection successfully', async () => {
// Default behavior set in beforeEach will handle the connection flow

render(
    <WalletProvider>
    <TestComponent />
    </WalletProvider>
);

await act(async () => {
    fireEvent.click(screen.getByTestId('connect-button'));
});

expect(mockEthereum.request).toHaveBeenCalledWith({ 
    method: 'eth_requestAccounts' 
});
expect(screen.getByTestId('connecting-status')).toHaveTextContent('connecting');

await waitFor(() => {
    expect(screen.getByTestId('wallet-status')).toHaveTextContent('connected');
    expect(screen.getByTestId('wallet-address')).toHaveTextContent('0x123...');
});
});
    

it('handles connection errors', async () => {
    mockEthereum.request.mockRejectedValueOnce(new Error('Connection failed'));

    render(
        <WalletProvider>
            <TestComponent />
        </WalletProvider>
    );

    await act(async () => {
        fireEvent.click(screen.getByTestId('connect-button'));
    });

    await waitFor(() => {
        expect(screen.getByTestId('error-message')).toHaveTextContent('Connection failed');
    });
});

it('handles wallet disconnection', async () => {
    mockEthereum._state.isConnected = true;
    mockEthereum._state.accounts = ['0x123...'];
    mockEthereum.isConnected.mockReturnValue(true);
    
    render(
        <WalletProvider>
            <TestComponent />
        </WalletProvider>
    );

    await waitFor(() => {
        expect(screen.getByTestId('wallet-status')).toHaveTextContent('connected');
    });

    await act(async () => {
        fireEvent.click(screen.getByTestId('disconnect-button'));
    });

    mockEthereum._state.isConnected = false;
    mockEthereum._state.accounts = [];
    mockEthereum.isConnected.mockReturnValue(false);

    await waitFor(() => {
        expect(screen.getByTestId('wallet-status')).toHaveTextContent('disconnected');
    });
});

it('handles network switching', async () => {
    mockEthereum.request.mockResolvedValueOnce(null);
    
    render(
        <WalletProvider>
            <TestComponent />
        </WalletProvider>
    );

await act(async () => {
    fireEvent.click(screen.getByTestId('switch-network-button'));
});

expect(mockEthereum.request).toHaveBeenCalledWith({ 
    method: 'wallet_switchEthereumChain',
    params: [{ chainId: '0x5' }]
});
});
    

it('cleans up event listeners on unmount', () => {
    const { unmount } = render(
        <WalletProvider>
            <TestComponent />
        </WalletProvider>
    );

    unmount();

    expect(mockEthereum.removeListener).toHaveBeenCalled();
    });
    });
