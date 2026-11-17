importScripts('scram/scramjet.all.js');
const {ScramjetServiceWorker}=$scramjetLoadWorker();
const scramjet=new ScramjetServiceWorker();
const servicePrefix=new URL('service/',self.registration.scope).pathname;
let configPromise;
self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',event=>event.waitUntil(self.clients.claim()));
self.addEventListener('fetch',event=>{
  const url=new URL(event.request.url);
  if(url.origin!==self.location.origin||!url.pathname.startsWith(servicePrefix))return;
  event.respondWith((async()=>{
    if(!configPromise)configPromise=scramjet.loadConfig().catch(error=>{configPromise=undefined;throw error;});
    await configPromise;
    return scramjet.route(event)?scramjet.fetch(event):fetch(event.request);
  })());
});
