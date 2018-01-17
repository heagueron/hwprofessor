//WARNING: This cache, while great, will cache your site forever!

self.addEventListener('install', function(e) {
    e.waitUntil(
      caches.open('the-magic-cache').then(function(cache) {
        return cache.addAll([
          '/',
          '../index.html',
          '../pricing.html',
          '../faq.html',
          '../quotation.html',
          '../manifest.json',
          '../img/studying-2.jpg',
          '../img/studying-2-mobile.jpg',
          '../img/chemistry.jpg',
          '../img/chinese.jpg',
          '../img/code.jpeg',
          '../img/physics.gif',
          '../img/mathematics.jpg',
          '../img/programming.jpg',
          '../img/writing-spanish.jpg',
          '../img/icons/android-chrome-192x192.png',
          '../css/style.css',
        ]);
      })
    );
  });

  /* Intercepting the requests:*/
  self.addEventListener('fetch', function(event) {
    event.respondWith(
      caches.match(event.request).then(function(response) {
        return response || fetch(event.request);
      })
    );
  });