// Service Worker for Cantus PWA
// Progressive Web App with offline support and intelligent caching
var CACHE_NAME, DYNAMIC_CACHE, STATIC_ASSETS, STATIC_CACHE, cacheFirstWithBackgroundUpdate, fetchAndUpdateCache, isNavigationRequest, isStaticAsset, networkFirst, notifyClients, shouldNotifyUpdate, staleWhileRevalidate;

CACHE_NAME = 'musica-2026-03-25T23:08:44.241Z';

STATIC_CACHE = 'musica-static-v3';

DYNAMIC_CACHE = 'musica-dynamic-v3';

// Essential assets for offline functionality
STATIC_ASSETS = ['./', './index.html', './worker.js', './manifest.json', './favicon.ico', './icons/icon-192.png', './icons/icon-512.png', './verovio-toolkit-wasm.js'];

// Installation - cache static assets
self.addEventListener('install', function(event) {
  console.log('SW: Installation started');
  return event.waitUntil(caches.open(STATIC_CACHE).then(function(cache) {
    console.log('SW: Caching static assets');
    return cache.addAll(STATIC_ASSETS);
  }).then(function() {
    console.log('SW: Static assets cached successfully');
    return self.skipWaiting();
  }).catch(function(err) {
    console.error('SW: Install failed', err);
    return Promise.resolve();
  }));
});

// Activation - clean up old caches
self.addEventListener('activate', function(event) {
  console.log('SW: Activation started');
  return event.waitUntil(caches.keys().then(function(keys) {
    return Promise.all(keys.filter(function(k) {
      return k !== STATIC_CACHE && k !== DYNAMIC_CACHE;
    }).map(function(k) {
      console.log('SW: Deleting old cache', k);
      return caches.delete(k);
    }));
  }).then(function() {
    console.log('SW: Activation complete');
    return self.clients.claim();
  }));
});

// Local First strategy with background updates
self.addEventListener('fetch', function(event) {
  var cleanRequest, cleanUrl, request, url;
  ({request} = event);
  url = new URL(request.url);
  // Ignore requests with query params for static assets
  if (url.search && isStaticAsset(url.pathname)) {
    // Create request without query params for cache
    cleanUrl = url.origin + url.pathname;
    cleanRequest = new Request(cleanUrl, request);
    event.respondWith(cacheFirstWithBackgroundUpdate(cleanRequest));
    return;
  }
  // Different strategies based on resource type
  if (isStaticAsset(request.url)) {
    // Cache first with background update for static assets
    return event.respondWith(cacheFirstWithBackgroundUpdate(request));
  } else if (isNavigationRequest(request)) {
    // Network first for navigation (to get latest versions)
    return event.respondWith(networkFirst(request));
  } else {
    // Stale while revalidate for dynamic resources
    return event.respondWith(staleWhileRevalidate(request));
  }
});

// Check if it's a static asset (pathname only)
isStaticAsset = function(urlOrPath) {
  var path;
  path = urlOrPath.startsWith('/') ? urlOrPath : new URL(urlOrPath, 'http://x').pathname;
  return STATIC_ASSETS.some(function(asset) {
    return path === asset || path === asset + '/';
  }) || path.includes('/verovio') || path.includes('/icons/') || path.endsWith('.js') || path.endsWith('.css') || path.endsWith('.png') || path.endsWith('.ico') || path.endsWith('.svg');
};

// Check if it's a navigation request
isNavigationRequest = function(request) {
  return request.mode === 'navigate' || (request.method === 'GET' && request.headers.get('accept').includes('text/html'));
};

// Cache First with background update
cacheFirstWithBackgroundUpdate = async function(request) {
  var cache, cached, error, response, responseClone;
  cache = (await caches.open(STATIC_CACHE));
  cached = (await cache.match(request));
  if (cached) {
    // Serve from cache immediately
    console.log('SW: Serving from cache', request.url);
    // Update in background
    fetchAndUpdateCache(request, cache);
    return cached;
  }
  // If not in cache, fetch from network
  console.log('SW: Not in cache, fetching from network', request.url);
  try {
    response = (await fetch(request));
    if (response.ok) {
      responseClone = response.clone();
      await cache.put(request, responseClone);
    }
    return response;
  } catch (error1) {
    error = error1;
    console.error('SW: Network failed', request.url, error);
    throw error;
  }
};

// Network First for navigation
networkFirst = async function(request) {
  var cache, cached, error, response, responseClone;
  cache = (await caches.open(DYNAMIC_CACHE));
  try {
    console.log('SW: Trying network first', request.url);
    response = (await fetch(request));
    if (response.ok) {
      responseClone = response.clone();
      await cache.put(request, responseClone);
      console.log('SW: Network success, cached', request.url);
    }
    return response;
  } catch (error1) {
    error = error1;
    console.log('SW: Network failed, trying cache', request.url);
    cached = (await cache.match(request));
    if (cached) {
      return cached;
    }
    throw error;
  }
};

// Stale While Revalidate for dynamic resources
staleWhileRevalidate = async function(request) {
  var cache, cached, fetchPromise;
  cache = (await caches.open(DYNAMIC_CACHE));
  cached = (await cache.match(request));
  // Always try to update
  fetchPromise = fetch(request).then(async function(response) {
    var responseClone;
    if (response.ok) {
      responseClone = response.clone();
      await cache.put(request, responseClone);
      console.log('SW: Updated in cache', request.url);
    }
    return response;
  }).catch(function(error) {
    return console.error('SW: Background update failed', request.url, error);
  });
  // Return cache if available, otherwise wait for network
  if (cached) {
    console.log('SW: Serving stale, updating in background', request.url);
    return cached;
  }
  console.log('SW: Not in cache, waiting for network', request.url);
  return fetchPromise;
};

// Update cache in background
fetchAndUpdateCache = async function(request, cache) {
  var error, response;
  try {
    response = (await fetch(request));
    if (response.ok) {
      await cache.put(request, response);
      console.log('SW: Background update successful', request.url);
      // Notify clients if it's an important update
      if (shouldNotifyUpdate(request.url)) {
        return notifyClients('update', {
          url: request.url,
          message: 'Mise à jour disponible'
        });
      }
    }
  } catch (error1) {
    error = error1;
    return console.error('SW: Background update failed', request.url, error);
  }
};

// Determine if we should notify the client
shouldNotifyUpdate = function(url) {
  // Notify for main files
  return url.includes('/index.html') || url.includes('/worker.js') || url.includes('/app.js');
};

// Notify all clients
notifyClients = function(type, data) {
  return self.clients.matchAll().then(function(clients) {
    return clients.forEach(function(client) {
      return client.postMessage({
        type: type,
        data: data,
        timestamp: Date.now()
      });
    });
  });
};

// Listen for messages from clients
self.addEventListener('message', function(event) {
  var data, type;
  ({type, data} = event.data);
  switch (type) {
    case 'SKIP_WAITING':
      return self.skipWaiting();
    case 'GET_VERSION':
      return event.ports[0].postMessage({
        version: CACHE_NAME,
        timestamp: Date.now()
      });
    case 'FORCE_UPDATE':
      // Force update of static assets
      return caches.open(STATIC_CACHE).then(function(cache) {
        return STATIC_ASSETS.forEach(function(asset) {
          return fetchAndUpdateCache(new Request(asset), cache);
        });
      });
  }
});
