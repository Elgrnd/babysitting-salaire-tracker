const CACHE_NAME = "pwa-cache-v0.4"; // Changez ce numéro à chaque nouvelle version.
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
        }).then(() => {
            // Forcer la mise à jour du Service Worker
            self.clients.claim();
        })
    );
});


// Interception des requêtes pour gérer le cache
self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            // Vérifier si la requête est pour les données dynamiques
            if (event.request.url.includes("/babysittings")) {
                return fetch(event.request).then((fetchResponse) => {
                    // Mettre à jour le cache avec la nouvelle réponse après la suppression des babysittings
                    return caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, fetchResponse.clone());
                        return fetchResponse;
                    });
                });
            }

            // Sinon, gérer les autres requêtes (HTML, CSS, images)
            return cachedResponse || fetch(event.request).then((fetchResponse) => {
                return caches.open(CACHE_NAME).then((cache) => {
                    cache.put(event.request, fetchResponse.clone());
                    return fetchResponse;
                });
            });
        })
    );
});

