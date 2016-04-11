var appVersion = '0.0.1 None51';
var CACHE_NAME = 'sw-cache-' + appVersion;
var urlsToCache = [
  'index.html',
  '/WebTorrentClient/',
  'modernizr-custom.js',
  'adapter.min.js',
  'webtorrent.min.js',
  'localforage.min.js',
  'playlist-parser.min.js',
  'script.js',
  'style.css',
  'logo.svg',
  'logo.png',
  'link_generator.html',
  'script2.js',
  'index2.html',
  'newscript.js',
  'new.html'
];

self.addEventListener('install', function(event) {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Cache hit - return response
        if (response) {
          return response;
        }

        // IMPORTANT: Clone the request. A request is a stream and
        // can only be consumed once. Since we are consuming this
        // once by cache and once by the browser for fetch, we need
        // to clone the response
        var fetchRequest = event.request.clone();

        return fetch(fetchRequest).then(
          function(response) {
            // Check if we received a valid response
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // IMPORTANT: Clone the response. A response is a stream
            // and because we want the browser to consume the response
            // as well as the cache consuming the response, we need
            // to clone it so we have 2 stream.
            var responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(function(cache) {
                var cacheRequest = event.request.clone();
                cache.put(cacheRequest, responseToCache);
              });

            return response;
          }
        );
      })
    );
});

function refreshCache() {
  var cacheWhitelist = [CACHE_NAME];

  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  
  // Calling claim() to force a "controllerchange" event on navigator.serviceWorker
  event.waitUntil(self.clients.claim());
}

self.addEventListener('activate', function(event) {
refreshCache();
});

self.addEventListener('sync', function(event) {

  if (event.tag == 'refreshCache') {
    event.waitUntil(refreshCache());
  }

});