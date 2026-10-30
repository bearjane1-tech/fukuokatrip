const VERSION='fukuoka-offline-v1';
const SHELL=['./','./index.html','./kinrinko.webp','./manifest.webmanifest',
'https://cdn.tailwindcss.com',
'https://cdn.jsdelivr.net/npm/vue@3.5.13/dist/vue.global.prod.js',
'https://unpkg.com/vue@3/dist/vue.global.prod.js',
'https://www.gstatic.com/firebasejs/10.12.5/firebase-app-compat.js',
'https://www.gstatic.com/firebasejs/10.12.5/firebase-auth-compat.js',
'https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore-compat.js'];
self.addEventListener('install',event=>{event.waitUntil((async()=>{const c=await caches.open(VERSION);await Promise.allSettled(SHELL.map(async url=>{const r=await fetch(url,{mode:url.startsWith('http')?'no-cors':'same-origin'});if(r.ok||r.type==='opaque')await c.put(url,r)}));await self.skipWaiting()})())});
self.addEventListener('activate',event=>{event.waitUntil((async()=>{for(const k of await caches.keys())if(k.startsWith('fukuoka-offline-')&&k!==VERSION)await caches.delete(k);await self.clients.claim()})())});
self.addEventListener('fetch',event=>{const req=event.request;if(req.method!=='GET')return;const u=new URL(req.url);const scope=new URL(self.registration.scope);if(u.origin===scope.origin&&u.pathname.startsWith(scope.pathname)){if(req.mode==='navigate'){event.respondWith((async()=>{try{const r=await fetch(req);if(r.ok){const c=await caches.open(VERSION);await c.put('./index.html',r.clone())}return r}catch(e){return (await caches.match('./index.html'))||(await caches.match('./'))||Response.error()}})());return}event.respondWith((async()=>{const cached=await caches.match(req);if(cached)return cached;try{const r=await fetch(req);if(r.ok){const c=await caches.open(VERSION);await c.put(req,r.clone())}return r}catch(e){return Response.error()}})());return}
if(['cdn.tailwindcss.com','cdn.jsdelivr.net','unpkg.com','www.gstatic.com'].includes(u.hostname)){event.respondWith((async()=>{const cached=await caches.match(req);if(cached)return cached;try{const r=await fetch(req,{mode:'no-cors'});const c=await caches.open(VERSION);await c.put(req,r.clone());return r}catch(e){return Response.error()}})());return}
if(req.destination==='image'&&u.protocol==='https:'){event.respondWith((async()=>{const cached=await caches.match(req);if(cached)return cached;try{const r=await fetch(req,{mode:'no-cors'});const c=await caches.open(VERSION);await c.put(req,r.clone());return r}catch(e){return Response.error()}})())}
});