import axios from 'axios'
import polyline from 'polyline'

const STORAGE_KEY = 'mock_data_v1'

type Delivery = any
type Driver = any

function defaultDrivers(): Driver[] {
  return [
    { id: 'ana', name: 'Ana', phone: '+5511999999999', vehicle: 'Moto' },
    { id: 'carlos', name: 'Carlos', phone: '+5511988888888', vehicle: 'Carro' }
  ]
}

function defaultDeliveries(): Delivery[] {
  return [
    { id: '21', clientName: 'João Silva', address: 'R. Aroeiras, 45', phone: '', value: 0, status: 'PENDING', lat: -23.5505, lng: -46.6333 },
    { id: '22', clientName: 'Maria Souza', address: 'Av. Brasil, 121', phone: '', value: 59.9, status: 'ASSIGNED', assignedToId: 'ana', lat: -23.5510, lng: -46.6340 },
    { id: '23', clientName: 'Mercadinho', address: 'R. das Flores, 300', phone: '', value: 0, status: 'DELIVERED', assignedToId: 'carlos', lat: -23.5520, lng: -46.6350 }
  ]
}

function load(){
  const raw = localStorage.getItem(STORAGE_KEY)
  if(!raw) {
    const data = { drivers: defaultDrivers(), deliveries: defaultDeliveries(), routes: [] }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    return data
  }
  return JSON.parse(raw)
}

function save(data:any){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

function haversine(a:number[], b:number[]){
  const toRad = (v:number)=> v * Math.PI/180
  const R = 6371e3
  const phi1 = toRad(a[0]); const phi2 = toRad(b[0])
  const dphi = toRad(b[0]-a[0]); const dlambda = toRad(b[1]-a[1])
  const x = Math.sin(dphi/2)*Math.sin(dphi/2) + Math.cos(phi1)*Math.cos(phi2)*Math.sin(dlambda/2)*Math.sin(dlambda/2)
  const c = 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1-x))
  return R * c
}

