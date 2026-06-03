// utils/imageResolver.js — Résolution des chemins d'images
// Les images statiques sont dans /public/assets/images/.
// Cette fonction convertit les chemins courts (utilisés dans
// data/providers.js) en URLs complètes utilisables dans <img>.
//
// Exemples :
//   imageUrl('providers/alexandre/avatar.jpg')
//   → '/assets/images/providers/alexandre/avatar.jpg'
//
//   imageUrl('https://images.unsplash.com/…') → inchangé
//   imageUrl('/already/absolute.jpg')          → inchangé
//   imageUrl(undefined)                        → ''

export function imageUrl(path) {
  if (!path) return '' // chemin vide → pas d'image
  // URL externe (http/https) ou protocole relatif (//) → on ne touche pas
  if (path.startsWith('http') || path.startsWith('//')) return path
  // Chemin absolu (commence par /) → déjà correct
  if (path.startsWith('/')) return path
  // Chemin relatif → on ajoute le préfixe du dossier public
  return `/assets/images/${path}`
}
