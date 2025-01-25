import React from 'react';
import { render, screen, act, waitFor } from '@testing-library/react';
import { renderHook } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TokenContextProvider, useTokenContext } from '../TokenContext';

describe('TokenContext', () => {
describe('Provider Rendering', () => {
    it('renders children without crashing', () => {
    render(
        <TokenContextProvider>
        <div data-testid="child">Child Component</div>
        </TokenContextProvider>
    );
    expect(screen.getByTestId('child')).toBeInTheDocument();
    });
});

describe('Default Values', () => {
    it('initializes with default values', () => {
    const { result } = renderHook(() => useTokenContext(), {
        wrapper: TokenContextProvider,
    });

    expect(result.current.token).toBeNull();
    expect(result.current.network).toBe('mainnet');
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
    });
});

describe('Hook Usage', () => {
    it('throws error when used outside provider', () => {
    expect(() => {
        renderHook(() => useTokenContext());
    }).toThrow('useTokenContext must be used within a TokenContextProvider');
    });
});

describe('Token Management', () => {
    it('sets and clears token correctly', async () => {
    const { result } = renderHook(() => useTokenContext(), {
        wrapper: TokenContextProvider,
    });

    await act(async () => {
        result.current.setToken('test-token');
    });

    expect(result.current.token).toBe('test-token');

    await act(async () => {
        result.current.clearToken();
    });

    expect(result.current.token).toBeNull();
    });
});

describe('Network Management', () => {
    it('sets network correctly', async () => {
    const { result } = renderHook(() => useTokenContext(), {
        wrapper: TokenContextProvider,
    });

    await act(async () => {
        result.current.setNetwork('testnet');
    });

    expect(result.current.network).toBe('testnet');
    });

    it('handles invalid network', async () => {
    const { result } = renderHook(() => useTokenContext(), {
        wrapper: TokenContextProvider,
    });

    await act(async () => {
        result.current.setNetwork('invalid-network');
    });

    expect(result.current.error).toBe('Invalid network specified');
    });
});

describe('Loading State', () => {
    it('manages loading state during async operations', async () => {
        const { result } = renderHook(() => useTokenContext(), {
            wrapper: TokenContextProvider,
        });
        
        // Start the async operation
        let setTokenPromise;
        act(() => {
            setTokenPromise = result.current.setToken('new-token');
        });
        
        // Check loading state is true immediately after starting
        expect(result.current.isLoading).toBe(true);
        
        // Wait for the operation to complete
        await act(async () => {
            await setTokenPromise;
        });
        
        // Verify final state
        expect(result.current.isLoading).toBe(false);
        expect(result.current.token).toBe('new-token');
    });
});

describe('Error Handling', () => {
    it('clears error when operation succeeds', async () => {
        const { result } = renderHook(() => useTokenContext(), {
            wrapper: TokenContextProvider,
        });
        
        await act(async () => {
            try {
                await result.current.setNetwork('invalid-network');
            } catch (error) {
                // Expected error
            }
        });
        
        expect(result.current.error).toBe('Invalid network specified');
        
        await act(async () => {
            await result.current.setNetwork('mainnet');
        });
        
        expect(result.current.error).toBeNull();
    });
});
});

