const CACHE_NAME = "pwa-cache-v1";
const urlsToCache = [
    "/",
    "/ressources/css/styles.css",
    "src/js/dbFunctions.js",
    "ressources/img//logo.jpg",
];

// Installation du service worker
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(urlsToCache))
            .then(() => self.skipWaiting()) // Retirer skipWaiting si vous ne voulez pas une activation immédiate
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        self.clients.claim()  // Assurez-vous de ne pas appeler self.clients.claim() immédiatement
    );
});



// Interception des requêtes
self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request);
        })
    );
});
