// Lightbox.jsx — Affichage d'une image en plein écran
// Une "lightbox" est une fenêtre modale sombre qui montre
// une image agrandie. Elle se ferme en cliquant en dehors
// ou en appuyant sur la touche Echap.

import React, { useEffect } from 'react'

// Props :
//   open    : true = lightbox visible, false = cachée
//   src     : URL de l'image à afficher en grand
//   onClose : fonction appelée pour fermer la lightbox
export default function Lightbox({ open, src, onClose }) {

  // Écouter la touche Escape pour fermer la lightbox au clavier
  useEffect(() => {
    if (!open) return // ne rien faire si la lightbox est fermée
    const handler = e => { if (e.key === 'Escape') onClose?.() }
    // Ajouter l'écouteur d'événement quand la lightbox s'ouvre
    document.addEventListener('keydown', handler)
    // Retirer l'écouteur quand la lightbox se ferme (nettoyage)
    return () => document.removeEventListener('keydown', handler)
  }, [open, onClose])

  // Ne rien afficher si fermée ou sans image
  if (!open || !src) return null

  return (
    // Fond sombre cliquable : un clic en dehors de l'image ferme la lightbox
    <div
      className="lightbox-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Image en grand"
      onClick={onClose}
    >
      {/* e.stopPropagation() empêche le clic sur l'image de fermer la lightbox */}
      <img
        src={src}
        alt="Vue agrandie"
        className="lightbox-img"
        onClick={e => e.stopPropagation()}
      />
      {/* Bouton ✕ pour fermer */}
      <button
        className="lightbox-close"
        onClick={onClose}
        aria-label="Fermer"
      >
        ✕
      </button>
    </div>
  )
}
