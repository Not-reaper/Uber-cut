// hooks/useOsrmRoute.js — Hook de calcul d'itinéraire routier
// Interroge l'API OSRM (Open Source Routing Machine) gratuite
// pour obtenir le vrai tracé d'une route entre deux points GPS.
// Retourne un tableau de coordonnées [lat, lng] pour Leaflet.

import { useState, useEffect } from 'react'

// Hook personnalisé : commence par "use" par convention React
// from/to : objets { lat, lng }
// Retourne : tableau [[lat, lng], [lat, lng], …] ou null si en chargement
export function useOsrmRoute(from, to) {
  const [path, setPath] = useState(null) // null = pas encore chargé

  useEffect(() => {
    // Si les points ne sont pas définis, réinitialiser
    if (!from || !to) { setPath(null); return }

    // Variable pour éviter de mettre à jour l'état si le composant est démonté
    // (évite l'erreur "can't update state on unmounted component")
    let cancelled = false

    // Construction de l'URL de l'API OSRM
    // Format : lng,lat;lng,lat (attention : OSRM utilise lng avant lat)
    const url =
      `https://router.project-osrm.org/route/v1/driving/` +
      `${from.lng},${from.lat};${to.lng},${to.lat}` +
      `?overview=full&geometries=geojson`

    fetch(url)
      .then(r => r.json())
      .then(data => {
        if (cancelled) return // composant démonté → on ignore la réponse
        if (data.routes?.[0]) {
          // OSRM renvoie des coordonnées en [lng, lat]
          // On les inverse en [lat, lng] car Leaflet attend [lat, lng]
          setPath(data.routes[0].geometry.coordinates.map(([lng, lat]) => [lat, lng]))
        } else {
          // Pas de route trouvée → ligne droite en fallback
          setPath([[from.lat, from.lng], [to.lat, to.lng]])
        }
      })
      .catch(() => {
        // Erreur réseau → ligne droite en fallback
        if (!cancelled) setPath([[from.lat, from.lng], [to.lat, to.lng]])
      })

    // Fonction de nettoyage : marque la requête comme annulée quand
    // les dépendances changent ou le composant se démonte
    return () => { cancelled = true }
  }, [from?.lat, from?.lng, to?.lat, to?.lng]) // recalcul si les coordonnées changent

  return path
}
 
