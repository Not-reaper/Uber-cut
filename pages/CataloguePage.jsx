// pages/CataloguePage.jsx — Liste filtrée des coiffeurs (URL : /catalogue)
// Permet de rechercher, filtrer par tier/service et trier
// la liste des coiffeurs disponibles.

import React, { useMemo, useState } from 'react'
import SectionHeader from '../components/ui/SectionHeader.jsx'
import ProviderCard from '../components/providers/ProviderCard.jsx'
import { providers } from '../data/providers.js'

// Options de filtre par niveau (tier)
const TIERS = [
  { id: 'all',      label: 'Tous' },
  { id: 'premium',  label: 'Premium' },
  { id: 'luxury',   label: 'Luxe' },
  { id: 'standard', label: 'Standard' },
]

// Options de filtre par type de service
const SERVICES = [
  { id: 'all',   label: 'Tous' },
  { id: 'home',  label: 'À domicile' },
  { id: 'salon', label: 'En salon' },
  { id: 'both',  label: 'Les deux' },
]

export default function CataloguePage() {
  const [q, setQ]         = useState('')     // texte de recherche
  const [tier, setTier]   = useState('all')  // filtre niveau
  const [svcType, setSvc] = useState('all')  // filtre type de service
  const [sort, setSort]   = useState('rating') // critère de tri

  // useMemo recalcule "list" uniquement quand les filtres changent
  // Évite de refiltrer à chaque rendu React inutile
  const list = useMemo(() => {
    const qq = q.trim().toLowerCase() // texte normalisé pour la comparaison
    let arr = providers.filter(p => {
      // Filtre tier : exclure si ne correspond pas
      if (tier !== 'all' && p.tier !== tier)              return false
      // Filtre service : exclure si ne correspond pas
      if (svcType !== 'all' && p.serviceType !== svcType) return false
      // Filtre recherche : cherche dans nom, spécialité et ville
      if (qq && !(
        p.name.toLowerCase().includes(qq) ||
        p.speciality.toLowerCase().includes(qq) ||
        p.city.toLowerCase().includes(qq)
      )) return false
      return true // coiffeur passe tous les filtres → inclus
    })

    // Tri : .slice() crée une copie pour ne pas modifier le tableau original
    if (sort === 'rating')   arr = arr.slice().sort((a, b) => b.rating - a.rating)   // note décroissante
    if (sort === 'price')    arr = arr.slice().sort((a, b) => a.priceFrom - b.priceFrom) // prix croissant
    if (sort === 'distance') arr = arr.slice().sort((a, b) => a.distanceKm - b.distanceKm)
    if (sort === 'reviews')  arr = arr.slice().sort((a, b) => b.reviews - a.reviews) // plus d'avis d'abord

    return arr
  }, [q, tier, svcType, sort]) // recalcule si l'un de ces états change

  return (
    <section className="section">
      <div className="container">

        {/* ── En-tête ─────────────────────────────────────────── */}
        <div className="mb-5">
          <SectionHeader
            label="Catalogue"
            title="Nos coiffeurs experts"
            subtitle="Sélection vérifiée, profils détaillés, réservation instantanée."
          />
        </div>

        {/* ── Filtres ──────────────────────────────────────────── */}
        <div className="filters-bar mb-4">
          {/* Recherche */}
          <div className="search-field">
            <span className="search-field__icon">🔍</span>
            <input
              type="search"
              className="search-field__input"
              placeholder="Nom, spécialité, ville..."
              value={q}
              onChange={e => setQ(e.target.value)}
              aria-label="Rechercher"
            />
          </div>

          {/* Tier */}
          {TIERS.map(t => (
            <button
              key={t.id}
              className={`chip${tier === t.id ? ' is-active' : ''}`}
              onClick={() => setTier(t.id)}
            >
              {t.label}
            </button>
          ))}

          {/* Service */}
          {SERVICES.filter(s => s.id !== 'all').map(s => (
            <button
              key={s.id}
              className={`chip${svcType === s.id ? ' is-active' : ''}`}
              onClick={() => setSvc(prev => prev === s.id ? 'all' : s.id)}
            >
              {s.label}
            </button>
          ))}

          {/* Tri */}
          <select
            className="sort-select"
            value={sort}
            onChange={e => setSort(e.target.value)}
            aria-label="Trier par"
          >
            <option value="rating">Meilleure note</option>
            <option value="price">Prix croissant</option>
            <option value="distance">Distance</option>
            <option value="reviews">Nombre d'avis</option>
          </select>
        </div>

        {/* ── Résultats ─────────────────────────────────────────── */}
        <div style={{ marginBottom: 12, fontSize: 13, color: 'var(--muted-2)' }}>
          {list.length} résultat{list.length > 1 ? 's' : ''}
        </div>

        {list.length === 0 ? (
          <div className="card-u" style={{ textAlign: 'center', padding: '48px 24px' }}>
            <p style={{ fontSize: '2rem', marginBottom: 8 }}>✂</p>
            <p className="card-u__text">Aucun coiffeur ne correspond à ces critères.</p>
          </div>
        ) : (
          <div className="row g-4">
            {list.map((p, i) => (
              <div key={p.id} className={`col-md-6 col-lg-4 anim-fade-up anim-delay-${Math.min(i + 1, 4)}`}>
                <ProviderCard provider={p} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
