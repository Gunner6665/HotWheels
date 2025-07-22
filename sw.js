const CACHE_NAME = 'hotwheels-cache-v1';
const urlsToCache = [
  '/',
  '/HotWheels/index.html',
  '/HotWheels/style.css',
  '/HotWheels/app.js',
  '/HotWheels/manifest.json',
  '/HotWheels/icon-192.png',
  '/HotWheels/icon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
  console.log('✅ SW instalado y archivos cacheados');
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});


self.addEventListener('install', e => {
  console.log('✅ SW instalado');
});

self.addEventListener('fetch', e => {
  // Este SW no hace caché aún, pero asegura que se instale como PWA
});

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
            .then(reg => console.log('✅ Service Worker registrado:', reg.scope))
            .catch(err => console.error('❌ Error al registrar el Service Worker:', err));
    });
}
