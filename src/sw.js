//https://blog.bitsrc.io/build-progressive-web-apps-with-react-part-1-63f1fbc564a6
//https://pwa-workshop.js.org/4-api-cache/#implementation

console.log('Hello World I am a custom service worker!');
const APIurl = 'https://jsonplaceholder.typicode.com/posts';
const runtimeCacheName = 'cached-json';

self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

workbox.core.clientsClaim();

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});

workbox.routing.registerNavigationRoute(
  workbox.precaching.getCacheKeyForURL('/index.html'),
  {
    blacklist: [/^\/_/, /\/[^/?]+\.[^/]+$/],
  }
);

self.addEventListener('install', event => {
  console.log('install');
});

self.addEventListener('activate', event => {
  console.log('activate');
  /* console.log('Claiming control');
  return self.clients.claim(); */
});

self.addEventListener('fetch', event => {
  console.log(`fetching ${event.request.url} request in service worker...`);

  if (event.request.url === APIurl) {
    event.respondWith(
      (async function() {
        let cache = await caches.open(runtimeCacheName);
        let cachedFiles = await cache.match(event.request);
        if (cachedFiles) {
          return cachedFiles;
        } else {
          try {
            let response = await fetch(event.request);
            await cache.put(event.request, response.clone());
            return response;
          } catch (e) {
            /* ... */
          }
        }
      })()
    );
  } else {
    // response to static files requests, Cache-First strategy
    event.respondWith(caches.match(event.request));
  }
});
