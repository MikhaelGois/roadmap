import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { openDB } from 'idb'

interface Delivery { id: string; clientName: string; address: string; status: string }

export default function Deliveries(){
  const [deliveries, setDeliveries] = useState<Delivery[]>([])
  const [routes, setRoutes] = useState<any[]>([])

  useEffect(()=>{
    const dbPromise = openDB('entrega-db', 1, { upgrade(db){ if(!db.objectStoreNames.contains('pending')) db.createObjectStore('pending'); if(!db.objectStoreNames.contains('routes')) db.createObjectStore('routes') } })

    async function load(){
      try{
        const res = await axios.get('/api/deliveries')
        setDeliveries(res.data)
      }catch(e){
        // offline: load from indexeddb
        const db = await dbPromise
        const all = await db.getAll('pending')
        setDeliveries(all)
      }

      // load assigned routes from IDB
      const db = await dbPromise
      const allRoutes = await db.getAll('routes')
      setRoutes(allRoutes)
    }

    load()
  }, [])

  return (
    <div style={{ padding: 20 }}>
      <h2>Minhas entregas</h2>

      <section style={{ marginBottom: 20 }}>
        <h3>Rotas atribuídas</h3>
        <ul>
          {routes.map(r => (
            <li key={r.routeId}>Rota {r.routeId} — {r.ordered?.length} entregas</li>
          ))}
          {routes.length === 0 && <li>Nenhuma rota atribuída</li>}
        </ul>
      </section>

      <ul>
        {deliveries.map(d => (
          <li key={d.id}>{d.clientName} — {d.address} — <em>{d.status}</em></li>
        ))}
      </ul>
    </div>
  )
}
