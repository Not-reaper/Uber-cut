// utils/geo.js — Calculs géographiques
// Fonctions mathématiques pour calculer distances et temps
// de trajet entre coordonnées GPS.

// Calcule la distance à vol d'oiseau entre deux points GPS
// en utilisant la formule de Haversine (trigonométrie sphérique).
// lat1/lng1 = point de départ | lat2/lng2 = point d'arrivée
// Retourne la distance en kilomètres (arrondie à 2 décimales)
export function haversine(lat1, lng1, lat2, lng2) {
  const R = 6371 // Rayon moyen de la Terre en km
  // Convertit les degrés en radians (requis par Math.sin/cos)
  const toRad = d => (d * Math.PI) / 180
  const dLat = toRad(lat2 - lat1)
  const dLng = toRad(lng2 - lng1)
  // Formule de Haversine
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return parseFloat((R * c).toFixed(2))
}

// Estime les temps de trajet selon le mode de transport
// Vitesses moyennes en milieu urbain parisien :
//   à pied : 4 km/h | vélo : 14 km/h | voiture : 25 km/h
// Formule : temps (min) = (distance / vitesse) × 60
// Math.max(1, …) garantit un minimum de 1 minute
export function travelTimes(distKm) {
  return {
    walk: Math.max(1, Math.round((distKm / 4)  * 60)),
    bike: Math.max(1, Math.round((distKm / 14) * 60)),
    car:  Math.max(1, Math.round((distKm / 25) * 60)),
  }
}
