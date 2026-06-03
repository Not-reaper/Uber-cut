// ProviderListItem.jsx — Élément de la liste latérale (page carte)
// Bouton cliquable représentant un coiffeur dans la sidebar
// de la page /map. Un clic sélectionne le coiffeur et affiche
// son itinéraire sur la carte.

import React from 'react'
import { useNavigate } from 'react-router-dom'
import Badge from '../ui/Badge.jsx'
import { euro } from '../../utils/format.js'
import { imageUrl } from '../../utils/imageResolver.js'

// Props :
//   provider : objet coiffeur
//   selected : true si ce coiffeur est actuellement sélectionné
//   onSelect : fonction appelée quand on clique cet élément
export default function ProviderListItem({ provider, selected, onSelect }) {
  const navigate = useNavigate()

  return (
    // Bouton qui change de style quand il est sélectionné (classe 'is-selected')
    // aria-pressed : indique au lecteur d'écran si le bouton est actif
    <button
      type="button"
      className={`plist-item${selected ? ' is-selected' : ''}`}
      onClick={() => onSelect?.(provider)}
      aria-pressed={selected}
      aria-label={`Sélectionner ${provider.name}`}
    >
      {/* Ligne principale : avatar + infos + badge */}
      <div className="plist-item__row">
        <img
          src={imageUrl(provider.avatar)}
          alt=""
          className={`plist-item__avatar ${provider.imageClass?.avatar || ''}`}
          width={46}
          height={46}
        />
        <div className="plist-item__main">
          <div className="plist-item__name">{provider.name}</div>
          <div className="plist-item__spec">{provider.speciality}</div>
          <div className="plist-item__stars">
            ★ <strong>{provider.rating.toFixed(1)}</strong>
            <span style={{ color: 'var(--muted-2)' }}> ({provider.reviews} avis)</span>
          </div>
        </div>
        <div className="plist-item__right">
          <Badge variant={provider.tier} />
          {/* Point de disponibilité (vert si disponible) */}
          <div className={`plist-item__dot${provider.available ? ' is-ok' : ''}`} />
        </div>
      </div>

      {/* Pied : distance estimée et prix minimum */}
      <div className="plist-item__foot">
        <div className="plist-item__dist">
          {/* Formule empirique : ~12 min de marche par km + 2 min */}
          {provider.distanceKm} km · ~{Math.round(provider.distanceKm * 12 + 2)} min à pied
        </div>
        <div className="plist-item__price">dès {euro(provider.priceFrom)}</div>
      </div>
    </button>
  )
}
