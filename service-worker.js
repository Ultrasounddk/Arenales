/* Change VERSION whenever any app file changes. Keep this filename for old installs. */
const VERSION='2026.10.05.1';
const PREFIX='ipc-rent-shell-';
const CACHE=PREFIX+VERSION;
const FILES=['./','./index.html','./styles.css','./app.mjs','./core.mjs','./manifest.webmanifest','./official-snapshot.json','./icon-192.png','./icon-512.png','./apple-touch-icon.png'];
self.addEventListener('install',event=>event.waitUntil((async()=>{const c=await caches.open(CACHE);await c.addAll(FILES.map(f=>new Request(f,{cache:'reload'})));await self.skipWaiting()})()));
self.addEventListener('activate',event=>event.waitUntil((async()=>{for(const key of await caches.keys()){if(key!==CACHE&&key.startsWith(PREFIX))await caches.delete(key)}await self.clients.claim()})()));
self.addEventListener('fetch',event=>{const u=new URL(event.request.url);if(event.request.method!=='GET'||u.origin!==self.location.origin||!u.href.startsWith(self.registration.scope))return;
// Never put API responses in the shell cache. A version uses one coherent app shell.
if(FILES.some(f=>new URL(f,self.registration.scope).pathname===u.pathname))event.respondWith((async()=>{const c=await caches.open(CACHE);const hit=await c.match(u.pathname);return hit||fetch(event.request)})());
});
