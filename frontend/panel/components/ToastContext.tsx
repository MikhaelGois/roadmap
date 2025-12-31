import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react'

type Toast = {
  id: string
  message: string
  type?: 'success'|'error'|'info'
  actionLabel?: string
  onAction?: () => void
}

const ToastCtx = createContext<any>(null)

export function ToastProvider({ children }:{ children: ReactNode }){
  const [toasts, setToasts] = useState<Toast[]>([])

  const push = useCallback((message:string, type:'success'|'error'|'info' = 'info', options?: { actionLabel?: string, onAction?: ()=>void, ttl?: number }) =>{
    const id = String(Date.now()) + Math.random().toString(36).slice(2,7)
    const t: Toast = { id, message, type, actionLabel: options?.actionLabel, onAction: options?.onAction }
    setToasts(s => [t, ...s])
    // auto-dismiss timer. If ttl === 0 -> persistent until user dismisses
    const ttl = typeof options?.ttl === 'number' ? options.ttl : 6000
    if(ttl > 0){
      setTimeout(()=> setToasts(s => s.filter(x=>x.id !== id)), ttl)
    }
    return id
  }, [])

  const remove = useCallback((id: string) => setToasts(s => s.filter(x=>x.id !== id)), [])

  const handleAction = useCallback((t: Toast) => {
    if(t.onAction) try{ t.onAction() }catch(e){ console.error('toast action error', e) }
    remove(t.id)
  }, [remove])

  return (
    <ToastCtx.Provider value={{ push, remove }}>
      {children}
      <div aria-live="polite" className="fixed right-4 bottom-20 z-50 flex flex-col gap-3">
        {toasts.map(t => (
          <div key={t.id} role={t.type === 'error' ? 'alert' : 'status'} aria-atomic="true" className={`px-4 py-3 rounded-md shadow-md transform transition-all duration-300 flex items-center gap-3 max-w-xs ${t.type === 'success' ? 'bg-green-500 text-white' : t.type === 'error' ? 'bg-red-500 text-white' : 'bg-gray-800 text-white'}`}>
            <div className="flex-1">
              <div className="text-sm">{t.message}</div>
            </div>
            {t.actionLabel && (
              <button className="ml-2 px-2 py-1 bg-white text-gray-800 rounded-md text-sm" onClick={()=>handleAction(t)} aria-label={`Ação: ${t.actionLabel}`}>{t.actionLabel}</button>
            )}
            <button aria-label="Dismiss notification" className="ml-2 text-sm opacity-80" onClick={()=>remove(t.id)}>✖</button>
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  )
}

export function useToast(){
  return useContext(ToastCtx)
}
