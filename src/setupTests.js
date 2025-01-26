import '@testing-library/jest-dom';
import { TextDecoder, TextEncoder } from 'util';
import { Crypto } from '@peculiar/webcrypto';
import { Connection } from '@solana/web3.js';
import { toast } from 'react-hot-toast';

// Mock TextEncoder/Decoder for Node environment
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Mock Web Crypto API
global.crypto = new Crypto();

// Mock Solana Connection
jest.mock('@solana/web3.js', () => ({
Connection: jest.fn(() => ({
    getBalance: jest.fn().mockResolvedValue(1000000),
    getTokenAccountsByOwner: jest.fn().mockResolvedValue({ value: [] }),
})),
PublicKey: jest.fn(key => ({ toBase58: () => key })),
}));

// Mock toast notifications
jest.mock('react-hot-toast', () => ({
toast: {
    success: jest.fn(),
    error: jest.fn(),
    loading: jest.fn(),
},
}));

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
writable: true,
value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
})),
});

// Mock window.ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
observe: jest.fn(),
unobserve: jest.fn(),
disconnect: jest.fn(),
}));
