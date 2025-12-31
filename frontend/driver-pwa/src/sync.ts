import { openDB } from 'idb'
import axios from 'axios'

export async function syncPending(){
  const db = await openDB('entrega-db', 1)
  const all = await db.getAll('pending')
  for(const item of all){
    try{
      if(item.type === 'proof'){
        const blob = new Blob([item.file], { type: item.mime })
        const file = new File([blob], item.filename, { type: item.mime })
        const form = new FormData()
        form.append('file', file)
        await axios.post(`/api/deliveries/${item.deliveryId}/proof`, form, { headers: { 'Content-Type': 'multipart/form-data' } })
        await db.delete('pending', item.id)
      }
    }catch(e){
      console.warn('sync failed for item', item, e)
    }
  }
}
