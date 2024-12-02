const CACHE_NAME = "pwa-cache-v1";
const urlsToCache = [
    "/",
    "/ressources/css/styles.css",
    "src/js/dbFunctions.js",
    "ressources/img//logo.jpg",
];

// Installation du service worker
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(urlsToCache).catch((error) => {
                console.error("Échec lors de l'ajout au cache :", error);
            });
        })
    );
});

// Activation et nettoyage du cache
self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        return caches.delete(cache);
                    }
                })
            );
        })
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
