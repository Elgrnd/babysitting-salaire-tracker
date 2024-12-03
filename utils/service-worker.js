const CACHE_NAME = "pwa-cache-v2"; // Changez ce numéro à chaque nouvelle version.
const urlsToCache = [
    "/",
    "/ressources/css/styles.css",
    "/src/js/dbFunctions.js",
    "/ressources/img/logo.jpg",
];

// Installation du service worker
self.addEventListener("install", (event) => {
    console.log("Service Worker: Installation...");
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log("Service Worker: Cache ouvert.");
            return cache.addAll(urlsToCache);
        })
    );
    self.skipWaiting(); // Forcer l'activation immédiate
});

// Activation du service worker
self.addEventListener("activate", (event) => {
    console.log("Service Worker: Activation...");
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        console.log("Service Worker: Suppression de l'ancien cache:", cache);
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
    self.clients.claim(); // Forcer le contrôle immédiat de toutes les pages ouvertes
});

// Interception des requêtes pour gérer le cache
self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request).then((fetchResponse) => {
                return caches.open(CACHE_NAME).then((cache) => {
                    cache.put(event.request, fetchResponse.clone());
                    return fetchResponse;
                });
            });
        })
    );
});
