const staticCacheName = 'restaurant-reviews-static-v2';

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(staticCacheName)
      .then( cache => {
      return cache.addAll([
        "/",
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

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then( response => {
      return response || fetch(event.request);
    })
  );
});