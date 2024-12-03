const CACHE_NAME = "pwa-cache-v666";
const urlsToCache = [
    "/",
    "/ressources/css/styles.css",
    "/src/js/dbFunctions.js",
    "/ressources/img/logo.jpg",
];

self.addEventListener("install", (event) => {
    console.log("Service Worker: Installation...");
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log("Service Worker: Cache ouvert.");
                return cache.addAll(urlsToCache);
            })
            .catch((error) => console.error("Erreur lors de l'ajout au cache :", error))
    );
});

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
});

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

// Notifier la page d'une mise à jour disponible
self.addEventListener("message", (event) => {
    if (event.data && event.data.action === "skipWaiting") {
        console.log("Service Worker: Activation forcée...");
        self.skipWaiting();
    }
});

self.addEventListener("updatefound", () => {
    const newWorker = self.installing;
    newWorker.onstatechange = () => {
        if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
            console.log("Nouveau Service Worker prêt à être utilisé.");
            self.clients.matchAll({ includeUncontrolled: true }).then((clients) => {
                clients.forEach((client) => {
                    client.postMessage({ action: "newVersionAvailable" });
                });
            });
        }
    };
});
