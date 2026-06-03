// pages/ProviderProfilePage.jsx — Profil d'un coiffeur (URL : /providers/:id)
// Page détaillée avec toutes les informations du coiffeur :
//   - Bannière hero avec photo et infos rapides
//   - Bio, prestations, disponibilités, galerie, avis
//   - Panneau de réservation (colonne droite sticky)
// L'id vient de l'URL : /providers/1 → id = "1"

import React, { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import { getProviderById, SERVICE_TYPE_LABELS } from '../data/providers.js'
import { reviewsByProviderId } from '../data/reviews.js'
import { euro, daysAgo } from '../utils/format.js'
import { imageUrl } from '../utils/imageResolver.js'
import Badge from '../components/ui/Badge.jsx'
import Gallery from '../components/media/Gallery.jsx'
import Lightbox from '../components/media/Lightbox.jsx'
import BookingPanel from '../components/providers/BookingPanel.jsx'

export default function ProviderProfilePage() {
  // useParams récupère les paramètres de l'URL (:id → { id: "1" })
  const { id } = useParams()
  // Cherche le coiffeur dans les données locales (évite le recalcul avec useMemo)
  const provider = useMemo(() => getProviderById(id), [id])
  // État de la lightbox (fenêtre image plein écran)
  const [lb, setLb] = useState({ open: false, src: '' })

  // Si l'id ne correspond à aucun coiffeur connu → page 404 intégrée
  if (!provider) {
    return (
      <section className="section">
        <div className="container">
          <div className="not-found">
            <div className="not-found__num">404</div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem' }}>Profil introuvable</h1>
            <p style={{ color: 'var(--muted)' }}>Ce coiffeur n'existe pas ou a été retiré du catalogue.</p>
            <Link className="btn-u btn-u--primary" to="/catalogue">← Retour au catalogue</Link>
          </div>
        </div>
      </section>
    )
  }

  // Avis clients de ce coiffeur (tableau vide si aucun avis)
  const reviews = reviewsByProviderId[provider.id] || []
  // Calcul de la note moyenne : somme des étoiles / nombre d'avis
  // Si pas d'avis locaux, on utilise la note stockée dans les données
  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.stars, 0) / reviews.length).toFixed(1)
    : provider.rating.toFixed(1)

  return (
    <section className="section section--light">
      <div className="container">

        {/* ── Retour ────────────────────────────────────────────── */}
        <div className="mb-4">
          <Link to="/catalogue" className="btn-u btn-u--ghost btn-u--sm">
            ← Retour au catalogue
          </Link>
        </div>

        {/* ── Hero bannière ──────────────────────────────────────── */}
        <div className="profile-hero mb-4 anim-fade-in">
          <img
            src={imageUrl(provider.gallery?.[0])}
            alt=""
            className={`profile-hero__img ${provider.imageClass?.profileHero || ''}`}
          />
          <div className="profile-hero__overlay" aria-hidden="true" />
          <div className="profile-hero__content">
            <img
              src={imageUrl(provider.avatar)}
              alt={`Photo de ${provider.name}`}
              className={`profile-hero__avatar ${provider.imageClass?.avatar || ''}`}
            />
            <div>
              <h1 className="profile-hero__name">{provider.name}</h1>
              <div className="profile-hero__spec">{provider.speciality}</div>
              <div className="profile-hero__meta">
                <span>📍 {provider.city}</span>
                <span>★ {provider.rating.toFixed(1)} ({provider.reviews} avis)</span>
                <span>⏱ {provider.experience} d'expérience</span>
                <Badge variant={provider.tier} />
              </div>
            </div>
          </div>
        </div>

        {/* ── Contenu principal ──────────────────────────────────── */}
        <div className="row g-4">

          {/* Colonne gauche */}
          <div className="col-lg-8">

            {/* À propos */}
            <div className="card-u mb-4">
              <div className="card-u__head">À propos</div>
              <p className="card-u__text">{provider.bio}</p>

              <div className="row g-3 mt-1">
                <div className="col-6 col-sm-3">
                  <div style={{ fontSize: 11, color: 'var(--muted-2)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.8px', marginBottom: 4 }}>
                    Service
                  </div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>
                    {SERVICE_TYPE_LABELS[provider.serviceType]}
                  </div>
                </div>
                <div className="col-6 col-sm-3">
                  <div style={{ fontSize: 11, color: 'var(--muted-2)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.8px', marginBottom: 4 }}>
                    Expérience
                  </div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{provider.experience}</div>
                </div>
                <div className="col-6 col-sm-3">
                  <div style={{ fontSize: 11, color: 'var(--muted-2)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.8px', marginBottom: 4 }}>
                    Horaires
                  </div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{provider.hours}</div>
                </div>
                <div className="col-6 col-sm-3">
                  <div style={{ fontSize: 11, color: 'var(--muted-2)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.8px', marginBottom: 4 }}>
                    Note
                  </div>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>★ {avgRating}</div>
                </div>
              </div>
            </div>

            {/* Prestations & tarifs */}
            <div className="card-u mb-4">
              <div className="card-u__head">Prestations & Tarifs</div>
              <div className="svc-list">
                {provider.services.map(s => (
                  <div key={s.name} className="svc-row">
                    <div>
                      <div className="svc-row__name">{s.name}</div>
                      <div className="svc-row__dur">⏱ {s.duration}</div>
                    </div>
                    <div className="svc-row__price">{euro(s.price)}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Disponibilités */}
            {provider.availability && (
              <div className="card-u mb-4">
                <div className="card-u__head">Disponibilités cette semaine</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {provider.availability.map(({ day, slots }) => (
                    <div key={day}>
                      <div style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--muted)', marginBottom: 8 }}>
                        {day}
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                        {slots.map(slot => (
                          <span
                            key={slot}
                            className="chip"
                            style={{ padding: '6px 14px', fontSize: 13, cursor: 'default' }}
                          >
                            {slot}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Galerie */}
            <div className="card-u mb-4">
              <div className="card-u__head">Galerie ({provider.gallery.length} photos)</div>
              <Gallery
                images={provider.gallery}
                classes={provider.galleryClasses}
                onOpen={src => setLb({ open: true, src })}
              />
            </div>

            {/* Avis */}
            <div className="card-u">
              <div className="card-u__head">
                Avis clients ({reviews.length})
                {reviews.length > 0 && (
                  <span style={{ marginLeft: 10, fontFamily: 'var(--font-body)', fontWeight: 700, color: 'var(--text)' }}>
                    ★ {avgRating}
                  </span>
                )}
              </div>
              {reviews.length === 0 ? (
                <p className="card-u__text">Aucun avis pour le moment.</p>
              ) : (
                <div className="reviews">
                  {reviews.map((r, i) => (
                    <div key={i} className="review">
                      <div className="review__top">
                        <div className="review__name">{r.name}</div>
                        <div className="review__stars">{'★'.repeat(r.stars)}{'☆'.repeat(5 - r.stars)}</div>
                        <div className="review__date">{daysAgo(r.daysAgo)}</div>
                      </div>
                      <div className="review__text">{r.text}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Colonne droite — Sticky booking */}
          <div className="col-lg-4">
            <div className="sticky-col">
              <BookingPanel provider={provider} />

              <Link
                to="/map"
                className="btn-u btn-u--ghost w-100 mb-3"
                style={{ justifyContent: 'center' }}
              >
                Voir sur la carte
              </Link>

              {/* Résumé stats */}
              <div className="card-u">
                <div className="card-u__head">En bref</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {[
                    { label: 'Note', value: `★ ${provider.rating.toFixed(1)} / 5` },
                    { label: 'Avis', value: `${provider.reviews} clients` },
                    { label: 'Expérience', value: provider.experience },
                    { label: 'Spécialité', value: provider.speciality },
                    { label: 'Service', value: SERVICE_TYPE_LABELS[provider.serviceType] },
                  ].map(({ label, value }) => (
                    <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                      <span style={{ color: 'var(--muted-2)' }}>{label}</span>
                      <span style={{ fontWeight: 600 }}>{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <Lightbox
          open={lb.open}
          src={lb.src}
          onClose={() => setLb({ open: false, src: '' })}
        />
      </div>
    </section>
  )
}
