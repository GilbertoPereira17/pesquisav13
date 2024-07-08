const cacheName = 'site-static-v13';
const assets = [
    '/',
    '/pesquisav13/index.html',
    '/pesquisav13/style.css',
    '/pesquisav13/script.js',
    '/pesquisav13/manifest.json',
    '/pesquisav13/images/icon-192x192.png',
    '/pesquisav13/images/icon-512x512.png',
    // Adicione outros recursos necessários
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(cacheName).then(cache => {
            console.log('Caching shell assets');
            return cache.addAll(assets);
        })
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys.filter(key => key !== cacheName).map(key => caches.delete(key))
            );
        })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(cacheRes => {
            return cacheRes || fetch(event.request).then(fetchRes => {
                return caches.open(cacheName).then(cache => {
                    cache.put(event.request, fetchRes.clone());
                    return fetchRes;
                });
            });
        })
    );
});
