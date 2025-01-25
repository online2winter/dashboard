// Cache version
const CACHE_VERSION = 'v1';
const CACHE_NAME = `crypto-dashboard-${CACHE_VERSION}`;

// Assets to cache on install
const PRECACHE_ASSETS = [
'/',
'/index.html',
'/static/js/main.bundle.js',
'/static/css/main.bundle.css',
'/manifest.json',
'/offline.html',
'/favicon.ico'
];

// API routes to cache with stale-while-revalidate
const API_ROUTES = [
'/api/tokens',
'/api/prices',
'/api/transactions'
];

// Install event - cache core assets
self.addEventListener('install', event => {
event.waitUntil(
    caches.open(CACHE_NAME)
    .then(cache => cache.addAll(PRECACHE_ASSETS))
    .then(() => self.skipWaiting())
    .catch(error => console.error('Cache install error:', error))
);
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
event.waitUntil(
    caches.keys()
    .then(cacheNames => {
        return Promise.all(
        cacheNames
            .filter(name => name.startsWith('crypto-dashboard-') && name !== CACHE_NAME)
            .map(name => caches.delete(name))
        );
    })
    .then(() => self.clients.claim())
    .catch(error => console.error('Cache activation error:', error))
);
});

// Fetch event - handle requests
self.addEventListener('fetch', event => {
const { request } = event;

// Handle API requests
if (API_ROUTES.some(route => request.url.includes(route))) {
    event.respondWith(
    caches.open(CACHE_NAME)
        .then(cache => {
        return fetch(request)
            .then(response => {
            cache.put(request, response.clone());
            return response;
            })
            .catch(() => cache.match(request));
        })
        .catch(error => {
        console.error('API fetch error:', error);
        return caches.match('/offline.html');
        })
    );
    return;
}

// Handle static assets
event.respondWith(
    caches.match(request)
    .then(response => {
        if (response) {
        return response;
        }
        return fetch(request).then(response => {
        if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
        }
        const responseToCache = response.clone();
        caches.open(CACHE_NAME)
            .then(cache => {
            cache.put(request, responseToCache);
            });
        return response;
        });
    })
    .catch(() => {
        if (request.mode === 'navigate') {
        return caches.match('/offline.html');
        }
        return new Response(null, { status: 404 });
    })
);
});

// Background Sync
self.addEventListener('sync', event => {
if (event.tag === 'syncTransactions') {
    event.waitUntil(
    syncTransactions()
        .catch(error => console.error('Background sync failed:', error))
    );
}
});

async function syncTransactions() {
const pendingTransactions = await getPendingTransactions();
for (const tx of pendingTransactions) {
    try {
    await sendTransaction(tx);
    await markTransactionComplete(tx.id);
    } catch (error) {
    console.error('Transaction sync failed:', error);
    }
}
}

// Push Notifications
self.addEventListener('push', event => {
const options = {
    body: event.data.text(),
    icon: '/icon-192x192.png',
    badge: '/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: {
    dateOfArrival: Date.now(),
    primaryKey: 1
    },
    actions: [
    {
        action: 'explore',
        title: 'View Details'
    },
    {
        action: 'close',
        title: 'Close'
    }
    ]
};

event.waitUntil(
    self.registration.showNotification('Crypto Dashboard', options)
    .catch(error => console.error('Push notification error:', error))
);
});

self.addEventListener('notificationclick', event => {
event.notification.close();

if (event.action === 'explore') {
    event.waitUntil(
    clients.openWindow('/')
        .catch(error => console.error('Notification click error:', error))
    );
}
});

// Error handling and logging
self.addEventListener('error', event => {
console.error('Service Worker error:', event.error);
});

self.addEventListener('unhandledrejection', event => {
console.error('Unhandled promise rejection:', event.reason);
});

