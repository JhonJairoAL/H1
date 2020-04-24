importScripts('js/sw-utils.js');
const STATIC_CACHE = 'static-03-2020';
const DYNAMIC_CACHE = 'dynamic-03-2020';
const INMUTABLE_CACHE = 'inmutable-03-2020';

const DYNAMIC_CACHE_LIMIT = 50;

const APP_SHELL = [
    //'/', //Para desarrollo
    '/index.html',
    '/css/index.css',
    '/js/app.js',
    'icons/ajustes.svg',
    'icons/buscar.svg',
    'icons/calendario.svg',
    'icons/clima.svg',
    'icons/general.svg',
    'icons/lugares.svg',
    'icons/perfil.svg',
    'icons/planes.svg',
    'img/kda.jpg',
    'img/plumas.jpg',
    'img/error.jpg',
    'pages/error.html'
];

const APP_SHELL_INMUTABLE = [
    'https://kit.fontawesome.com/3c16f4957b.js'
];

function limpiarCache(cacheName, numItems) {
    caches.open(cacheName)
        .then(cache => {
            return cache.keys()
                .then(keys => {
                    if (keys.length > numItems) {
                        cache.delete(keys[0])
                            .then(limpiarCache(cacheName, numItems));
                    }
                });
        });
}

self.addEventListener('install', e => {
    const cacheEstatico = caches.open(STATIC_CACHE).then(cache => cache.addAll(APP_SHELL));

    const cacheInmutable = caches.open(INMUTABLE_CACHE).then(cache => cache.addAll(APP_SHELL_INMUTABLE));

    e.waitUntil(Promise.all([cacheEstatico, cacheInmutable]));
});


self.addEventListener('activate', e => {
    const respuesta = caches.keys().then(keys => {
        keys.forEach(key => {
            if (key !== STATIC_CACHE && key.includes('static')) {
                return caches.delete(key);
            }
            if (key !== DYNAMIC_CACHE && key.includes('dynamic')) {
                return caches.delete(key);
            }
        });
    });

    e.waitUntil(respuesta);
});


/*
self.addEventListener('fetch', e => {
    // Cache with Network Fallback
    const respuesta = caches.match(e.request)
        .then(res => {
            if (res) return res;

            // Si no existe el archivo
            // IMPORTANTE: Clonar la respuesta. La respuesta es un stream
            return fetch(e.request).then(newRes => {
                caches.open(DYNAMIC_CACHE)
                    .then(cache => {
                        cache.put(e.request, newRes);
                        limpiarCache(DYNAMIC_CACHE, DYNAMIC_CACHE_LIMIT);
                    });

                return newRes.clone();
            })
                .catch(err => {
                    if (e.request.headers.get('accept').includes('text/html')) {
                        return caches.match('/pages/error.html');
                    }
                });
        });

    e.respondWith(respuesta);
});
*/
/*
self.addEventListener('fetch', e => {
    // Cache with Network Fallback
    const respuesta = caches.match(e.request)
        .then(res => {
            if (res) { return res; } else {
                return fetch(e.request).then(newRes => {
                    caches.open(DYNAMIC_CACHE)
                        .then(cache => {
                            cache.put(e.request, newRes);
                            limpiarCache(DYNAMIC_CACHE, DYNAMIC_CACHE_LIMIT);
                        });

                    return newRes.clone();
                })
                    .catch(err => {
                        if (e.request.headers.get('accept').includes('text/html')) {
                            return caches.match('/pages/error.html');
                        }
                    });
            }
        });

    e.respondWith(respuesta);
});
*/

self.addEventListener( 'fetch', e => {


    const respuesta = caches.match( e.request ).then( res => {

        if ( res ) {
            return res;
        } else {

            return fetch( e.request ).then( newRes => {

                return actualizaCacheDinamico( DYNAMIC_CACHE, e.request, newRes );

            });

        }

    });



    e.respondWith( respuesta );

});
