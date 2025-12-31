import React, { useState } from 'react'
import axios from 'axios'
import { openDB } from 'idb'

export default function DeliveryDetail({ delivery }: any){
  const [file, setFile] = useState<File | null>(null)
  const [status, setStatus] = useState('')

  async function handleUpload(){
    if(!delivery || !file) return
    const form = new FormData()
    form.append('file', file)

    try{
      setStatus('uploading')
      await axios.post(`/api/deliveries/${delivery.id}/proof`, form, { headers: { 'Content-Type': 'multipart/form-data' } })
      setStatus('done')
    }catch(e){
      // offline: save to IDB
      const db = await openDB('entrega-db', 1)
      await db.put('pending', { type: 'proof', deliveryId: delivery.id, filename: file.name, file: await file.arrayBuffer(), mime: file.type })
      setStatus('saved-offline')
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h3>{delivery.clientName}</h3>
      <p>{delivery.address}</p>
      <input type="file" onChange={(e:any)=>setFile(e.target.files[0])} />
      <button onClick={handleUpload}>Enviar prova</button>
      <div>Status: {status}</div>
    </div>
  )
}
