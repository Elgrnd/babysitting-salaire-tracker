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

self.addEventListener('message', (event) => {
    if (event.data.action === 'skipWaiting') {
        self.skipWaiting(); // Passer immédiatement à la nouvelle version
    }
});

// Ajouter une logique pour forcer le rechargement des clients après l'activation
self.addEventListener('activate', (event) => {
    event.waitUntil(
        clients.claim().then(() => {
            clients.matchAll().then((clients) => {
                clients.forEach((client) => client.navigate(client.url)); // Recharger toutes les pages ouvertes
            });
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
