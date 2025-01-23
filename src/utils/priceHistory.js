import axios from 'axios';

const API_BASE_URL = 'https://api.coingecko.com/api/v3';
let priceSocket = null;

export const INTERVALS = {
'1H': { days: 0.04, interval: 'minute', points: 60 },
'24H': { days: 1, interval: 'hour', points: 24 },
'7D': { days: 7, interval: 'hour', points: 168 },
'30D': { days: 30, interval: 'day', points: 30 }
};

export const fetchPriceHistory = async (tokenId, interval = '24H') => {
try {
    const { days } = INTERVALS[interval];
    const response = await axios.get(
    `${API_BASE_URL}/coins/${tokenId}/market_chart`,
    {
        params: {
        vs_currency: 'usd',
        days: days,
        interval: INTERVALS[interval].interval
        }
    }
    );
    
    return formatChartData(response.data.prices, interval);
} catch (error) {
    console.error('Error fetching price history:', error);
    throw error;
}
};

const formatChartData = (priceData, interval) => {
const timestamps = priceData.map(([timestamp]) => {
    const date = new Date(timestamp);
    switch (interval) {
    case '1H':
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    case '24H':
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    case '7D':
        return date.toLocaleDateString([], { weekday: 'short' });
    case '30D':
        return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    default:
        return date.toLocaleDateString();
    }
});

const prices = priceData.map(([, price]) => price);

return {
    labels: timestamps,
    datasets: [{
    label: 'Price (USD)',
    data: prices,
    borderColor: 'rgb(75, 192, 192)',
    backgroundColor: 'rgba(75, 192, 192, 0.2)',
    fill: true,
    tension: 0.4,
    pointRadius: interval === '1H' ? 1 : 2,
    }]
};
};

export const setupPriceWebSocket = (tokenId, onPriceUpdate) => {
if (priceSocket?.readyState === WebSocket.OPEN) {
    priceSocket.close();
}

priceSocket = new WebSocket('wss://stream.binance.com:9443/ws');

priceSocket.onopen = () => {
    const subscribeMsg = {
    method: 'SUBSCRIBE',
    params: [`${tokenId.toLowerCase()}usdt@trade`],
    id: 1
    };
    priceSocket.send(JSON.stringify(subscribeMsg));
};

priceSocket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.p) {
    onPriceUpdate(parseFloat(data.p));
    }
};

priceSocket.onerror = (error) => {
    console.error('WebSocket error:', error);
};

return () => {
    if (priceSocket) {
    priceSocket.close();
    }
};
};

