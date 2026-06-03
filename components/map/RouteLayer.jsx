// RouteLayer.jsx — Tracé de l'itinéraire sur la carte
// Affiche la ligne du trajet entre deux points et anime
// un véhicule (🚗 ou 🛵) qui se déplace le long du trajet.

import React, { useState, useEffect, useRef } from 'react'
// Polyline : dessine une ligne sur la carte
// Marker : place un marqueur (icône) sur la carte
// useMap : donne accès à l'objet carte Leaflet
import { Polyline, Marker, useMap } from 'react-leaflet'
import L from 'leaflet'
// Hook personnalisé qui récupère le vrai trajet routier via l'API OSRM
import { useOsrmRoute } from '../../hooks/useOsrmRoute.js'

// Crée une icône emoji personnalisée pour Leaflet
function makeIcon(emoji) {
  return new L.DivIcon({
    className: '',
    html: `<div style="font-size:26px;line-height:1;filter:drop-shadow(0 2px 6px rgba(0,0,0,.35));transform:translate(-50%,-50%)">${emoji}</div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  })
}

// Icônes selon la direction du trajet
const ICONS = {
  go:   makeIcon('🚗'), // l'utilisateur va au coiffeur
  come: makeIcon('🛵'), // le coiffeur vient à domicile
}

// Interpolation linéaire : calcule une valeur intermédiaire entre a et b
// t = 0 → retourne a, t = 1 → retourne b
function lerp(a, b, t) { return a + (b - a) * t }

// Calcule la position [lat, lng] sur le trajet à un instant t (entre 0 et 1)
function posOnPath(path, t) {
  const n = path.length - 1
  const pos = Math.min(Math.max(t, 0), 0.9999) * n
  const i = Math.floor(pos)   // index du segment actuel
  const f = pos - i           // progression dans ce segment (0 à 1)
  return [lerp(path[i][0], path[i + 1][0], f), lerp(path[i][1], path[i + 1][1], f)]
}

// Durée totale de l'animation en millisecondes (7 secondes)
const DURATION = 7000

// Props :
//   from/to      : coordonnées GPS { lat, lng }
//   simulate     : true = lancer l'animation
//   direction    : 'go' (aller) | 'come' (retour)
//   onSimulationEnd : appelé quand l'animation est terminée
export default function RouteLayer({ from, to, simulate, direction = 'go', onSimulationEnd }) {
  const map = useMap()
  // path = tableau de coordonnées [lat, lng] représentant le trajet routier
  const path = useOsrmRoute(from, to)
  // animPos = position actuelle du véhicule animé sur la carte
  const [animPos, setAnimPos] = useState(null)
  // rafRef stocke l'ID de l'animation pour pouvoir l'annuler
  const rafRef = useRef(null)
  // startRef mémorise le timestamp de départ de l'animation
  const startRef = useRef(null)

  // Quand les points changent, ajuster le zoom pour voir tout le trajet
  useEffect(() => {
    if (!from || !to) return
    map.fitBounds(
      [[from.lat, from.lng], [to.lat, to.lng]],
      { padding: [60, 60], maxZoom: 15, duration: 1.2 }
    )
  }, [from?.lat, from?.lng, to?.lat, to?.lng])

  // Gestion de l'animation du véhicule
  useEffect(() => {
    // Annuler toute animation précédente
    if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null }
    if (!simulate || !path) return

    startRef.current = null
    // Si direction 'come' (coiffeur vient), on inverse le trajet
    const animPath = direction === 'come' ? [...path].reverse() : path

    // Fonction appelée à chaque frame de l'animation
    function tick(ts) {
      if (!startRef.current) startRef.current = ts
      // t = progression de 0 (début) à 1 (fin)
      const t = Math.min((ts - startRef.current) / DURATION, 1)
      setAnimPos(posOnPath(animPath, t))
      if (t < 1) {
        // Continuer l'animation à la prochaine frame
        rafRef.current = requestAnimationFrame(tick)
      } else {
        // Animation terminée : cacher le véhicule et notifier le parent
        setAnimPos(null)
        onSimulationEnd?.()
      }
    }
    rafRef.current = requestAnimationFrame(tick)

    // Nettoyage : annuler l'animation si le composant est démonté
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [simulate, path, direction])

  // Ne rien afficher si les deux points ne sont pas définis
  if (!from || !to) return null

  // Si le trajet OSRM n'est pas encore chargé, tracer une ligne droite
  const positions = path ?? [[from.lat, from.lng], [to.lat, to.lng]]
  const icon = ICONS[direction] ?? ICONS.go

  return (
    <>
      {/* Ligne en pointillés représentant le trajet */}
      <Polyline
        positions={positions}
        pathOptions={{ color: '#1a1917', weight: 3.5, opacity: 0.85, dashArray: '10, 6' }}
      />
      {/* Véhicule animé : affiché seulement pendant la simulation */}
      {animPos && (
        <Marker position={animPos} icon={icon} />
      )}
    </>
  )
}
