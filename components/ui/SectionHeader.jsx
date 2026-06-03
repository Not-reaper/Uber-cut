// SectionHeader.jsx — En-tête de section réutilisable
// Composant générique utilisé en début de chaque section
// de page pour afficher un surtitre, un titre et un sous-titre.

import React from 'react'

// Props :
//   label    : petit texte au-dessus du titre (ex: "Catalogue", "Nos services")
//   title    : titre principal h2
//   subtitle : description optionnelle sous le titre
//   align    : alignement 'left' (défaut) ou 'center'
export default function SectionHeader({ label, title, subtitle, align = 'left' }) {
  return (
    // Classe conditionnelle : centré seulement si align="center"
    <div className={`section-head${align === 'center' ? ' section-head--center' : ''}`}>
      {/* Le && empêche d'afficher un élément vide si la prop n'est pas passée */}
      {label    && <p className="section-head__label">{label}</p>}
      {title    && <h2 className="section-head__title">{title}</h2>}
      {subtitle && <p className="section-head__sub">{subtitle}</p>}
    </div>
  )
}
