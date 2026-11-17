importScripts('v2-controller/controller.sw.js');
const proxyPrefix=new URL('p/',self.registration.scope).pathname;
self.addEventListener('fetch',event=>{
  const url=new URL(event.request.url);
  if(url.origin!==self.location.origin||!url.pathname.startsWith(proxyPrefix))return;
  if($scramjetController.shouldRoute(event)){
    event.respondWith($scramjetController.route(event));
    return;
  }
  if(event.request.mode==='navigate')event.respondWith(new Response('<!doctype html><html><head><meta charset="utf-8"><title>Scramjet 2 connection lost</title></head><body style="font:16px sans-serif;padding:24px"><h2>Scramjet 2 needs to reconnect</h2><p>The proxy controller is no longer connected to its service worker. Return to HummingProxy and reload the page. If it keeps happening, clear HummingProxy site data and retry.</p></body></html>',{status:503,headers:{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store'}}));
});
self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',event=>event.waitUntil(self.clients.claim()));
