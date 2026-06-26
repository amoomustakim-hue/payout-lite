const CACHE_NAME = "payout-lite-shell-v1";
const APP_SHELL = ["/", "/dashboard", "/invoices", "/offline", "/manifest.json", "/icons/icon-192.png", "/icons/icon-512.png"];

function shouldBypass(request) {
  const url = new URL(request.url);
  return request.method !== "GET" || url.pathname.startsWith("/api/") || url.pathname.startsWith("/pay/");
}

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))),
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (shouldBypass(event.request)) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const copy = response.clone();
        if (response.ok && response.type === "basic") {
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        }
        return response;
      })
      .catch(async () => {
        const cached = await caches.match(event.request);
        return cached ?? caches.match("/offline") ?? new Response("Payout Lite is offline.", { status: 503 });
      }),
  );
});
