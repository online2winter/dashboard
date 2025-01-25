import React, { useState, useEffect, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import { LoadingSpinner } from './common';
import {
Chart as ChartJS,
CategoryScale,
LinearScale,
PointElement,
LineElement,
Title,
Tooltip,
Legend,
Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { fetchPriceHistory, setupPriceWebSocket, INTERVALS } from '../utils/priceHistory';

ChartJS.register(
CategoryScale,
LinearScale,
PointElement,
LineElement,
Title,
Tooltip,
Legend,
Filler
);

const options = {
responsive: true,
maintainAspectRatio: false,
plugins: {
    legend: {
    position: 'top',
    labels: {
        font: {
        family: "'Inter', sans-serif",
        size: 12
        }
    }
    },
    title: {
    display: true,
    text: 'Token Price Chart',
    font: {
        family: "'Inter', sans-serif",
        size: 16,
        weight: 'bold'
    }
    },
    tooltip: {
    mode: 'index',
    intersect: false,
    }
},
scales: {
    x: {
    grid: {
        display: false
    }
    },
    y: {
    grid: {
        color: 'rgba(0, 0, 0, 0.05)'
    },
    ticks: {
        callback: (value) => `$${value.toFixed(2)}`
    }
    }
},
hover: {
    mode: 'nearest',
    intersect: false
},
animation: {
    duration: 750
}
};

const CoinChart = ({ tokenId }) => {
const [interval, setInterval] = useState('24H');  
const [chartData, setChartData] = useState(null);
const [isLoading, setIsLoading] = useState(true);
const [error, setError] = useState(null);

const chartRef = useRef(null);

const updateChartData = useCallback(async () => {
    try {
    setIsLoading(true);
    setError(null);
    const data = await fetchPriceHistory(tokenId, interval);
    setChartData(data);
    } catch (err) {
    setError('Failed to fetch price data');
    console.error('Error fetching price history:', err);
    } finally {
    setIsLoading(false);
    }
}, [tokenId, interval]);

/**
* Fetches initial price data and sets up WebSocket connection for live updates
* @returns {Function} Cleanup function that closes WebSocket connection
*/
useEffect(() => {
    updateChartData();
    const cleanup = setupPriceWebSocket(tokenId, (newPrice) => {
    if (chartData && interval === '1H') {
        const newChartData = { ...chartData };
        newChartData.datasets[0].data.push(newPrice);
        newChartData.datasets[0].data.shift();
        newChartData.labels.push(new Date().toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
        }));
        newChartData.labels.shift();
        setChartData(newChartData);
    }
    });

    return () => cleanup();
}, [tokenId, interval, updateChartData]); // Remove chartData dependency to prevent unnecessary re-renders

if (error) {
return (
    <div className="w-full h-96 flex items-center justify-center bg-white rounded-lg shadow-lg">
    <div className="text-center">
        <p className="text-red-500 font-medium mb-2">{error}</p>
        <button
        onClick={updateChartData}
        className="text-blue-500 hover:text-blue-600 text-sm font-medium"
        >
        Try Again
        </button>
    </div>
    </div>
);
}

return (
    <div className="w-full space-y-4">
    <div className="flex justify-end space-x-2">
        {Object.keys(INTERVALS).map((key) => (
        <button
            key={key}
            onClick={() => setInterval(key)}
            className={`px-3 py-1 rounded-md text-sm font-medium ${
            interval === key
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
        >
            {key}
        </button>
        ))}
    </div>
    <div className="w-full h-96 p-4 bg-white rounded-lg shadow-lg">
        {isLoading ? (
            <div className="w-full h-full flex items-center justify-center">
                <LoadingSpinner size="lg" />
            </div>
        ) : (
            chartData && <Line ref={chartRef} options={options} data={chartData} />
        )}
    </div>
    </div>
);
};

/**
* PropTypes for CoinChart component
* @type {Object}
*/
CoinChart.propTypes = {
/** The ID of the token to display price data for */
tokenId: PropTypes.string.isRequired
};

/**
* Default props for CoinChart component
* @type {Object}
*/
CoinChart.defaultProps = {
tokenId: 'solana'
};

export default CoinChart;
