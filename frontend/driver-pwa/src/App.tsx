import React, { useEffect, useState } from 'react'
import Deliveries from './pages/Deliveries'
import { syncPending } from './sync'
import { io } from 'socket.io-client'
import { openDB } from 'idb'

export default function App(){
  const [driverId, setDriverId] = useState<string | null>(localStorage.getItem('driverId'))

  useEffect(()=>{
    // Try to sync pending proofs on boot and when online
    syncPending()
    window.addEventListener('online', () => { syncPending() })
  }, [])

  useEffect(()=>{
    if(!driverId){
      const id = prompt('Digite seu driverId (ex: driver id) para receber rotas')
      if(id){ setDriverId(id); localStorage.setItem('driverId', id) }
    }
  }, [driverId])

  useEffect(()=>{
    if(!driverId) return
    const socket = io('http://localhost:4000')
    socket.emit('joinDriver', driverId)

    socket.on('assignedRoute', async (payload:any) => {
      const db = await openDB('entrega-db', 1, { upgrade(db){ if(!db.objectStoreNames.contains('routes')) db.createObjectStore('routes') } })
      await db.put('routes', payload, payload.routeId)
      alert('Nova rota atribuída! Verifique suas entregas.')
    })

    return ()=>{ socket.disconnect() }
  }, [driverId])

  return (
    <div>
      <h1>Driver PWA</h1>
      <Deliveries />
    </div>
  )
}
