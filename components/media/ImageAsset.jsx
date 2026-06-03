// ImageAsset.jsx — Composant image centralisé
// Utilise le registre data/images.js pour afficher une image
// avec son alt et ses classes CSS automatiquement.
// Avantage : changer une image = modifier un seul fichier.

import React from 'react'
// Registre de toutes les images statiques du site
import { images } from '../../data/images.js'
// Convertit un chemin relatif en URL publique
import { imageUrl } from '../../utils/imageResolver.js'

// Props :
//   imgKey    : nom de l'image dans le registre (ex: 'homeHero')
//   className : classes CSS supplémentaires à ajouter
//   ...rest   : toutes les autres props HTML valides pour <img> (width, height…)
export default function ImageAsset({ imgKey, className = '', ...rest }) {
  // Cherche l'image dans le registre
  const asset = images[imgKey]

  // Si la clé n'existe pas, afficher un avertissement en développement
  if (!asset) {
    console.warn(`[ImageAsset] Clé introuvable dans le registre : "${imgKey}"`)
    return null
  }

  return (
    <img
      src={imageUrl(asset.src)}   // URL résolue depuis le chemin stocké
      alt={asset.alt}             // texte alternatif (accessibilité)
      // Fusion des classes du registre + celles passées en prop
      className={[asset.className, className].filter(Boolean).join(' ')}
      loading="lazy"              // chargement différé (performance)
      {...rest}                   // propagation des props supplémentaires
    />
  )
}
