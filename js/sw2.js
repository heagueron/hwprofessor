//Servie worker 2 - Includes old caches clearing

// configuration
const
version = '1.0.0',
CACHE = version + '::PWAsite',
offlineURL = '../js/offlinepage.js',
installFilesEssential = [
  '/',
  '../index.html',
  '../pricing.html',
  '../faq.html',
  '../quotation.html',
  '../manifest.json',
  '../img/studying-2.jpg',
  '../img/studying-2-mobile.jpg',
  '../css/style.css', 
  '../js/offlinepage.js',
  '../img/icons/android-chrome-192x192.png',
],
installFilesDesirable = [
    '../img/chemistry.jpg',
    '../img/chinese.jpg',
    '../img/code.jpeg',
    '../img/physics.gif',
    '../img/mathematics.jpg',
    '../img/programming.jpg',
    '../img/writing-spanish.jpg'
];

// install static assets
function installStaticFiles() {
    
    return caches.open(CACHE)
        .then(cache => {
    
          // cache desirable files
          cache.addAll(installFilesDesirable);
    
          // cache essential files
          return cache.addAll(installFilesEssential);
    
        });
    
}

// application installation
self.addEventListener('install', event => {
    
    console.log('service worker: install');
    
    // cache core files
    event.waitUntil(
        installStaticFiles()
        .then(() => self.skipWaiting())
    );
    
});

// clear old caches
function clearOldCaches() {
    
      return caches.keys()
        .then(keylist => {
    
          return Promise.all(
            keylist
              .filter(key => key !== CACHE)
              .map(key => caches.delete(key))
          );
    
        });
    
}
    
// application activated
self.addEventListener('activate', event => {
    
    console.log('service worker: activate');
    
        // delete old caches
      event.waitUntil(
        clearOldCaches()
        .then(() => self.clients.claim())
        );
    
});
  
// Intercepting the requests:
    self.addEventListener('fetch', event => {
        // abandon non-GET requests
        if (event.request.method !== 'GET') return;

        let url = event.request.url;

        event.respondWith(
            
            caches.open(CACHE)
               .then(cache => {
            
                    return cache.match(event.request)
                      .then(response => {
            
                        if (response) {
                          // return cached file
                          console.log('cache fetch: ' + url);
                          return response;
                        }
            
                        // make network request
                        return fetch(event.request)
                          .then(newreq => {
            
                            console.log('network fetch: ' + url);
                            if (newreq.ok) cache.put(event.request, newreq.clone());
                            return newreq;
            
                          })
                          // app is offline
                          .catch(() => offlineAsset(url));
            
                      });
            
                  })
            
              );
            
            });

// is image URL?
let iExt = ['png', 'jpg', 'jpeg', 'gif', 'webp', 'bmp'].map(f => '.' + f);
function isImage(url) {

  return iExt.reduce((ret, ext) => ret || url.endsWith(ext), false);

}


// return offline asset
function offlineAsset(url) {

  if (isImage(url)) {

    // return image
    return new Response(
      '<svg role="img" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg"><title>offline</title><path d="M0 0h400v300H0z" fill="#eee" /><text x="200" y="150" text-anchor="middle" dominant-baseline="middle" font-family="sans-serif" font-size="50" fill="#ccc">offline</text></svg>',
      { headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'no-store'
      }}
    );

  }
  else {

    // return page
    return
     caches.match(offlineURL);

  }

}