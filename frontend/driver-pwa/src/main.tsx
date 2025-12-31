import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { io } from 'socket.io-client'

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

// register service worker
if('serviceWorker' in navigator){
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then(reg => {
      console.log('SW registered', reg)
    }).catch(err => console.warn('SW reg failed', err))
  })
}

// attach socket to window for debugging
;(async ()=>{
  const socket = io('http://localhost:4000')
  (window as any).__DRIVER_SOCKET = socket
})()
