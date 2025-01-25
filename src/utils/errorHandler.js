/** Base error class for application errors */
export class AppError extends Error {
/**
* @param {string} message - Error message
* @param {string} code - Error code
* @param {Error} [originalError] - Original error if wrapping
*/
constructor(message, code, originalError = null) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.originalError = originalError;
    this.isOperational = true;
}
}

/** Network-related errors */
export class NetworkError extends AppError {
constructor(message, originalError = null) {
    super(message, ERROR_CODES.NETWORK_ERROR, originalError);
    this.name = 'NetworkError';
}
}

/** Wallet connection errors */
export class WalletError extends AppError {
constructor(message, originalError = null) {
    super(message, ERROR_CODES.WALLET_NOT_CONNECTED, originalError);
    this.name = 'WalletError';
}
}

/** Token-related errors */
export class TokenError extends AppError {
constructor(message, originalError = null) {
    super(message, ERROR_CODES.TOKEN_NOT_FOUND, originalError);
    this.name = 'TokenError';
}
}

/** Transaction errors */
export class TransactionError extends AppError {
constructor(message, originalError = null) {
    super(message, ERROR_CODES.TRANSACTION_FAILED, originalError);
    this.name = 'TransactionError';
}
}

export const ERROR_CODES = {
WALLET_NOT_CONNECTED: 'WALLET_NOT_CONNECTED',
NETWORK_ERROR: 'NETWORK_ERROR',
TOKEN_NOT_FOUND: 'TOKEN_NOT_FOUND',
INSUFFICIENT_BALANCE: 'INSUFFICIENT_BALANCE',
TRANSACTION_FAILED: 'TRANSACTION_FAILED',
UNKNOWN_ERROR: 'UNKNOWN_ERROR'
};

/**
* Handles and transforms errors into proper application errors
* @param {Error} error - The error to handle
* @returns {AppError} - A properly typed application error
*/
export const handleError = (error) => {
if (error instanceof AppError) {
    return error;
}

const msg = error.message?.toLowerCase() || '';

if (msg.includes('wallet not connected')) {
    return new WalletError('Please connect your wallet to continue', error);
}

if (msg.includes('network')) {
    return new NetworkError('Network connection error. Please try again', error);
}

if (msg.includes('token')) {
    return new TokenError('Token not found or invalid', error);
}

if (msg.includes('transaction')) {
    return new TransactionError('Transaction failed to complete', error);
}

return new AppError(
    'An unexpected error occurred',
    ERROR_CODES.UNKNOWN_ERROR,
    error
);
};

export const isOperationalError = (error) => {
return error instanceof AppError && error.code !== ERROR_CODES.UNKNOWN_ERROR;
};

