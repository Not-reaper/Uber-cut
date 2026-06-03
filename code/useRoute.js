// hooks/useRoute.js — Hook de calcul de temps de trajet
// Calcule la distance à vol d'oiseau entre deux points GPS
// et estime les temps de marche, vélo et voiture.
// Contrairement à useOsrmRoute, ce hook est instantané
// (pas d'appel réseau, calcul mathématique local).

import { useMemo } from 'react'
import { haversine, travelTimes } from '../utils/geo.js'

// from/to : { lat, lng } ou null
// Retourne : { distKm, walk, bike, car } ou null si les points manquent
export function useRoute(from, to) {
  // useMemo évite de recalculer si les coordonnées n'ont pas changé
  return useMemo(() => {
    if (!from || !to) return null
    // Distance en km à vol d'oiseau (formule Haversine)
    const distKm = haversine(from.lat, from.lng, to.lat, to.lng)
    // Temps estimés en minutes pour chaque mode de transport
    const times = travelTimes(distKm)
    // Retourne un objet combiné : { distKm, walk, bike, car }
    return { distKm, ...times }
  }, [from?.lat, from?.lng, to?.lat, to?.lng]) // recalcul seulement si les GPS changent
}
