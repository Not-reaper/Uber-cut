// Badge.jsx — Étiquette de niveau d'un coiffeur
// Petit badge coloré affiché sur les cartes et profils :
// "Standard", "Premium" ou "Luxe".

import React from 'react'

// Correspondance entre la valeur interne et le texte affiché
const LABELS = {
  premium:  'Premium',
  luxury:   'Luxe',
  standard: 'Standard',
}

// Props :
//   variant  : 'standard' | 'premium' | 'luxury' (détermine la couleur CSS)
//   children : texte personnalisé (optionnel, sinon on utilise LABELS)
export default function Badge({ variant = 'standard', children }) {
  return (
    // La classe CSS "badge--premium", "badge--luxury" etc. applique la couleur
    <span className={`badge badge--${variant}`}>
      {/* Affiche le texte passé en children, sinon le label du registre,
          sinon la valeur brute (fallback de sécurité) */}
      {children || LABELS[variant] || variant}
    </span>
  )
}
