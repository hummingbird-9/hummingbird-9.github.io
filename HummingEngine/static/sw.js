// Scramjet STATIC — Service Worker
// Engine: Scramjet v1.1.0 (MercuryWorkshop)
// Transport: libcurl over wss://anura.pro/wisp/

importScripts('./scramjet-engine/scramjet-all.js')

const { ScramjetServiceWorker } = $scramjetLoadWorker()
const scramjet = new ScramjetServiceWorker()

self.addEventListener('install', () => {
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim())
})

let configPromise
async function handleRequest(event) {
  if (!configPromise) {
    configPromise = scramjet.loadConfig().catch(error => {
      configPromise = undefined
      throw error
    })
  }
  await configPromise
  if (!scramjet.route(event)) return fetch(event.request)
  return scramjet.fetch(event)
}

self.addEventListener('fetch', (event) => {
  if (new URL(event.request.url).origin !== self.location.origin || !new URL(event.request.url).pathname.startsWith(new URL(self.registration.scope).pathname)) return
  event.respondWith(handleRequest(event))
})
