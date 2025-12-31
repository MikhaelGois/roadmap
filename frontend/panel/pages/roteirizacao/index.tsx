import React, { useState, useEffect } from 'react'
import useSWR from 'swr'
import axios from 'axios'
import MapboxMap from '../../components/MapboxMap'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import { useToast } from '../../components/ToastContext'

const fetcher = (url: string) => axios.get(url).then(r => r.data)

export default function Roteirizacao(){
  const [driver, setDriver] = useState('Ana - Moto')
  const { data: deliveries } = useSWR('/api/deliveries', fetcher)
  const [selected, setSelected] = useState<string[]>([])
  const [route, setRoute] = useState<any>(null)
  const [orderedList, setOrderedList] = useState<any[]>([])
  const { data: drivers } = useSWR('/api/drivers', fetcher)
  const [selectedDriver, setSelectedDriver] = useState('')
  const toast = useToast()

  async function assignToDriver(){
    if(!selectedDriver || orderedList.length === 0){ toast.push('Escolha motorista e gere rota', 'error'); return }
    try{
      const res = await axios.post('/api/routes/assign', { driverId: selectedDriver, ordered: orderedList.map(o=>o.id), distance: route.distance, duration: route.duration, geometry: route.geometry })
      const routeId = res.data?.route?.id
      // push toast with Undo action
      toast.push('Rota atribuída ao motorista', 'success', { actionLabel: 'Desfazer', onAction: async ()=>{
        if(!routeId) return
        try{
          await axios.post(`/api/routes/${routeId}/cancel`)
          toast.push('Atribuição desfeita', 'info')
        }catch(e:any){
          toast.push('Falha ao desfazer atribuição', 'error')
        }
      }, ttl: 9000 })

      // small animation effect by toggling a class (pulse) on the button
      const btn = document.querySelector('button.btn[disabled]') as HTMLElement | null
      if(btn){ btn.classList.add('animate-pulse'); setTimeout(()=>btn.classList.remove('animate-pulse'), 900) }
      // refresh deliveries list
      setTimeout(()=> window.location.reload(), 700)
    }catch(e:any){
      toast.push('Falha ao atribuir rota', 'error')
    }
  }
  useEffect(()=>{
    if(!deliveries) return
    // pre-select 'Nova' deliveries by default
    const pre = deliveries.filter((d:any)=>d.status === 'PENDING').map((d:any)=>d.id)
    setSelected(pre)
  }, [deliveries])

  useEffect(()=>{
    // when route is set, set orderedList from route.ordered
    if(route && route.ordered) setOrderedList(route.ordered)
  }, [route])

  function toggle(id:string){
    setSelected(s => s.includes(id) ? s.filter(x=>x!==id) : [...s, id])
  }

  // drag and drop handlers
  function reorder(list:any[], startIndex:number, endIndex:number){
    const result = Array.from(list)
    const [removed] = result.splice(startIndex, 1)
    result.splice(endIndex, 0, removed)
    return result
  }

  function onDragEnd(result:any){
    if(!result.destination) return
    const newList = reorder(orderedList, result.source.index, result.destination.index)
    setOrderedList(newList)
  }
  async function generate(){
    if(!selected.length){ toast.push('Selecione entregas', 'error'); return }
    // build waypoints from selected deliveries
    const points = deliveries.filter((d:any)=>selected.includes(d.id) && d.lat && d.lng).map((d:any)=>({ id: d.id, lat: d.lat, lng: d.lng }))
    if(points.length === 0){ toast.push('As entregas precisam ter lat/lng', 'error'); return }
    const origin = { lat: -23.55052, lng: -46.633308 } // default depot; replace with config
    try{
      const res = await axios.post('/api/routes/optimize', { origin, waypoints: points })
      setRoute(res.data)
      toast.push('Rota gerada com sucesso', 'success')
    }catch(e:any){
      // persistent error toast so operator can inspect & dismiss
      toast.push('Falha ao gerar rota. Verifique token/limites.', 'error', { ttl: 0 })
    }
  }

  return (
    <div>
      <h1 className="text-xl font-semibold mb-4">Roteirização</h1>
      <div className="card mb-4">
        <label className="block">Veículo / Motorista
          <select className="input mt-2" value={driver} onChange={e=>setDriver(e.target.value)}>
            <option>Ana - Moto</option>
            <option>Carlos - Carro</option>
          </select>
        </label>
        <label className="block mt-3">Ponto de partida
          <input className="input mt-2" defaultValue="Depósito - R. Central, 100" />
        </label>
        <div className="mt-3">
          <label className="inline-flex items-center gap-2"><input type="checkbox" onChange={(e)=>{ if(e.target.checked && deliveries) setSelected(deliveries.map((d:any)=>d.id)); else setSelected([]) }} /> Selecionar todas</label>
          <label className="inline-flex items-center gap-2 ml-4"><input type="checkbox" onChange={(e)=>{ if(e.target.checked && deliveries) setSelected(deliveries.filter((d:any)=>d.status==='PENDING').map((d:any)=>d.id)); }} /> Apenas “Nova”</label>
        </div>
        <div className="mt-3">
          <button className="btn" onClick={generate}>Gerar rota otimizada</button>
        </div>
      </div>

      <div className="card">
        <div className="mb-3">
          <strong>Resultado</strong>
        </div>
        <div className="mb-2">
          {route ? (
            <div>
              <MapboxMap geometry={route.geometry} markers={[{ id: 'origin', lat:-23.55052, lng:-46.633308, label: 'Depósito' }, ...(orderedList||[]).map((o:any,i:number)=>({ id: o.id, lat: o.location.lat, lng: o.location.lng, label: `${i+1}. ${o.id}`}))]} accessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN} />
              <div className="mt-3">
                <div className="flex items-center gap-3 mb-3">
                  <select className="input" aria-label="Selecionar motorista" onChange={(e)=>setSelectedDriver(e.target.value)} value={selectedDriver}>
                    <option value="">Escolher motorista</option>
                    {drivers?.map((dr:any)=> <option key={dr.id} value={dr.id}>{dr.name}</option>)}
                  </select>
                  <button className="btn" onClick={assignToDriver} disabled={!selectedDriver}>Atribuir rota ao motorista</button>
                </div>

                <div>
                  <strong>Ordenar (arraste para reordenar):</strong>
                  {/* Drag & Drop */}
                  <div className="mt-2">
                    <DragDropContext onDragEnd={onDragEnd}>
                      <Droppable droppableId="route-list">
                        {(provided)=>(
                          <ol ref={provided.innerRef} {...provided.droppableProps} className="list-decimal ml-5">
                            {orderedList.map((o:any,i:number)=> (
                              <Draggable key={o.id} draggableId={o.id} index={i}>
                                {(p)=>(
                                  <li ref={p.innerRef} {...p.draggableProps} {...p.dragHandleProps} className="mb-2">{i+1}) {o.name || `${o.location.lat.toFixed(5)}, ${o.location.lng.toFixed(5)}`}</li>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </ol>
                        )}
                      </Droppable>
                    </DragDropContext>
                  </div>
                </div>

                <p className="mt-3">Distância: {(route.distance/1000).toFixed(2)} km — Duração: {(route.duration/60).toFixed(0)} min</p>
              </div>
            </div>
          ) : (
            <div>Mapa (placeholder) — selecione entregas e gere rota</div>
          )}
        </div>
      </div>

      <div className="mt-4">
        <h3 className="text-md font-semibold">Entregas</h3>
        <div className="grid gap-3 mt-3">
          {deliveries?.map((d:any)=> (
            <div key={d.id} className="card flex items-center justify-between">
              <div>
                <div className="text-sm font-medium">{d.clientName}</div>
                <div className="text-sm text-gray-600">{d.address}</div>
              </div>
              <div className="flex items-center gap-2">
                <label className="inline-flex items-center gap-2"><input type="checkbox" checked={selected.includes(d.id)} onChange={()=>toggle(d.id)} /> Selecionar</label>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
