const staticCacheName = 'restaurant-reviews-static-v6';
const contentImgsCache = 'restaurant-reviews-imgs';
const allCaches = [
  staticCacheName,
  contentImgsCache
];

/* Image sizes used on site */
const imageSizes = [];
imageSizes['small'] = 400;
imageSizes['big'] = 800;

  self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(staticCacheName)
      .then( cache => {
      return cache.addAll([
        '/',
        '/restaurant.html',
        'js/main.js',
        'js/index.js',
        'js/dbhelper.js',
        'js/idb.js',
        'js/restaurant_info.js',
        'css/styles.css',
        'img/restaurant-default.svg',
      ]);
    }) && caches.open(contentImgsCache).then( cache => {
      return cache.addAll([
        'img/1-400.jpg',
        'img/2-400.jpg',
        'img/3-400.jpg',
        'img/4-400.jpg',
        'img/5-400.jpg',
        'img/6-400.jpg',
        'img/7-400.jpg',
        'img/8-400.jpg',
        'img/9-400.jpg',
        'img/10-400.jpg'
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
    // little workaround for default svgs
    if (requestUrl.pathname.startsWith("/img/") && !(requestUrl.pathname.endsWith("default.svg"))) {
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

  // Get some informations about image
  const imageUrl = request.url;
  const requestedSize = imageUrl.replace(/.*\D(?=\d)|\D+$/g, "");
  const urlWithoutSize = request.url.replace(/-\d+\.jpg$/, '');
  const smallImageUrl = `${urlWithoutSize}-${imageSizes['small']}.jpg`;
  const bigImageUrl = `${urlWithoutSize}-${imageSizes['big']}.jpg`;

  return caches.open(contentImgsCache).then( cache => {

    /* Ask cache for big image, even if requested image is small. Maybe bigger version is already cached */
    return cache.match(bigImageUrl).then( response => {
      if (response) { return response;}

      /* If there's no big image in cache, and requested image is big, try to fetch the big photo */
      if(requestedSize == 800){
        return fetch(request).then( networkResponse => {

          /* If there's network connection, return fetched photo and delete smaller, as we don't need it anymore */
          if(networkResponse){
            cache.put(imageUrl, networkResponse.clone());
            cache.delete(smallImageUrl);
            return networkResponse;
          }

          /* Else, try to return smaller size if cached */
          return cache.match(smallImageUrl).then( response => {
            return response;
          })
        });
      }

      if(requestedSize == 400){

        /* Return small image from cache, else fetch it */
        return cache.match(smallImageUrl).then(response => {
          if (response) return response;

          return fetch(request).then(networkResponse => {
            cache.put(imageUrl, networkResponse.clone());
            return networkResponse;
          })
        })
      }

    });
  });
}
