//WARNING: This cache, while great, will cache your site forever!

self.addEventListener('install', function(e) {
  // Perform install steps:
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

  // Intercepting the requests:
  self.addEventListener('fetch', function(event) {
    event.respondWith(
      caches.match(event.request)
        .then(function(response) {
          // Cache hit - return response
          if (response) {
            return response;
          }
  
          // IMPORTANT: Clone the request.
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
              // to clone it so we have two streams.
              var responseToCache = response.clone();
  
              caches.open('the-magic-cache')
                .then(function(cache) {
                  cache.put(event.request, responseToCache);
                });
  
              return response;
            }
          );
        })
      );
  });