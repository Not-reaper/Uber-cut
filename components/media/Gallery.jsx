// Gallery.jsx — Grille de photos du coiffeur
// Affiche les photos en grille. Un clic ouvre la Lightbox
// pour voir la photo en grand.

import React from 'react'
// Convertit un chemin relatif en URL complète
import { imageUrl } from '../../utils/imageResolver.js'

// Props :
//   images  : tableau de chemins d'images (ex: ['providers/sofia/gallery-1.jpg', ...])
//   classes : tableau de classes CSS, une par image (pour le recadrage)
//   onOpen  : fonction appelée avec l'URL quand on clique une photo
export default function Gallery({ images = [], classes = [], onOpen }) {
  // Si pas d'images, ne rien afficher
  if (!images.length) return null

  return (
    <div className="gallery">
      {/* On parcourt chaque image avec .map() pour créer un <img> par photo */}
      {images.map((src, i) => (
        <img
          key={i}                            // clé unique requise par React dans les listes
          src={imageUrl(src)}                // résolution du chemin en URL
          alt={`Photo ${i + 1}`}
          className={`gallery-img${classes[i] ? ' ' + classes[i] : ''}`}
          loading="lazy"                     // chargement différé (performance)
          onClick={() => onOpen?.(imageUrl(src))} // ouvre le Lightbox au clic
        />
      ))}
    </div>
  )
}