function buildAdapter(){
  const original = axios.defaults.adapter
  axios.defaults.adapter = async (config: any) => {
    try{
      const url = config.url || ''
      if(!url.startsWith('/api/')) return original ? original(config) : Promise.reject(new Error('No adapter'))

      const data = load()
      const method = (config.method || 'get').toLowerCase()
      const path = url.replace('/api','')

      // routing
      // GET /deliveries
      if(method === 'get' && path === '/deliveries'){
        return { data: data.deliveries, status: 200, statusText: 'OK', headers: {}, config, request: {} }
      }

      // GET /deliveries/:id
      const mDel = path.match(/^\/deliveries\/(.+)$/)
      if(method === 'get' && mDel){
        const id = mDel[1]
        const d = data.deliveries.find((x:any)=>x.id===id)
        if(!d) return { data: { message: 'not found' }, status: 404, statusText: 'Not Found', headers: {}, config, request: {} }
        return { data: d, status: 200, statusText: 'OK', headers: {}, config, request: {} }
      }

      // POST /deliveries
      if(method === 'post' && path === '/deliveries'){
        const body = config.data || {}
        const id = String(Date.now()).slice(-4)
        const del = { id, ...body }
        data.deliveries.unshift(del)
        save(data)
        return { data: del, status: 201, statusText: 'Created', headers: {}, config, request: {} }
      }

      // PUT /deliveries/:id
      if(method === 'put' && mDel){
        const id = mDel[1]
        const idx = data.deliveries.findIndex((x:any)=>x.id===id)
        if(idx===-1) return { data: { message: 'not found' }, status: 404, statusText: 'Not Found', headers: {}, config, request: {} }
        const body = config.data || {}
        data.deliveries[idx] = { ...data.deliveries[idx], ...body }
        save(data)
        // emit event
        window.dispatchEvent(new CustomEvent('mock:deliveryUpdated', { detail: data.deliveries[idx] }))
        return { data: data.deliveries[idx], status: 200, statusText: 'OK', headers: {}, config, request: {} }
      }

      // GET /drivers
      if(method === 'get' && path === '/drivers'){
        return { data: data.drivers, status:200, statusText:'OK', headers:{}, config, request: {} }
      }

      // POST /drivers
      if(method === 'post' && path === '/drivers'){
        const body = config.data || {}
        const id = body.id || ('d' + String(Date.now()).slice(-4))
        const driver = { id, ...body }
        data.drivers.unshift(driver)
        save(data)
        return { data: driver, status: 201, statusText:'Created', headers:{}, config, request: {} }
      }

      // POST /routes/optimize
      if(method === 'post' && path === '/routes/optimize'){
        const body = config.data || {}
        const origin = body.origin
        const waypoints = body.waypoints || []
        // naive ordering: keep order, compute distance and duration
        let distance = 0
        let prev = [origin.lat, origin.lng]
        const ordered = waypoints.map((w:any)=>({ id: w.id, name: w.id, location: { lat: w.lat, lng: w.lng } }))
        const coordsForPolyline: any[] = []
        coordsForPolyline.push([origin.lat, origin.lng])
        waypoints.forEach((w:any)=>{ distance += haversine(prev, [w.lat, w.lng]); prev = [w.lat, w.lng]; coordsForPolyline.push([w.lat, w.lng]) })
        const duration = distance / (30/3.6) // rough seconds (30 km/h)
        const geometry = polyline.encode(coordsForPolyline.map((p:any)=>[p[0], p[1]]), 6)
        return { data: { ordered, distance, duration, geometry }, status:200, statusText:'OK', headers:{}, config, request: {} }
      }

      // POST /routes/assign
      if(method === 'post' && path === '/routes/assign'){
        const body = config.data || {}
        const id = 'r' + String(Date.now()).slice(-4)
        const route = { id, driverId: body.driverId, waypoints: body.ordered, distance: body.distance, duration: body.duration, geometry: body.geometry }
        data.routes.unshift(route)
        // assign deliveries
        data.deliveries = data.deliveries.map((d:any)=> body.ordered.includes(d.id) ? ({...d, assignedToId: body.driverId, status: 'ASSIGNED'}) : d)
        save(data)
        // emit events
        window.dispatchEvent(new CustomEvent('mock:routeAssigned', { detail: route }))
        return { data: { route }, status:200, statusText:'OK', headers:{}, config, request: {} }
      }

      // POST /routes/:id/cancel
      const mRouteCancel = path.match(/^\/routes\/(.+)\/cancel$/)
      if(method === 'post' && mRouteCancel){
        const id = mRouteCancel[1]
        const idx = data.routes.findIndex((r:any)=>r.id===id)
        if(idx>=0){
          const r = data.routes[idx]
          // unassign
          data.deliveries = data.deliveries.map((d:any)=> r.waypoints.includes(d.id) ? ({...d, assignedToId: null, status: 'PENDING'}) : d)
          data.routes.splice(idx,1)
          save(data)
          window.dispatchEvent(new CustomEvent('mock:routeCancelled', { detail: { routeId: id } }))
          return { data: { message: 'cancelled' }, status: 200, statusText:'OK', headers:{}, config, request: {} }
        }
        return { data: { message: 'not found' }, status:404, statusText:'Not Found', headers:{}, config, request: {} }
      }

      // POST /deliveries/:id/proof
      const mProof = path.match(/^\/deliveries\/(.+)\/proof$/)
      if(method === 'post' && mProof){
        const id = mProof[1]
        // store a placeholder proofUrl
        const idx = data.deliveries.findIndex((d:any)=>d.id===id)
        if(idx>=0){
          const url = 'data:image/png;base64,PLACEHOLDER'
          data.deliveries[idx].proofUrl = url
          data.deliveries[idx].status = 'DELIVERED'
          save(data)
          window.dispatchEvent(new CustomEvent('mock:statusUpdated', { detail: data.deliveries[idx] }))
          return { data: data.deliveries[idx], status:200, statusText:'OK', headers:{}, config, request: {} }
        }
        return { data: { message: 'not found' }, status:404, statusText:'Not Found', headers:{}, config, request: {} }
      }

      return { data: { message: 'unhandled mock' }, status:500, statusText:'Unhandled', headers:{}, config, request: {} }

    }catch(e:any){
      return Promise.reject(e)
    }
  }
}

function initMockSocket(){
  const listeners: any = {}
  const mockSocket = {
    on: (ev:string, fn:any)=>{ listeners[ev] = listeners[ev] || []; listeners[ev].push(fn) },
    off: (ev:string, fn:any)=>{ if(!listeners[ev]) return; listeners[ev] = listeners[ev].filter((f:any)=>f!==fn) },
    emit: (ev:string, payload:any)=>{ (listeners[ev]||[]).forEach((f:any)=>setTimeout(()=>f(payload),0)) }
  }

  // bridge window events from mock server to socket events
  window.addEventListener('mock:statusUpdated', (e:any)=> mockSocket.emit('statusUpdated', e.detail))
  window.addEventListener('mock:routeAssigned', (e:any)=> mockSocket.emit('assignedRoute', e.detail))
  window.addEventListener('mock:routeCancelled', (e:any)=> mockSocket.emit('routeCancelled', e.detail))

  (window as any).__MOCK_SOCKET = mockSocket
}

export function startMock(){
  // only run in browser
  if(typeof window === 'undefined') return
  (window as any).__USE_MOCK = true
  buildAdapter()
  initMockSocket()
  console.info('Mock API + mock socket enabled')
}

export function resetMock(){
  localStorage.removeItem(STORAGE_KEY)
}

export default { startMock, resetMock }
