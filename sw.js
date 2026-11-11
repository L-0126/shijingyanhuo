const CACHE_PREFIX = "city-book-v10-2-";
const CACHE = CACHE_PREFIX + "92eb43d567e2";
const FILES = ["index.html", "audio.js", "assets/favicon.svg", "assets/fonts/OFL.txt", "assets/fonts/wenkai.woff", "assets/paper.svg", "assets/photos/guangzhou-rolls.jpg", "assets/photos/guangzhou-siumai.jpg", "assets/photos/wuhan-breakfast.jpg", "assets/photos/wuhan-noodles.jpg", "css/book-only.css", "css/book.css", "css/site.css", "css/spread-five.css", "css/spread-four.css", "css/spread-one.css", "css/spread-three.css", "css/spread-two.css", "js/app.js", "js/art/s1.js", "js/art/s2.js", "js/art/s3.js", "js/art/s4.js", "js/art/s5.js", "js/book-only.js", "js/camera.js", "js/config.js", "js/content.js", "js/core/art.js", "js/core/book.js", "js/core/turn.js", "js/core/util.js", "js/illustrations.js", "js/shell.js", "js/spreads/s1.js", "js/spreads/s2.js", "js/spreads/s3.js", "js/spreads/s4.js", "js/spreads/s5.js", "js/story-props.js", "js/story.js", "js/tour.js", "js/ui/ui.js"];
self.addEventListener('install', event => {
    event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(FILES))
        .then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
    event.waitUntil(caches.keys().then(keys => Promise.all(keys
        .filter(key => key.startsWith(CACHE_PREFIX) && key !== CACHE)
        .map(key => caches.delete(key)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
    const url = new URL(event.request.url);
    if(event.request.method !== 'GET' || !url.href.startsWith(self.registration.scope)) return;
    event.respondWith(caches.open(CACHE).then(async cache => {
        const saved = await cache.match(event.request, {ignoreSearch: true});
        return saved || fetch(event.request);
    }));
});
