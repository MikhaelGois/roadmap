import React, { useEffect, useRef } from 'react'
import mapboxgl from 'mapbox-gl'

type Props = {
  accessToken?: string
  geometry?: string // polyline6 or polyline
  markers?: { id:string, lat:number, lng:number, label?:string }[]
}

export default function MapboxMap({ accessToken, geometry, markers = [] }: Props){
  const mapContainer = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<any>(null)

  useEffect(()=>{
    if(!mapContainer.current) return
    if(accessToken) mapboxgl.accessToken = accessToken

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'https://demotiles.maplibre.org/style.json',
      center: markers[0] ? [markers[0].lng, markers[0].lat] : [-46.6333, -23.5505],
      zoom: 12
    })

    mapRef.current = map

    map.on('load', () => {
      if(geometry){
        // decode polyline6 to geojson line
        try{
          const coords = decodePolyline(geometry)
          if(map.getSource('route')) map.removeLayer('route'); map.removeSource('route')
          map.addSource('route', { type: 'geojson', data: { type: 'Feature', geometry: { type: 'LineString', coordinates: coords } } })
          map.addLayer({ id: 'route', type: 'line', source: 'route', paint: { 'line-color': '#2563EB', 'line-width': 4 } })
          // fit bounds
          const bounds = coords.reduce((b:any, c:any)=> b.extend(c), new mapboxgl.LngLatBounds(coords[0], coords[0]))
          map.fitBounds(bounds, { padding: 40 })
        }catch(e){ console.warn('poly decode failed', e) }
      }

      // add markers
      markers.forEach(m => {
        const el = document.createElement('div')
        el.className = 'marker'
        el.style.width = '18px'
        el.style.height = '18px'
        el.style.borderRadius = '9px'
        el.style.background = '#2563EB'
        el.style.border = '2px solid white'
        new mapboxgl.Marker(el).setLngLat([m.lng, m.lat]).setPopup(new mapboxgl.Popup({ offset: 10 }).setText(m.label || m.id)).addTo(map)
      })
    })

    return ()=>{ map.remove() }
  }, [accessToken, geometry, markers])

  return <div ref={mapContainer} style={{ width: '100%', height: 400 }} aria-hidden="true" />
}

import polyline from 'polyline'

function decodePolyline(str: string){
  try{
    // Mapbox optimized trips returns polyline6 (precision 1e6)
    // polyline.decode supports a precision parameter
    const coords = polyline.decode(str, 6).map((p:any)=>[p[1], p[0]])
    // polyline.decode returns [lat, lng], convert to [lng, lat]
    return coords
  }catch(e){
    console.warn('polyline decode failed', e)
    return []
  }
}
