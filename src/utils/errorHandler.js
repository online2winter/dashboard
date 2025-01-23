export class AppError extends Error {
constructor(message, code, originalError = null) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.originalError = originalError;
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

export const handleError = (error) => {
if (error instanceof AppError) {
    return error;
}

if (error.message?.includes('wallet not connected')) {
    return new AppError(
    'Please connect your wallet to continue',
    ERROR_CODES.WALLET_NOT_CONNECTED,
    error
    );
}

if (error.message?.includes('network')) {
    return new AppError(
    'Network connection error. Please try again',
    ERROR_CODES.NETWORK_ERROR,
    error
    );
}

if (error.message?.includes('token')) {
    return new AppError(
    'Token not found or invalid',
    ERROR_CODES.TOKEN_NOT_FOUND,
    error
    );
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

