import toast from 'react-hot-toast';

export const notify = {
success: (message) => 
    toast.success(message, {
    duration: 4000,
    position: 'top-right',
    }),
    
error: (message) =>
    toast.error(message, {
    duration: 4000,
    position: 'top-right',
    }),
    
loading: (message) =>
    toast.loading(message, {
    position: 'top-right',
    }),
    
custom: (message, type = 'default') =>
    toast(message, {
    duration: 4000,
    position: 'top-right',
    icon: type === 'warning' ? '⚠️' : '📢',
    }),
};

export const handleTransactionError = (error) => {
const message = error?.message || 'Transaction failed';
notify.error(message.slice(0, 100));  // Limit length for readability
};

