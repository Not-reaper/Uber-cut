// ProviderCard.jsx — Carte cliquable d'un coiffeur
// Utilisée dans la page d'accueil et le catalogue.
// Un clic navigue vers le profil complet du coiffeur.

import React from 'react'
import { useNavigate } from 'react-router-dom'
import Badge from '../ui/Badge.jsx'
import { euro } from '../../utils/format.js'
import { imageUrl } from '../../utils/imageResolver.js'

// Props : provider = objet coiffeur complet depuis data/providers.js
export default function ProviderCard({ provider }) {
  const navigate = useNavigate()
  // Prend la 1ère photo de la galerie comme image de couverture de la carte
  const coverSrc = imageUrl(provider.gallery?.[0])

  return (
    // <article> sémantique pour un élément de contenu indépendant
    // onClick : naviguer vers /providers/1, /providers/2, etc.
    // tabIndex & onKeyDown : accessibilité clavier (touche Entrée)
    <article
      className="provider-card"
      onClick={() => navigate(`/providers/${provider.id}`)}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && navigate(`/providers/${provider.id}`)}
      aria-label={`Voir le profil de ${provider.name}`}
    >
      {/* Zone image en haut de la carte */}
      <div className="provider-card__media">
        <img
          src={coverSrc}
          alt=""
          className={`provider-card__cover ${provider.imageClass?.cardCover || ''}`}
        />
        {/* Dégradé sombre pour lisibilité du texte sur l'image */}
        <div className="provider-card__fade" aria-hidden="true" />
        {/* Badge "Premium", "Luxe" ou "Standard" en haut à droite */}
        <div className="provider-card__tier">
          <Badge variant={provider.tier} />
        </div>
        {/* Point vert/rouge de disponibilité */}
        <div
          className={`provider-card__avail ${provider.available ? 'is-ok' : 'is-off'}`}
          aria-label={provider.available ? 'Disponible' : 'Indisponible'}
        />
      </div>

      {/* Informations textuelles sous l'image */}
      <div className="provider-card__body">
        <div className="provider-card__name">{provider.name}</div>
        <div className="provider-card__spec">{provider.speciality} · {provider.city}</div>

        {/* Note et prix sur la même ligne */}
        <div className="provider-card__meta">
          <div className="provider-card__rating">
            <span className="provider-card__star">★</span>
            <span className="provider-card__rating-val">{provider.rating.toFixed(1)}</span>
            {/* toFixed(1) = 1 décimale, ex: 4.9 */}
            <span style={{ color: 'var(--muted-2)', fontSize: 12 }}>({provider.reviews})</span>
          </div>
          <div className="provider-card__price">dès {euro(provider.priceFrom)}</div>
        </div>
      </div>
    </article>
  )
}
