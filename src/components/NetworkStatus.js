import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Connection } from '@solana/web3.js';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { Card } from './common';

/**
* Network connection status component that displays connection state and latency
* @param {Object} props Component props
* @param {string} props.endpoint The network endpoint URL
*/
const NetworkStatus = ({ endpoint }) => {
const [status, setStatus] = useState('connecting');
const [latency, setLatency] = useState(null);
const [error, setError] = useState(null);

useEffect(() => {
    let mounted = true;
    const connection = new Connection(endpoint);
    let intervalId;

    const checkConnection = async () => {
    try {
        const start = performance.now();
        await connection.getVersion();
        const end = performance.now();
        
        if (mounted) {
        setLatency(Math.round(end - start));
        setStatus('connected');
        setError(null);
        }
    } catch (err) {
        if (mounted) {
        setStatus('error');
        setError(err.message);
        setLatency(null);
        }
    }
    };

    // Initial check
    checkConnection();

    // Periodic checks
    intervalId = setInterval(checkConnection, 30000);

    return () => {
    mounted = false;
    clearInterval(intervalId);
    };
}, [endpoint]);

return (
<Card className="flex flex-col space-y-2">
    <div className="flex items-center space-x-2">
    <div
        className={`h-2 w-2 rounded-full ${
    status === 'connected' ? 'bg-green-500' :
    status === 'connecting' ? 'bg-yellow-500' :
    'bg-red-500'
    }`} />
    <span className="text-sm font-medium capitalize">{status}</span>
</div>

{latency && (
    <div className="flex items-center space-x-2 text-sm text-gray-600">
    <span className="font-medium">Latency:</span>
    <span>{latency}ms</span>
    </div>
)}

{error && (
    <div className="flex items-center space-x-2 text-sm text-red-600">
    <ExclamationCircleIcon className="h-5 w-5" />
    <span>{error}</span>
    </div>
)}
</div>
</Card>
);

NetworkStatus.propTypes = {
endpoint: PropTypes.string.isRequired,
};

export default NetworkStatus;
