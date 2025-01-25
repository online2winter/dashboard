import React from 'react';
import ReactDOM from 'react-dom/client';
import { Buffer } from 'buffer';
import 'process/browser';

// Polyfills
window.Buffer = Buffer;
window.process = require('process/browser');

// Styles
import './index.css';

// Components
import App from './App';
import { ErrorBoundary } from './components/ErrorBoundary';
import reportWebVitals from './reportWebVitals';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

const root = ReactDOM.createRoot(rootElement);
root.render(
<React.StrictMode>
    <ErrorBoundary>
    <App />
    </ErrorBoundary>
</React.StrictMode>
);

// Report web vitals if needed
reportWebVitals();
