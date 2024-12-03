const CACHE_NAME = "pwa-cache-v666";
const urlsToCache = [
    "/",
    "/ressources/css/styles.css",
    "/src/js/dbFunctions.js",
    "/ressources/img/logo.jpg",
];

// Installation du service worker
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log("Service Worker: Cache ouvert");
                return cache.addAll(urlsToCache);
            })
            .catch((error) => {
                console.error("Erreur lors de l'ajout au cache :", error);
            })
    );
});

// Activation du service worker
self.addEventListener("activate", (event) => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (!cacheWhitelist.includes(cache)) {
                        console.log("Ancien cache supprimé:", cache);
                        return caches.delete(cache);
                    }
                })
            );
        }).then(() => {
            console.log("Service Worker activé et prêt.");
        })
    );
});

// Interception des requêtes pour gérer le cache
self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                return response || fetch(event.request).then((fetchResponse) => {
                    return caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, fetchResponse.clone());
                        return fetchResponse;
                    });
                });
            })
    );
});

// Écouter les messages pour activer la mise à jour manuelle
self.addEventListener("message", (event) => {
    if (event.data && event.data.action === "skipWaiting") {
        self.skipWaiting(); // Forcer l'activation du service worker
        console.log("Service Worker activé manuellement.");
    }
});
