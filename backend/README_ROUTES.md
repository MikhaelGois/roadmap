Routes optimization endpoint

POST /routes/optimize
Body:
  {
    origin: { lat: number, lng: number },
    waypoints: [{ id: string, lat: number, lng: number }],
    profile?: 'driving'
  }

Response:
  {
    ordered: [{ id, name?, location: { lat, lng } }],
    distance: number (meters),
    duration: number (seconds),
    geometry: string (polyline)
  }

POST /routes/assign
Body: { driverId: string, ordered: [deliveryId], distance?: number, duration?: number, geometry?: string }
- creates a `Route` record, assigns the deliveries to the driver (sets `assignedToId` and `status` to `ASSIGNED`) and emits `assignedRoute` to the target driver via socket.io. Returned payload: { route }

POST /routes/:id/cancel
- Cancels/unassigns a route: sets deliveries in the route back to `PENDING` and `assignedToId = null`, deletes the `Route` record and emits `routeCancelled` via socket.io.
Notes: uses MAPBOX_TOKEN if provided, otherwise falls back to OSRM public API. For production recommend securing Mapbox token and handling rate limits.
