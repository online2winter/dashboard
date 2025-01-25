import mixpanel from 'mixpanel-browser';

/**
* Initialize analytics
* @param {string} token Mixpanel token
* @param {Object} options Additional options
*/
export const initializeAnalytics = (token, options = {}) => {
mixpanel.init(token, { track_pageview: true, ...options });
};

/**
* Track user event
* @param {string} eventName Event name
* @param {Object} properties Event properties
*/
export const trackEvent = (eventName, properties = {}) => {
try {
    mixpanel.track(eventName, {
    ...properties,
    timestamp: new Date().toISOString(),
    });
} catch (error) {
    console.error('Analytics Error:', error);
}
};

/**
* Set user identity
* @param {string} userId User identifier
* @param {Object} traits User traits
*/
export const identifyUser = (userId, traits = {}) => {
try {
    mixpanel.identify(userId);
    mixpanel.people.set({
    ...traits,
    $last_seen: new Date().toISOString(),
    });
} catch (error) {
    console.error('Analytics Error:', error);
}
};

/**
* Track page view
* @param {string} pageName Page name
* @param {Object} properties Additional properties
*/
export const trackPageView = (pageName, properties = {}) => {
try {
    mixpanel.track('Page View', {
    page: pageName,
    ...properties,
    timestamp: new Date().toISOString(),
    });
} catch (error) {
    console.error('Analytics Error:', error);
}
};

