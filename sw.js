
const CACHE_NAME = "hotwheels-cache-v1";
const FILES_TO_CACHE = [
  "/HotWheels/",
  "/HotWheels/index.html",
  "/HotWheels/style 3.css",
  "/HotWheels/app 4.js",
  "/HotWheels/manifest 1.json",
  "/HotWheels/icons/icon-192.png",
  "/HotWheels/icons/icon-512.png"
];

// Instalación del Service Worker y almacenamiento en caché
self.addEventListener("install", event => {
  console.log("🔧 Instalando Service Worker y cacheando recursos");
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activación del Service Worker
self.addEventListener("activate", event => {
  console.log("✅ Activando nuevo Service Worker");
  event.waitUntil(
    caches.keys().then(keyList =>
      Promise.all(
        keyList.map(key => {
          if (key !== CACHE_NAME) {
            console.log("🧹 Borrando caché antigua:", key);
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

// Interceptar peticiones y responder desde caché si es posible
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
