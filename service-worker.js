const CACHE_NAME = "zy-app-cache-v1";
const ASSETS = [
  "./",
  "./index.html",
  "./zyjcll.html",
  "./manifest.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/apple-touch-icon.png",
  "./maps/zyjcll/00-绪论.html",
  "./maps/zyjcll/01-第一章-中医学的哲学基础.html",
  "./maps/zyjcll/01b-第二章-中医学的主要思维方式.html",
  "./maps/zyjcll/02-第三章-藏象.html",
  "./maps/zyjcll/03-第四章-精气血津液神.html",
  "./maps/zyjcll/04-第五章-经络.html",
  "./maps/zyjcll/05-第六章-体质.html",
  "./maps/zyjcll/06-第七章-病因.html",
  "./maps/zyjcll/07-第八章-病机.html",
  "./maps/zyjcll/08-第九章-养生与防治原则.html"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request)
        .then((response) => {
          if (response.ok && event.request.method === "GET") {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => cached);
    })
  );
});
