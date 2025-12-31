import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { useToast } from './ToastContext'
export default function ModalEntrega({ open, onClose, delivery, onSave }: any){
  const modalRef = useRef<HTMLDivElement | null>(null)
  const prevFocusRef = useRef<HTMLElement | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  const [form, setForm] = useState<any>({ status: delivery?.status || 'PENDING', assignedToId: delivery?.assignedToId || '' })
  const [availableDrivers, setAvailableDrivers] = useState<any[]>([])
  const [driversLoading, setDriversLoading] = useState(false)
  const [showCreate, setShowCreate] = useState(false)
  const [newDriver, setNewDriver] = useState({ name: '', phone: '', vehicle: '' })
  const [creating, setCreating] = useState(false)
  const toast = useToast()

  useEffect(()=>{ setForm({ status: delivery?.status || 'PENDING', assignedToId: delivery?.assignedToId || '' }) }, [delivery])

  useEffect(()=>{
    // fetch drivers when modal opens
    let mounted = true
    async function loadDrivers(){
      try{
        setDriversLoading(true)
        const res = await axios.get('/api/drivers')
        if(!mounted) return
        setAvailableDrivers(res.data || [])
      }catch(e){
        // ignore for now
      }finally{ if(mounted) setDriversLoading(false) }
    }
    if(open) loadDrivers()
    return ()=>{ mounted = false }
  }, [open])

  useEffect(()=>{
    if(!open) return
    // save previous focus
    prevFocusRef.current = document.activeElement as HTMLElement
    // focus first focusable
    const timer = setTimeout(()=>{
      const el = modalRef.current?.querySelector<HTMLElement>('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
      el?.focus()
    }, 10)

    function onKey(e: KeyboardEvent){
      if(e.key === 'Escape'){
        e.preventDefault(); onClose()
      }else if(e.key === 'Tab'){
        // trap focus
        const focusable = modalRef.current?.querySelectorAll<HTMLElement>('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
        if(!focusable || focusable.length === 0) return
        const first = focusable[0]
        const last = focusable[focusable.length -1]
        if(!e.shiftKey && document.activeElement === last){
          e.preventDefault(); first.focus()
        }
        if(e.shiftKey && document.activeElement === first){
          e.preventDefault(); last.focus()
        }
      }
    }

    document.addEventListener('keydown', onKey)
    return ()=>{
      clearTimeout(timer)
      document.removeEventListener('keydown', onKey)
      // restore focus
      prevFocusRef.current?.focus()
    }
  }, [open, onClose])

  if(!open) return null

  async function handleSave(){
    if(onSave){
      try{
        setIsSaving(true)
        await onSave(form)
      }finally{ setIsSaving(false) }
    }
  }

  return (
    <div role="dialog" aria-modal="true" aria-labelledby="modal-title" className="fixed inset-0 z-50 flex items-start justify-end">
      <div className="absolute inset-0 bg-black opacity-30" onClick={onClose} aria-hidden="true"></div>
      <div ref={modalRef} className={`bg-white w-full md:w-96 h-full p-4 overflow-auto transform transition-transform duration-300 ${open ? 'translate-x-0' : 'translate-x-full'}`} style={{ boxShadow: '0 6px 24px rgba(12,18,28,0.2)' }}>
        <header className="flex items-center justify-between">
          <h3 id="modal-title" className="text-lg font-semibold">Entrega #{delivery?.id}</h3>
          <button aria-label="Fechar" onClick={onClose} className="inline-block px-2 py-1">✖</button>
        </header>
        <div className="mt-4">
          <p><strong>Cliente:</strong> {delivery?.clientName}</p>
          <p><strong>Telefone:</strong> {delivery?.phone}</p>
          <p><strong>Endereço:</strong> {delivery?.address}</p>
          <p><strong>Janela:</strong> {delivery?.window}</p>
          <p><strong>Valor:</strong> {delivery?.value}</p>
          <div className="mt-3">
            <label className="block">Status
              <select className="input mt-1" value={form.status} onChange={(e)=>setForm((s:any)=>({...s, status: e.target.value}))}>
                <option value="PENDING">Nova</option>
                <option value="ASSIGNED">Em rota</option>
                <option value="EN_ROUTE">Em rota (a caminho)</option>
                <option value="DELIVERED">Entregue</option>
              </select>
            </label>
            <label className="block mt-3">Atribuir a
              <div className="flex items-center gap-2">
                <select className="input mt-1 flex-1" value={form.assignedToId} onChange={(e)=>setForm((s:any)=>({...s, assignedToId: e.target.value}))} aria-label="Atribuir motorista">
                  <option value="">—</option>
                  {driversLoading && <option>Carregando...</option>}
                  {!driversLoading && availableDrivers.map((dr:any)=> (<option key={dr.id} value={dr.id}>{dr.name}</option>))}
                </select>
                <button className="btn" type="button" onClick={()=>setShowCreate(true)} aria-expanded={String(false)}>Criar motorista</button>
              </div>
            </label>

            {/* Quick create inline form */}
            {showCreate && (
              <div className="mt-3 p-3 border rounded-md bg-gray-50">
                <h4 className="font-semibold mb-2">Criar motorista</h4>
                <div className="grid gap-2">
                  <input className="input" placeholder="Nome" value={newDriver.name} onChange={(e)=>setNewDriver(d=>({...d, name: e.target.value}))} aria-label="Nome do motorista" />
                  <input className="input" placeholder="Telefone" value={newDriver.phone} onChange={(e)=>setNewDriver(d=>({...d, phone: e.target.value}))} aria-label="Telefone do motorista" />
                  <input className="input" placeholder="Veículo (opcional)" value={newDriver.vehicle} onChange={(e)=>setNewDriver(d=>({...d, vehicle: e.target.value}))} aria-label="Veículo do motorista" />
                  <div className="flex gap-2">
                    <button className="btn" onClick={async ()=>{
                      if(!newDriver.name) return toast.push('Nome é obrigatório', 'error')
                      try{
                        setCreating(true)
                        const res = await axios.post('/api/drivers', newDriver)
                        const created = res.data
                        setAvailableDrivers(prev => [created, ...prev])
                        setForm((s:any)=>({...s, assignedToId: created.id}))
                        setShowCreate(false)
                        toast.push('Motorista criado', 'success')
                        setNewDriver({ name: '', phone: '', vehicle: '' })
                      }catch(e:any){
                        toast.push('Falha ao criar motorista', 'error')
                      }finally{ setCreating(false) }
                    }} disabled={creating}>{creating ? 'Criando...' : 'Criar'}</button>
                    <button className="btn" style={{background:'#e5e7eb', color:'#0f172a'}} onClick={()=>setShowCreate(false)} disabled={creating}>Cancelar</button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 flex gap-2">
            <button className="btn" onClick={handleSave} disabled={isSaving}>{isSaving ? 'Salvando...' : 'Salvar'}</button>
            <button className="btn" style={{background:'#e5e7eb', color:'#0f172a'}} onClick={onClose} disabled={isSaving}>Cancelar</button>
          </div>
        </div>
      </div>
    </div>
  )
}
