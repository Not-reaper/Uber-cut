// RoutePanel.jsx — Panneau d'itinéraire sur la page carte
// Affiché quand l'utilisateur sélectionne un coiffeur.
// Permet de choisir la direction (aller/venir), affiche
// les temps de trajet et lance la simulation animée.

import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
// Hook qui calcule distance et temps de trajet entre deux GPS
import { useRoute } from '../../hooks/useRoute.js'
import { imageUrl } from '../../utils/imageResolver.js'
import { euro } from '../../utils/format.js'
// Coordonnées GPS de l'utilisateur (Paris centre par défaut)
import { USER_LOCATION } from '../../data/providers.js'

// Props :
//   provider         : objet coiffeur sélectionné
//   onClose          : ferme le panneau
//   onSimulate       : lance l'animation sur la carte
//   simulationActive : true si une simulation est en cours
export default function RoutePanel({ provider, onClose, onSimulate, simulationActive }) {
  // direction : 'go' = j'y vais | 'come' = il vient chez moi
  const [direction, setDirection] = useState('go')
  const navigate = useNavigate()

  // Selon la direction choisie, départ et arrivée s'inversent
  const from = direction === 'go'
    ? USER_LOCATION                            // départ = ma position
    : { lat: provider.lat, lng: provider.lng } // départ = le coiffeur
  const to = direction === 'go'
    ? { lat: provider.lat, lng: provider.lng } // arrivée = le coiffeur
    : USER_LOCATION                            // arrivée = ma position

  // Calcul des temps de trajet (marche, vélo, voiture)
  const route = useRoute(from, to)
  // Le coiffeur peut venir à domicile seulement si son service le permet
  const canCome = provider.serviceType === 'home' || provider.serviceType === 'both'

  return (
    <div className="route-panel">
      <div className="route-panel__header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <img
            src={imageUrl(provider.avatar)}
            alt=""
            className={`plist-item__avatar ${provider.imageClass?.avatar || ''}`}
            width={38}
            height={38}
            style={{ borderRadius: 'var(--radius-sm)', objectFit: 'cover', flexShrink: 0 }}
          />
          <div>
            <div className="route-panel__title">{provider.name}</div>
            <div style={{ fontSize: 12, color: 'var(--muted-2)' }}>{provider.speciality}</div>
          </div>
        </div>
        <button className="route-panel__close" onClick={onClose} aria-label="Fermer le panneau">✕</button>
      </div>

      <div className="route-panel__mode">
        <button
          className={`route-mode-btn${direction === 'go' ? ' is-active' : ''}`}
          onClick={() => setDirection('go')}
          disabled={simulationActive}
        >
          Je me déplace
        </button>
        <button
          className={`route-mode-btn${direction === 'come' ? ' is-active' : ''}`}
          onClick={() => setDirection('come')}
          disabled={!canCome || simulationActive}
          title={canCome ? '' : 'Ce coiffeur ne se déplace pas à domicile'}
          style={{ opacity: canCome ? 1 : 0.4 }}
        >
          Il vient chez moi
        </button>
      </div>

      {route && (
        <>
          <div className="route-panel__times">
            <div className="route-time">
              <span className="route-time__icon">🚶</span>
              <div className="route-time__val">{route.walk} min</div>
              <div className="route-time__lbl">À pied</div>
            </div>
            <div className="route-time">
              <span className="route-time__icon">🚲</span>
              <div className="route-time__val">{route.bike} min</div>
              <div className="route-time__lbl">Vélo</div>
            </div>
            <div className="route-time">
              <span className="route-time__icon">🚗</span>
              <div className="route-time__val">{route.car} min</div>
              <div className="route-time__lbl">Voiture</div>
            </div>
          </div>
          <div className="route-panel__dist">
            Distance estimée : <strong>{route.distKm} km</strong> à vol d'oiseau
          </div>
        </>
      )}

      <div className="route-panel__cta">
        <button
          className="btn-u btn-u--primary"
          style={{ width: '100%', marginTop: 8 }}
          disabled={simulationActive}
          onClick={() => onSimulate?.(direction)}
        >
          {simulationActive
            ? '⏳ Simulation en cours…'
            : (direction === 'come' ? '▶ Simuler l\'arrivée du coiffeur' : '▶ Simuler mon trajet')}
        </button>
        <button
          className="btn-u btn-u--ghost"
          style={{ width: '100%', marginTop: 6, fontSize: 12.5 }}
          onClick={() => navigate(`/providers/${provider.id}`)}
        >
          Voir le profil complet →
        </button>
      </div>
    </div>
  )
}
