/**
* @fileoverview Core component exports for the application
* @module components
*/

/**
* UI Control Components
* @namespace Controls
*/
export { default as Button } from '@/components/common/Button';
export { default as LoadingSpinner } from '@/components/common/LoadingSpinner';
export { default as Card } from '@/components/common/Card';
export { default as WalletButton } from '@/components/WalletButton';
export { default as NetworkSelector } from '@/components/NetworkSelector';

/**
* Data Display Components 
* @namespace DataDisplay
*/
export { default as CoinChart } from '@/components/CoinChart';
export { default as TokenStats } from '@/components/TokenStats';
export { default as TransactionHistory } from '@/components/TransactionHistory';
export { default as NetworkStatus } from '@/components/NetworkStatus';

/** 
* Layout Components
* @namespace Layout
*/
export { default as Navigation } from '@/components/Navigation';
export { default as TokenTransfer } from '@/components/TokenTransfer';

/**
* Error Handling Components
* @namespace ErrorHandling
*/
export { ErrorBoundary, ErrorFallback } from '@/components/ErrorBoundary';
