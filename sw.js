/**
 * 小辣椒 APP - Service Worker
 * 离线缓存策略：预缓存核心资源，运行时缓存动态资源
 */

const CACHE_NAME = 'pepper-v1.0.0';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.svg',
  './icon-512.svg'
];

// 安装事件：预缓存核心资源
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});

// 激活事件：清理旧缓存
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// 请求拦截：缓存优先策略
self.addEventListener('fetch', event => {
  // 只处理 GET 请求
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then(response => {
      if (response) {
        // 缓存命中，同时后台更新缓存
        fetchAndCache(event.request);
        return response;
      }
      // 缓存未命中，网络请求并缓存
      return fetchAndCache(event.request);
    }).catch(() => {
      // 离线且缓存未命中
      if (event.request.headers.get('accept').includes('text/html')) {
        return caches.match('./index.html');
      }
    })
  );
});

function fetchAndCache(request) {
  return fetch(request).then(response => {
    if (response && response.status === 200 && response.type === 'basic') {
      const responseClone = response.clone();
      caches.open(CACHE_NAME).then(cache => {
        cache.put(request, responseClone);
      });
    }
    return response;
  }).catch(() => caches.match(request));
}
