import useSWR from 'swr'
import axios from 'axios'
import Link from 'next/link'

const fetcher = (url: string) => axios.get(url).then(r => r.data)

import { useEffect } from 'react'
import { initSocket } from '../../src/lib/socket'

export default function DeliveriesPage(){
  const { data: deliveries, mutate } = useSWR('/api/deliveries', fetcher)

  useEffect(()=>{
    const s = initSocket()
    s.on('deliveryAssigned', (payload: any) => mutate())
    s.on('statusUpdated', (payload: any) => mutate())
    return ()=>{ s.off('deliveryAssigned'); s.off('statusUpdated') }
  }, [mutate])

  async function assign(deliveryId: string){
    const driverId = prompt('Driver ID to assign')
    if(!driverId) return
    await axios.post(`/api/deliveries/${deliveryId}/assign`, { driverId })
    mutate()
  }

  return (
    <main style={{ padding: 20 }}>
      <h2>Entregas</h2>
      <ul>
        {deliveries?.map((d: any) => (
          <li key={d.id}>
            <strong>{d.clientName}</strong> — {d.address} — <em>{d.status}</em>
            <button style={{ marginLeft: 10 }} onClick={() => assign(d.id)}>Atribuir</button>
            <Link href={`/deliveries/${d.id}`}><button style={{ marginLeft: 10 }}>Detalhes</button></Link>
          </li>
        ))}
      </ul>
    </main>
  )
}
