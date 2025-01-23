import React, { useState, useEffect } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { NETWORKS } from '../config/networks';
import { useTokenContext } from '../context/TokenContext';
import LoadingSpinner from './common/LoadingSpinner';

const NetworkSelector = () => {
const { currentNetwork, switchNetwork } = useTokenContext();
const [showConfirmation, setShowConfirmation] = useState(false);
const [selectedNetwork, setSelectedNetwork] = useState(null);
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState(null);

const handleNetworkSelect = (network) => {
    setSelectedNetwork(network);
    setShowConfirmation(true);
};

const confirmNetworkSwitch = async () => {
if (selectedNetwork) {
    setIsLoading(true);
    setError(null);
    try {
    await switchNetwork(selectedNetwork.id);
    setShowConfirmation(false);
    } catch (err) {
    setError(err.message);
    } finally {
    setIsLoading(false);
    }
}
};

return (
    <div className="relative">
    <Menu as="div" className="relative inline-block text-left">
        <Menu.Button className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
        {isLoading ? (
        <LoadingSpinner className="h-4 w-4" />
        ) : (
        <>
            {currentNetwork.name}
            <ChevronDownIcon className="-mr-1 h-5 w-5 text-gray-400" aria-hidden="true" />
        </>
        )}
        </Menu.Button>

        <Transition
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
        >
        <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="py-1">
            {Object.values(NETWORKS).map((network) => (
                <Menu.Item key={network.id}>
                {({ active }) => (
                    <button
                    onClick={() => handleNetworkSelect(network)}
                    className={`${
                        active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                    } block px-4 py-2 text-sm w-full text-left ${
                        currentNetwork.id === network.id ? 'font-bold' : ''
                    }`}
                    >
                    {network.name}
                    </button>
                )}
                </Menu.Item>
            ))}
            </div>
        </Menu.Items>
        </Transition>
    </Menu>

    {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-xl">
            <h3 className="text-lg font-medium mb-4">Confirm Network Switch</h3>
            <p className="mb-4">
            Are you sure you want to switch to {selectedNetwork?.name}? Your wallet will need to reconnect.
            {error && (
            <div className="mt-2 text-red-600 text-sm flex items-center">
                <ExclamationCircleIcon className="h-5 w-5 mr-1" />
                {error}
            </div>
            )}
            </p>
            <div className="flex justify-end gap-4">
            <button
                onClick={() => setShowConfirmation(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md"
            >
                Cancel
            </button>
            <button
                onClick={confirmNetworkSwitch}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
            >
                Confirm
            </button>
            </div>
        </div>
        </div>
    )}
    </div>
);
};

export default NetworkSelector;

