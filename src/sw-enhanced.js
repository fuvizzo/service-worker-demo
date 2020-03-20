console.log('Hello World I am an enhanced custom service worker!');

const APIurl = 'https://jsonplaceholder.typicode.com/posts';
const RUNTIME_CACHE = 'runtime-cache';

var urlsToCache = [
  '/manifest.json',
  'favicon.ico',
  'logo192.png',
  'logo512.png',
];

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
  event.waitUntil(
    caches.open(RUNTIME_CACHE).then(cache => {
      console.log('Opened cache');
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('activate', event => {
  console.log('activate');
  /* console.log('Claiming control');
  return self.clients.claim(); */
});

self.addEventListener('fetch', event => {
  console.log(`fetching ${event.request.url} request in service worker...`);

  if (event.request.url === APIurl) {
    // response to API requests, Cache Update Refresh strategy
    event.respondWith(serve(event.request));
    event.waitUntil(update(event.request).then(refresh));
  } else {
    // response to static files requests, Cache-First strategy
    event.respondWith(caches.match(event.request));
  }
});

async function serve(request) {
  try {
    let cache = await caches.open(RUNTIME_CACHE);
    let cachedFiles = await cache.match(request);
    if (cachedFiles) {
      return cachedFiles;
    } else {
      return new Response('[]');
    }
  } catch (e) {
    console.log(e);
  }
}

async function update(request) {
  try {
    let cache = await caches.open(RUNTIME_CACHE);
    let cachedFiles = await cache.match(request);
    var response = await fetch(request);
    await cache.put(request, response.clone());
    return { response, cachedFiles };
  } catch (e) {
    console.log(e);
  }
}

function refresh({ response, cachedFiles }) {
  let cachedJsonData = null;

  const responsePromise = response.json().then(jsonData => {
    self.clients.matchAll().then(clients => {
      clients.forEach(client => {
        // report and send new data to client
        const doRefresh =
          !cachedJsonData ||
          JSON.stringify(jsonData) !== JSON.stringify(cachedJsonData);
        if (doRefresh)
          client.postMessage(
            JSON.stringify({
              type: response.url,
              data: jsonData,
            })
          );
      });
    });
  });

  if (!cachedFiles) return responsePromise;
  else
    return cachedFiles
      .json()
      .then(jsonData => {
        cachedJsonData = jsonData;
      })
      .then(responsePromise);
}
