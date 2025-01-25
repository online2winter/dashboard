import React, { useState, useEffect, useContext } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { TokenContext } from '../contexts/TokenContext';
import { Card } from './common/Card';
import { LoadingSpinner } from './common/LoadingSpinner';
import { ErrorFallback } from './ErrorBoundary';
import Table from './common/Table';
import PropTypes from 'prop-types';

const StatusBadge = ({ status }) => {
const getStatusStyles = () => {
    switch (status) {
    case 'confirmed':
        return 'bg-green-100 text-green-800';
    case 'pending':
        return 'bg-yellow-100 text-yellow-800';
    default:
        return 'bg-red-100 text-red-800';
    }
};

return (
    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusStyles()}`}>
    {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
);
};

StatusBadge.propTypes = {
status: PropTypes.oneOf(['confirmed', 'pending', 'failed']).isRequired,
};

const TransactionHistory = () => {
const { publicKey } = useWallet();
const { getTransactionHistory } = useContext(TokenContext);
const [transactions, setTransactions] = useState([]);
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState('');
const [filter, setFilter] = useState('all'); // all, sent, received

useEffect(() => {
    if (publicKey) {
    fetchTransactions();
    }
}, [publicKey, filter]);

const fetchTransactions = async () => {
    setIsLoading(true);
    try {
    const history = await getTransactionHistory(publicKey.toString(), filter);
    setTransactions(history);
    } catch (err) {
    setError('Failed to load transaction history');
    console.error(err);
    } finally {
    setIsLoading(false);
    }
};

const formatAddress = (address) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
};

const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString();
};


const columns = [
{
    key: 'type',
    label: 'Type',
    render: (tx) => (
    <span className={`font-medium ${tx.type === 'sent' ? 'text-red-600' : 'text-green-600'}`}>
        {tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}
    </span>
    ),
    sortable: true
},
{
    key: 'address',
    label: 'From/To',
    render: (tx) => formatAddress(tx.type === 'sent' ? tx.to : tx.from)
},
{
    key: 'amount',
    label: 'Amount',
    render: (tx) => tx.amount,
    sortable: true
},
{
    key: 'timestamp',
    label: 'Date',
    render: (tx) => formatDate(tx.timestamp),
    sortable: true
},
{
    key: 'status',
    label: 'Status',
    render: (tx) => <StatusBadge status={tx.status} />
}
];

return (
<Card>
    <div className="flex justify-between items-center mb-4">
    <h2 className="text-2xl font-bold">Transaction History</h2>
    <select
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
    >
        <option value="all">All Transactions</option>
        <option value="sent">Sent</option>
        <option value="received">Received</option>
    </select>
    </div>

    {error ? (
    <ErrorFallback error={error} />
    ) : (
    <Table
        columns={columns}
        data={transactions}
        isLoading={isLoading}
        emptyMessage="No transactions found"
        initialSortColumn="timestamp"
        onSort={(column, direction) => {
        // Implement sorting logic here if needed
        }}
    />
    )}
</Card>
);
};

export default TransactionHistory;

