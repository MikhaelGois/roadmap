import axios from 'axios'
import { useRouter } from 'next/router'
import useSWR from 'swr'

const fetcher = (url: string) => axios.get(url).then(r => r.data)

import { useEffect } from 'react'
import { initSocket } from '../../src/lib/socket'

export default function DeliveryDetail(){
  const { query } = useRouter()
  const id = Array.isArray(query.id) ? query.id[0] : query.id
  const { data: delivery, mutate } = useSWR(id ? `/api/deliveries/${id}` : null, fetcher)

  useEffect(()=>{
    const s = initSocket()
    s.on('statusUpdated', (payload: any) => { if(payload.id === id) mutate() })
    return ()=>{ s.off('statusUpdated') }
  }, [id, mutate])

  async function markDelivered(){
    await axios.post(`/api/deliveries/${id}/status`, { status: 'DELIVERED' })
    mutate()
  }

  return (
    <main style={{ padding: 20 }}>
      <h2>Detalhes</h2>
      {delivery && (
        <div>
          <p><strong>Cliente:</strong> {delivery.clientName}</p>
          <p><strong>Endereço:</strong> {delivery.address}</p>
          <p><strong>Status:</strong> {delivery.status}</p>
          <p><strong>Motorista:</strong> {delivery.assignedTo?.name || '—'}</p>
          {delivery.lat && delivery.lng && (
            <p><a target="_blank" href={`https://www.google.com/maps/dir/?api=1&destination=${delivery.lat},${delivery.lng}`}>Abrir no mapa</a></p>
          )}
          {delivery.proofUrl && <img src={delivery.proofUrl} alt="proof" style={{ maxWidth: 400 }} />}
        </div>
      )}
      <button onClick={markDelivered}>Marcar como entregue</button>
    </main>
  )
}
