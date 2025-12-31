import { Router } from 'express'
import axios from 'axios'
import prisma from '../db'
import { emitToDriver, emitToOperators } from '../socket'

const router = Router()

// POST /routes/optimize
// body: { origin: {lat, lng}, waypoints: [{id, lat, lng}], profile?: 'driving' }
router.post('/optimize', async (req: any, res: any) => {
  try{
    const { origin, waypoints, profile = 'driving' } = req.body
    if(!waypoints || waypoints.length === 0) return res.status(400).json({ message: 'no waypoints' })

    const coords = [origin, ...waypoints].map((p:any) => `${p.lng},${p.lat}`).join(';')

    const mapboxToken = process.env.MAPBOX_TOKEN
    if(mapboxToken){
      // use Mapbox Optimization API
      const url = `https://api.mapbox.com/optimized-trips/v1/mapbox/${profile}/${coords}`
      const params = {
        access_token: mapboxToken,
        geometries: 'polyline6',
        overview: 'full',
        source: 'first',
        roundtrip: 'false'
      }
      const r = await axios.get(url, { params })
      const data = r.data
      if(!data.trips || data.trips.length === 0) return res.status(500).json({ message: 'no trip found' })
      const trip = data.trips[0]
      // mapbox returns waypoints with waypoint_index (order in trip)
      const ordered = data.waypoints.slice(1).sort((a:any,b:any)=> a.waypoint_index - b.waypoint_index).map((w:any,i:number)=>({
        original_index: w.waypoint_index,
        name: w.name,
        location: { lat: w.location[1], lng: w.location[0] },
        // find id by comparing coords
        id: waypoints.find((p:any)=> Math.abs(p.lat - w.location[1]) < 0.0001 && Math.abs(p.lng - w.location[0]) < 0.0001 )?.id
      }))

      return res.json({ ordered, distance: trip.distance, duration: trip.duration, geometry: trip.geometry })
    }

    // Fallback: OSRM trip service
    const osrmUrl = `http://router.project-osrm.org/trip/v1/driving/${coords}`
    const r2 = await axios.get(osrmUrl, { params: { source: 'first', roundtrip: 'false', geometries: 'polyline', overview: 'full' } })
    const data2 = r2.data
    if(!data2.trips || data2.trips.length === 0) return res.status(500).json({ message: 'no trip found (osrm)' })
    const trip2 = data2.trips[0]
    // data2.waypoints contains waypoints with 'waypoint_index'
    const ordered2 = data2.waypoints.slice(1).sort((a:any,b:any)=> a.waypoint_index - b.waypoint_index).map((w:any)=>({
      name: w.name,
      location: { lat: w.location[1], lng: w.location[0] },
      id: waypoints.find((p:any)=> Math.abs(p.lat - w.location[1]) < 0.0001 && Math.abs(p.lng - w.location[0]) < 0.0001 )?.id
    }))

    return res.json({ ordered: ordered2, distance: trip2.distance, duration: trip2.duration, geometry: trip2.geometry })
  }catch(e:any){
    console.error('optimize error', e?.response?.data || e.message)
    return res.status(500).json({ message: 'optimize failed', err: e?.message })
  }
})


// assign generated route to driver and deliveries
router.post('/assign', async (req: any, res: any) => {
  try{
    const { driverId, ordered, distance, duration, geometry } = req.body
    if(!driverId || !ordered || !Array.isArray(ordered) || ordered.length === 0) return res.status(400).json({ message: 'invalid payload' })

    // create route record
    const route = await prisma.route.create({ data: { driverId, waypoints: ordered, distance: distance || null, duration: duration || null, geometry: geometry || null } })

    // assign deliveries to driver
    await prisma.delivery.updateMany({ where: { id: { in: ordered } }, data: { assignedToId: driverId, status: 'ASSIGNED' } })

    // emit to driver over socket
    emitToDriver(driverId, 'assignedRoute', { routeId: route.id, ordered, distance, duration, geometry })
    emitToOperators('routeAssigned', { routeId: route.id, driverId, ordered })

    res.json({ route })
  }catch(e){
    console.error(e)
    res.status(500).json({ message: 'assign failed' })
  }
})

// Cancel/unassign a route: POST /routes/:id/cancel
router.post('/:id/cancel', async (req: any, res: any) => {
  try{
    const { id } = req.params
    const route = await prisma.route.findUnique({ where: { id } })
    if(!route) return res.status(404).json({ message: 'route not found' })

    // get waypoints which is stored as JSON array of delivery ids or objects
    const waypoints: any = route.waypoints || []
    const ids = waypoints.map((w:any) => (typeof w === 'string' ? w : w.id)).filter(Boolean)

    // unassign deliveries
    await prisma.delivery.updateMany({ where: { id: { in: ids } }, data: { assignedToId: null, status: 'PENDING' } })

    // delete route
    await prisma.route.delete({ where: { id } })

    // notify driver
    emitToDriver(route.driverId, 'routeCancelled', { routeId: id })
    emitToOperators('routeCancelled', { routeId: id, driverId: route.driverId })

    res.json({ message: 'cancelled' })
  }catch(e){
    console.error('cancel route failed', e)
    res.status(500).json({ message: 'cancel failed' })
  }
})

export default router
