// pages/MapPage.jsx — Carte interactive (URL : /map)
// Page principale avec deux zones :
//   Gauche (sidebar) : filtres + liste des coiffeurs + RoutePanel
//   Droite          : carte Leaflet avec marqueurs + RouteLayer
// La sidebar et la carte communiquent via l'état "selected".

import React, { useMemo, useState } from 'react'
// Composants React-Leaflet pour construire la carte
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'

import ProviderListItem from '../components/providers/ProviderListItem.jsx'
import RouteLayer from '../components/map/RouteLayer.jsx'
import RoutePanel from '../components/map/RoutePanel.jsx'
import { USER_LOCATION, providers } from '../data/providers.js'

// Imports des images des marqueurs Leaflet (nécessaire avec Vite/Webpack)
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon   from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

// Correction d'un bug Leaflet avec les bundlers modernes :
// Leaflet cherche ses icônes par défaut d'une façon incompatible avec Vite
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl:       markerIcon,
  shadowUrl:     markerShadow,
})

// Icône noire pour le coiffeur sélectionné (point noir avec bordure blanche)
const selectedIcon = new L.DivIcon({
  className: '',
  html: `<div style="
    width:18px;height:18px;border-radius:50%;
    background:#1a1917;border:3px solid #fff;
    box-shadow:0 2px 8px rgba(0,0,0,.35)">
  </div>`,
  iconSize: [18, 18],
  iconAnchor: [9, 9],
})

// Icône verte pour la position de l'utilisateur
const userIcon = new L.DivIcon({
  className: '',
  html: `<div style="
    width:14px;height:14px;border-radius:50%;
    background:#34a853;border:3px solid #fff;
    box-shadow:0 2px 6px rgba(52,168,83,.5)">
  </div>`,
  iconSize: [14, 14],
  iconAnchor: [7, 7],
})

// Composant interne qui déplace la vue de la carte vers un point GPS
// (doit être à l'intérieur de MapContainer pour accéder à useMap)
function FlyTo({ lat, lng }) {
  const map = useMap()
  React.useEffect(() => {
    if (lat && lng) map.flyTo([lat, lng], 15, { duration: 1.1 })
  }, [lat, lng])
  return null // ne rend rien visuellement
}

