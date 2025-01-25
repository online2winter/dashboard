import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';

/**
* Initialize Sentry monitoring
* @param {Object} options Configuration options
* @param {string} options.dsn Sentry DSN
* @param {string} options.environment Environment name
* @param {number} options.tracesSampleRate Traces sample rate
*/
export const initializeMonitoring = ({ dsn, environment = 'production', tracesSampleRate = 0.1 }) => {
Sentry.init({
    dsn,
    environment,
    integrations: [new BrowserTracing()],
    tracesSampleRate,
    beforeSend(event) {
    // Don't send users' personal information
    if (event.user) {
        delete event.user.email;
        delete event.user.ip_address;
    }
    return event;
    },
});
};

/**
* Track error with additional context
* @param {Error} error Error object
* @param {Object} context Additional context
*/
export const trackError = (error, context = {}) => {
Sentry.withScope((scope) => {
    scope.setExtras(context);
    Sentry.captureException(error);
});
};

/**
* Start performance transaction
* @param {string} name Transaction name
* @param {string} op Operation type
* @returns {Transaction} Sentry transaction
*/
export const startTransaction = (name, op) => {
return Sentry.startTransaction({ name, op });
};

/**
* Add breadcrumb for debugging
* @param {string} message Breadcrumb message
* @param {string} category Breadcrumb category
* @param {Object} data Additional data
*/
export const addBreadcrumb = (message, category, data = {}) => {
Sentry.addBreadcrumb({
    message,
    category,
    data,
    level: 'info',
});
};

