import React from 'react'

type Props = {
  id: string
  clientName: string
  address: string
  eta?: string
  status?: string
  driver?: string
  onOpen?: (id: string)=>void
}

export default function CardEntrega({ id, clientName, address, eta, status, driver, onOpen }: Props){
  return (
    <article className="card" role="article" aria-labelledby={`entrega-${id}`} tabIndex={0}>
      <div className="flex justify-between items-start">
        <h3 id={`entrega-${id}`} className="text-sm font-semibold">#{id} — {clientName}</h3>
        <span className="text-xs px-2 py-1 rounded-md bg-gray-100">{status}</span>
      </div>
      <p className="text-sm text-gray-600">{address} · {eta}</p>
      <p className="text-sm text-gray-600">Motorista: {driver || '—'}</p>
      <div className="mt-3 flex gap-2">
        <button className="btn" onClick={()=>onOpen?.(id)}>Ver detalhes</button>
        <button className="btn" style={{background:'#0EA5E9'}}>Atribuir</button>
        <button className="btn" style={{background:'#16A34A'}}>Entregue</button>
      </div>
    </article>
  )
}
