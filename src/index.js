import React from 'react';
import ReactDOM from 'react-dom/client';
import { Buffer } from 'buffer';
import 'process/browser';
import { WalletContext } from './context/WalletContext';
import { TokenContext } from './context/TokenContext';

// Polyfills
window.Buffer = Buffer;
window.process = require('process/browser');

// Styles
import './index.css';

// Components
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
<React.StrictMode>
    <WalletContext>
    <TokenContext>
        <App />
    </TokenContext>
    </WalletContext>
</React.StrictMode>
);

reportWebVitals();
