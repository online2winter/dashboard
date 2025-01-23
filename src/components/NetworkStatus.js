import React, { useState, useEffect } from 'react';
import { Connection } from '@solana/web3.js';

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
    <div className="network-status">
    <div className={`status-indicator ${status}`}>
        <span className="status-dot"></span>
        <span className="status-text">{status}</span>
    </div>
    
    {latency && (
        <div className="latency-display">
        <span className="latency-label">Latency:</span>
        <span className="latency-value">{latency}ms</span>
        </div>
    )}
    
    {error && (
        <div className="error-message">
        <span className="error-icon">⚠️</span>
        <span className="error-text">{error}</span>
        </div>
    )}
    </div>
);
};

export default NetworkStatus;

