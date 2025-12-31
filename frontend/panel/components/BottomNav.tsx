import Link from 'next/link'

export default function BottomNav(){
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden" role="navigation" aria-label="Bottom navigation">
      <ul className="flex justify-around items-center h-14">
        <li><Link className="flex flex-col items-center text-xs" href="/">Dashboard</Link></li>
        <li><Link className="flex flex-col items-center text-xs" href="/entregas">Entregas</Link></li>
        <li><Link className="flex flex-col items-center text-xs" href="/roteirizacao">Roteirização</Link></li>
        <li><Link className="flex flex-col items-center text-xs" href="/mapa">Mapa</Link></li>
        <li><Link className="flex flex-col items-center text-xs" href="/more">Mais</Link></li>
      </ul>
    </nav>
  )
}
