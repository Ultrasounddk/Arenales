/* Keep this filename. Bump VERSION whenever the app shell changes. */
const VERSION='2026.10.05.4';
const PREFIX='ipc-rent-'+encodeURIComponent(new URL(self.registration.scope).pathname)+'-';
const CACHE=PREFIX+VERSION;
const FILES=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png','./apple-touch-icon.png'];
self.addEventListener('install',event=>event.waitUntil((async()=>{const c=await caches.open(CACHE);await c.addAll(FILES.map(f=>new Request(f,{cache:'reload'})));await self.skipWaiting()})()));
self.addEventListener('activate',event=>event.waitUntil((async()=>{for(const key of await caches.keys()){if(key!==CACHE&&key.startsWith(PREFIX))await caches.delete(key)}await self.clients.claim()})()));
self.addEventListener('fetch',event=>{const u=new URL(event.request.url);if(event.request.method!=='GET'||u.origin!==self.location.origin||!u.href.startsWith(self.registration.scope))return;
// Publication feed is network-first; never overwrite a good cached copy with an error.
if(u.pathname===new URL('./official-data.json',self.registration.scope).pathname){event.respondWith((async()=>{const c=await caches.open(CACHE);try{const r=await fetch(event.request,{cache:'no-store'});if(!r.ok)throw Error();const j=await r.clone().json();if(j.schema!==3||!Array.isArray(j.records))throw Error();await c.put(event.request,r.clone());return r}catch{return await c.match(event.request)||new Response('{}',{status:503,headers:{'Content-Type':'application/json'}})}})());return;}
if(FILES.some(f=>new URL(f,self.registration.scope).pathname===u.pathname))event.respondWith((async()=>{const c=await caches.open(CACHE);const hit=await c.match(u.pathname);return hit||fetch(event.request)})());
});