export default function MapPage() {
  const [mode, setMode]         = useState('both')  // filtre de service : 'home' | 'salon' | 'both'
  const [filters, setFilters]   = useState({ available: true, premium: false, top: false, near: false })
  const [sort, setSort]         = useState('distance') // tri : 'distance' | 'rating' | 'price'
  const [q, setQ]               = useState('')         // recherche textuelle
  const [selected, setSelected] = useState(null)       // coiffeur sélectionné (objet ou null)
  // simulation.active = true pendant l'animation | direction = 'go' ou 'come'
  const [simulation, setSimulation] = useState({ active: false, direction: 'go' })

  // Liste des coiffeurs filtrés et triés
  const list = useMemo(() => {
    const qq = q.trim().toLowerCase()
    let arr = providers.filter(p => {
      // Filtre par mode de service
      if (mode === 'home'  && p.serviceType === 'salon') return false
      if (mode === 'salon' && p.serviceType === 'home')  return false
      // Filtre disponibilité
      if (filters.available && !p.available)              return false
      // Filtre Premium+ (exclut les "standard")
      if (filters.premium  && p.tier === 'standard')     return false
      // Filtre Top rated (note >= 4.8)
      if (filters.top      && p.rating < 4.8)            return false
      // Filtre à moins de 2 km
      if (filters.near     && p.distanceKm > 2)          return false
      // Filtre recherche texte
      if (qq && !(
        p.name.toLowerCase().includes(qq) ||
        p.speciality.toLowerCase().includes(qq)
      )) return false
      return true
    })

    // Tri du résultat
    if (sort === 'rating')     arr = arr.slice().sort((a, b) => b.rating - a.rating)
    else if (sort === 'price') arr = arr.slice().sort((a, b) => a.priceFrom - b.priceFrom)
    else                       arr = arr.slice().sort((a, b) => a.distanceKm - b.distanceKm)

    return arr
  }, [mode, filters, sort, q])

  // Active/désactive un filtre par son nom
  function toggleFilter(name) {
    setFilters(prev => ({ ...prev, [name]: !prev[name] }))
  }

  // Sélectionne un coiffeur (ou le désélectionne si déjà sélectionné)
  function handleSelect(p) {
    setSimulation({ active: false, direction: 'go' }) // reset simulation
    setSelected(prev => prev?.id === p.id ? null : p)
  }

  // Lance l'animation de trajet avec la direction choisie
  function handleSimulate(direction) {
    setSimulation({ active: true, direction })
  }

  // Appelé quand l'animation est terminée
  function handleSimulationEnd() {
    setSimulation({ active: false, direction: 'go' })
  }

  // Ferme le RoutePanel et désélectionne le coiffeur
  function handleClose() {
    setSimulation({ active: false, direction: 'go' })
    setSelected(null)
  }

  return (
    <div className="map-shell">

      <aside className="map-sidebar">

        <div className="map-sidebar__controls">
          <input
            className="map-search-input"
            placeholder="Coiffeur, spécialité..."
            value={q}
            onChange={e => setQ(e.target.value)}
            aria-label="Rechercher un coiffeur"
          />

          <div className="map-chips">
            {[
              { id: 'home',  label: 'Domicile' },
              { id: 'both',  label: 'Tous' },
              { id: 'salon', label: 'Salon' },
            ].map(m => (
              <button
                key={m.id}
                className={`map-chip${mode === m.id ? ' is-active' : ''}`}
                onClick={() => setMode(m.id)}
              >
                {m.label}
              </button>
            ))}
          </div>

          <div className="map-chips">
            {[
              { id: 'available', label: 'Disponible' },
              { id: 'premium',   label: 'Premium+' },
              { id: 'top',       label: '★ 4.8+' },
              { id: 'near',      label: '< 2 km' },
            ].map(f => (
              <button
                key={f.id}
                className={`map-chip${filters[f.id] ? ' is-active' : ''}`}
                onClick={() => toggleFilter(f.id)}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="map-meta">
            <div><strong>{list.length}</strong> coiffeur{list.length > 1 ? 's' : ''}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 12, color: 'var(--muted-2)' }}>Trier</span>
              <select
                className="map-sort-select"
                value={sort}
                onChange={e => setSort(e.target.value)}
                aria-label="Tri"
              >
                <option value="distance">Distance</option>
                <option value="rating">Note</option>
                <option value="price">Prix</option>
              </select>
            </div>
          </div>
        </div>

        <div className="map-list" role="list" aria-label="Liste des coiffeurs">
          {list.length === 0 ? (
            <div style={{ padding: '32px 16px', textAlign: 'center', color: 'var(--muted-2)', fontSize: 14 }}>
              Aucun résultat pour ces filtres.
            </div>
          ) : (
            list.map(p => (
              <ProviderListItem
                key={p.id}
                provider={p}
                selected={selected?.id === p.id}
                onSelect={handleSelect}
              />
            ))
          )}
        </div>

        {selected && (
          <RoutePanel
            provider={selected}
            onClose={handleClose}
            onSimulate={handleSimulate}
            simulationActive={simulation.active}
          />
        )}
      </aside>

      <div className="map-canvas">
        <MapContainer
          center={[USER_LOCATION.lat, USER_LOCATION.lng]}
          zoom={13}
          zoomControl={false}
          className="leaflet-u"
          aria-label="Carte des coiffeurs"
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>'
          />

          <Marker position={[USER_LOCATION.lat, USER_LOCATION.lng]} icon={userIcon}>
            <Popup>
              <strong>Vous êtes ici</strong><br />
              Paris, France
            </Popup>
          </Marker>

          {list.map(p => (
            <Marker
              key={p.id}
              position={[p.lat, p.lng]}
              icon={selected?.id === p.id ? selectedIcon : new L.Icon.Default()}
              eventHandlers={{ click: () => handleSelect(p) }}
            >
              <Popup>
                <strong>{p.name}</strong><br />
                {p.speciality} · ★ {p.rating.toFixed(1)}<br />
                <span style={{ color: '#6b6a65' }}>dès {p.priceFrom} €</span>
              </Popup>
            </Marker>
          ))}

          {selected && (
            <RouteLayer
              from={USER_LOCATION}
              to={{ lat: selected.lat, lng: selected.lng }}
              simulate={simulation.active}
              direction={simulation.direction}
              onSimulationEnd={handleSimulationEnd}
            />
          )}
        </MapContainer>

        <div className="map-pill" aria-live="polite">
          {simulation.active
            ? (simulation.direction === 'come' ? '🛵 Simulation en cours…' : '🚗 Simulation en cours…')
            : `${list.length} coiffeur${list.length > 1 ? 's' : ''} · Paris`}
        </div>
      </div>
    </div>
  )
}
