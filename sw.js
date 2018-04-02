const staticCacheName = 'restaurant-reviews-static-v6';
const contentImgsCache = 'restaurant-reviews-imgs';
const allCaches = [
  staticCacheName,
  contentImgsCache
];

  self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(staticCacheName)
      .then( cache => {
      return cache.addAll([
        '/',
        '/restaurant.html',
        'data/restaurants.json',
        'js/main.js',
        'js/index.js',
        'js/dbhelper.js',
        'js/restaurant_info.js',
        'css/styles.css'
      ]);
    })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(cacheName => {
          return cacheName.startsWith('restaurant-reviews-') && !allCaches.includes(cacheName);
        }).map(cacheName => {
          return caches.delete(cacheName);
        })
      )
    })
  );
});

self.addEventListener('fetch', event => {
  const requestUrl = new URL(event.request.url);

  if (requestUrl.origin === location.origin) {
    if (requestUrl.pathname.startsWith("/img/")) {
      event.respondWith(servePhoto(event.request));
      return
    }
  }

  event.respondWith(
    caches.match(event.request).then( response => {
      return response || fetch(event.request);
    })
  );
});

function servePhoto(request) {
  const storageUrl = request.url;

  return caches.open(contentImgsCache).then(function(cache) {
    return cache.match(storageUrl).then(function(response) {
      if (response) return response;

      return fetch(request).then(function(networkResponse) {
        cache.put(storageUrl, networkResponse.clone());
        return networkResponse;
      });
    });
  });
}
