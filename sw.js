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
