import useSWR from 'swr'
import axios from 'axios'
import CardEntrega from '../../components/CardEntrega'
import ModalEntrega from '../../components/ModalEntrega'
import { useState } from 'react'

const fetcher = (url: string) => axios.get(url).then(r => r.data)

export default function Entregas(){
  const { data: deliveries, mutate } = useSWR('/api/deliveries', fetcher)
  const [openId, setOpenId] = useState<string | null>(null)
  const delivery = deliveries?.find((d:any)=>d.id===openId) || null
  const toast = useToast()

  async function handleSave(data: any){
    if(!delivery) return
    try{
      const res = await axios.put(`/api/deliveries/${delivery.id}`, data)
      toast.push('Alterações salvas', 'success')
      setOpenId(null)
      // refresh data: revalidate SW or full reload for simplicity
      window.location.reload()
    }catch(e:any){
      toast.push('Falha ao salvar', 'error')
    }
  }

  return (
    <div>
      <h1 className="text-xl font-semibold mb-4">Entregas</h1>

      <div className="flex gap-2 items-center mb-4 flex-wrap">
        <button className="btn">Nova entrega</button>
        <button className="btn" style={{background:'#0EA5E9'}}>Importar CSV</button>
        <input placeholder="Buscar cliente/endereço" className="input" />
      </div>

      <div className="grid gap-3">
        {deliveries?.map((d:any)=> (
          <CardEntrega key={d.id} id={d.id} clientName={d.clientName} address={d.address} eta={d.eta} status={d.status} driver={d.assignedTo?.name} onOpen={setOpenId} />
        ))}
      </div>

      <ModalEntrega open={!!openId} onClose={()=>setOpenId(null)} delivery={delivery} onSave={handleSave} />
    </div>
  )
}
