import React from 'react'
import Link from 'next/link'
import BottomNav from './BottomNav'

export default function Layout({ children }:{ children: React.ReactNode }){
  const [mockActive, setMockActive] = React.useState(false)
  React.useEffect(()=>{
    if(typeof window !== 'undefined' && (window as any).__USE_MOCK) setMockActive(true)
  }, [])

  return (
    <div className="min-h-screen flex flex-col">
      {mockActive && (
        <div className="bg-yellow-50 border-b border-yellow-200 text-yellow-800 px-4 py-2 text-sm text-center">
          Demo mode: using client-side mock API (localStorage). Changes are local to your browser.
        </div>
      )}

      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <strong className="text-lg">Entrega Roteirizada</strong>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-sm">Operador ▾</div>
          <button className="text-sm text-red-500">Sair</button>
        </div>
      </header>

      <div className="flex flex-1">
        <aside className="hidden md:block w-64 bg-white border-r border-gray-200 p-4">
          <nav aria-label="Sidebar">
            <ul className="space-y-1">
              <li><Link className="block px-3 py-2 rounded-md hover:bg-gray-50" href="/">Dashboard</Link></li>
              <li><Link className="block px-3 py-2 rounded-md hover:bg-gray-50" href="/entregas">Entregas</Link></li>
              <li><Link className="block px-3 py-2 rounded-md hover:bg-gray-50" href="/roteirizacao">Roteirização</Link></li>
              <li><Link className="block px-3 py-2 rounded-md hover:bg-gray-50" href="/motoristas">Motoristas</Link></li>
              <li><Link className="block px-3 py-2 rounded-md hover:bg-gray-50" href="/mapa">Mapa (Live)</Link></li>
              <li><Link className="block px-3 py-2 rounded-md hover:bg-gray-50" href="/config">Configurações</Link></li>
            </ul>
          </nav>
        </aside>

        <main className="flex-1 p-4">
          {children}
        </main>
      </div>

      <BottomNav />
    </div>
  )
}
