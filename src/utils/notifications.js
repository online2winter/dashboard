import toast from 'react-hot-toast';
import { AppError, TransactionError, WalletError, NetworkError } from './errorHandler';

/** Default toast configuration */
const defaultConfig = {
duration: 4000,
position: 'top-right'
};

/** Toast notification utilities */
export const notify = {
/** Success notification
* @param {string} message - Success message to display
*/
success: (message) => 
    toast.success(message, defaultConfig),
    
/** Error notification
* @param {string | Error} error - Error message or object
*/
error: (error) => {
    const message = error instanceof Error ? error.message : error;
    toast.error(message, defaultConfig);
},

/** Loading notification
* @param {string} message - Loading message to display
* @returns {string} Toast ID for dismissal
*/
loading: (message) =>
    toast.loading(message, defaultConfig),
    
/** Warning notification
* @param {string} message - Warning message to display
*/
warning: (message) =>
    toast.custom(message, {
    ...defaultConfig,
    icon: '⚠️'
    }),
    
/** Information notification
* @param {string} message - Info message to display
*/
info: (message) =>
    toast.custom(message, {
    ...defaultConfig,
    icon: '📢'
    }),
    
/** Dismiss a specific toast
* @param {string} toastId - ID of toast to dismiss
*/
dismiss: (toastId) => 
    toast.dismiss(toastId)
};

/** Handle and display transaction errors
* @param {Error} error - The error to handle
*/
export const handleTransactionError = (error) => {
const appError = error instanceof AppError ? error : handleError(error);

let message = 'Transaction failed';
if (appError instanceof TransactionError) {
    message = 'Transaction failed to complete. Please try again.';
} else if (appError instanceof WalletError) {
    message = 'Please connect your wallet and try again.';
} else if (appError instanceof NetworkError) {
    message = 'Network error occurred. Please check your connection.';
}

notify.error(message);

// Log error for debugging
console.error('Transaction Error:', {
    name: appError.name,
    message: appError.message,
    code: appError.code,
    original: appError.originalError
});
};

