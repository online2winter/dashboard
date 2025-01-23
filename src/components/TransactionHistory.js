import React, { useState, useEffect, useContext } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { TokenContext } from '../context/TokenContext';

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

const getTransactionStatus = (status) => {
    switch (status) {
    case 'confirmed':
        return (
        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
            Confirmed
        </span>
        );
    case 'pending':
        return (
        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
            Pending
        </span>
        );
    default:
        return (
        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
            Failed
        </span>
        );
    }
};

return (
    <div className="bg-white shadow rounded-lg p-6">
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

    {error && (
        <div className="text-red-600 mb-4">{error}</div>
    )}

    {isLoading ? (
        <div className="text-center py-4">Loading transactions...</div>
    ) : transactions.length > 0 ? (
        <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
            <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                From/To
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
                </th>
            </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
            {transactions.map((tx) => (
                <tr key={tx.signature}>
                <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`font-medium ${
                    tx.type === 'sent' ? 'text-red-600' : 'text-green-600'
                    }`}>
                    {tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}
                    </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                    {formatAddress(tx.type === 'sent' ? tx.to : tx.from)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                    {tx.amount}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                    {formatDate(tx.timestamp)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                    {getTransactionStatus(tx.status)}
                </td>
                </tr>
            ))}
            </tbody>
        </table>
        </div>
    ) : (
        <div className="text-center py-4 text-gray-500">
        No transactions found
        </div>
    )}
    </div>
);
};

export default TransactionHistory;

