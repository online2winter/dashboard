import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { NETWORKS } from '../config/networks';
import { useTokenContext } from '../contexts/TokenContext';
import { useWalletContext } from '../contexts/WalletContext';
import { Button, Card, LoadingSpinner } from './common';
import { ErrorBoundary } from './ErrorBoundary';

/**
* A component that allows users to select and switch between different blockchain networks
* @component
* @param {Object} props - Component props
* @param {string} [props.className] - Optional class name for styling
* @param {string} [props.id] - Optional ID for the component
* @param {Function} [props.onNetworkChange] - Optional callback for network change events
* @return {JSX.Element} The NetworkSelector component
*/
const NetworkSelector = ({ className }) => {
const { currentNetwork, switchNetwork } = useTokenContext();
const { connected } = useWalletContext();
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
<ErrorBoundary>
    <div className={`relative ${className}`}>
    <Menu as="div" className="relative inline-block text-left">
        <Menu.Button 
        className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
        aria-label="Select network"
        >
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
            appear
            show={Boolean(Menu.open)}
            enter="transition ease-out duration-200"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-150"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
        as={React.Fragment}
        enter="transition ease-out duration-200"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-150"
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
                    className={`block px-4 py-2 text-sm w-full text-left ${
                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                    } ${currentNetwork.id === network.id ? 'font-bold' : ''}`}
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
        <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center" 
            role="dialog" 
            aria-modal="true" 
            aria-labelledby="network-switch-title"
        >
            <Card className="w-full max-w-md p-6">
            <h3 id="network-switch-title" className="text-lg font-medium mb-4">Confirm Network Switch</h3>
            <p className="mb-4">
            Are you sure you want to switch to {selectedNetwork?.name}? Your wallet will need to reconnect.
            {error && (
                <div className="mt-2 text-red-600 text-sm flex items-center" role="alert">
                <ExclamationCircleIcon className="h-5 w-5 mr-1" aria-hidden="true" />
                {error}
                </div>
            )}
            </p>
            <div className="flex justify-end gap-4">
            <Button
                onClick={() => setShowConfirmation(false)}
                variant="secondary"
                aria-label="Cancel network switch"
            >
                Cancel
            </Button>
            <Button
                onClick={confirmNetworkSwitch}
                variant="primary"
                aria-label="Confirm network switch"
            >
                Confirm
            </Button>
            </div>
        </Card>
        </div>
    )}
</div>
</ErrorBoundary>
);
};

NetworkSelector.propTypes = {
/** Optional className for styling */
className: PropTypes.string,
/** Optional ID for the component */
id: PropTypes.string,
/** Optional callback for network change events */
onNetworkChange: PropTypes.func,
};

NetworkSelector.defaultProps = {
className: '',
id: undefined,
onNetworkChange: undefined,
};

export default NetworkSelector;
