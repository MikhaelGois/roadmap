self.addEventListener('install', (event: any) => {
  self.skipWaiting()
})

self.addEventListener('activate', (event: any) => {
  event.waitUntil((async () => {
    // cleanup
  })())
})

// Basic fetch handler: try network then cache
self.addEventListener('fetch', (event: any) => {
  // noop: Workbox recommended for production
})

self.addEventListener('sync', (event: any) => {
  if(event.tag === 'sync-proofs'){
    event.waitUntil((async ()=>{
      // TODO: open IDB and upload pending proofs
    })())
  }
})