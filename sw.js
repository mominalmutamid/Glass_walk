const V='graphify-v12';
const CORE=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png','maskable-512.png'];
const MATH='https://cdnjs.cloudflare.com/ajax/libs/mathjs/12.4.2/math.min.js';
const FONTS='https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Newsreader:ital,wght@1,400&display=swap';
self.addEventListener('install',e=>{e.waitUntil((async()=>{
const c=await caches.open(V);await c.addAll(CORE);
try{await c.add(MATH)}catch(_){}
try{const r=await fetch(FONTS);await c.put(FONTS,r.clone());const css=await r.text();
const us=[...new Set([...css.matchAll(/url\((https:[^)]+)\)/g)].map(m=>m[1]))];await Promise.all(us.map(u=>c.add(u).catch(()=>{})))}catch(_){}
self.skipWaiting()})())});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;
e.respondWith(caches.match(r.url).then(hit=>{
const net=fetch(r).then(res=>{if(res&&(res.ok||res.type==='opaque')){const cp=res.clone();caches.open(V).then(c=>c.put(r,cp)).catch(()=>{})}return res})
.catch(()=>hit||(r.mode==='navigate'?caches.match('index.html'):Response.error()));
return hit||net}))});
