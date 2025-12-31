import useSWR from 'swr'
import axios from 'axios'
import Link from 'next/link'

const fetcher = (url: string) => axios.get(url).then(r => r.data)

export default function Home() {
  const { data: deliveries } = useSWR('/api/deliveries', fetcher)

  return (
    <main>
      <div className="kpis grid grid-cols-3 gap-4 mb-4">
        <div className="card">Entregas hoje: <strong>24</strong></div>
        <div className="card">Em rota: <strong>3</strong></div>
        <div className="card">SLA: <strong>97%</strong></div>
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold">Próximas saídas (12:30)</h2>
        <p>Atrasos (2) • Novas (5)</p>
      </div>

      <div className="mt-4">
        <h3 className="text-md font-semibold">Entregas (amostra)</h3>
        <pre className="mt-2 text-sm">{JSON.stringify(deliveries?.slice?.(0,3)||[], null, 2)}</pre>
        <Link href="/entregas" className="btn mt-3 inline-block">Ver todas as entregas</Link>
      </div>
    </main>
  )
}
