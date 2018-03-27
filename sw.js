const staticCacheName = 'restaurant-reviews-static-v4';

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
          return cacheName.startsWith('restaurant-reviews-') && cacheName !== staticCacheName;
        }).map(cacheName => {
          return caches.delete(cacheName);
        })
      )
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



console.log("4");