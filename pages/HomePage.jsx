// pages/HomePage.jsx — Page d'accueil (URL : /)
// Contient 4 sections :
//   1. Hero (titre + image + stats)
//   2. Prestations (grille de services)
//   3. Coiffeurs recommandés (3 premières fiches)
//   4. Comment ça marche (3 étapes)
//   5. CTA band (appel à l'action final)

import React from 'react'
import { Link } from 'react-router-dom'
import SectionHeader from '../components/ui/SectionHeader.jsx'
import ProviderCard from '../components/providers/ProviderCard.jsx'
import ImageAsset from '../components/media/ImageAsset.jsx'
import { providers } from '../data/providers.js'

export default function HomePage() {
  // Affiche uniquement les 3 premiers coiffeurs en "sélection"
  const featured = providers.slice(0, 3)

  return (
    <>
      {/* ── Hero ───────────────────────────────────────────────── */}
      <section className="hero">
        <div className="container">
          <div className="row align-items-center gy-5">

            {/* Texte */}
            <div className="col-lg-6">
              <div className="hero__badge anim-fade-up">Disponible maintenant à Paris</div>

              <h1 className="hero__title anim-fade-up anim-delay-1">
                Le style,<br />
                <em>sans compromis.</em>
              </h1>

              <p className="hero__sub anim-fade-up anim-delay-2">
                Coupes, dégradés et soins d'excellence à domicile ou en salon.
                Repérez votre expert sur la carte et réservez en 60 secondes.
              </p>

              <div className="hero__cta anim-fade-up anim-delay-3">
                <Link to="/map" className="btn-u btn-u--primary btn-u--lg">
                  Trouver un coiffeur
                </Link>
                <Link to="/catalogue" className="btn-u btn-u--ghost btn-u--lg">
                  Voir le catalogue
                </Link>
              </div>

              {/* Stats */}
              <div className="stats anim-fade-up anim-delay-4">
                <div className="stats__item">
                  <div className="stats__num">120+</div>
                  <div className="stats__lbl">Experts certifiés</div>
                </div>
                <div className="stats__item">
                  <div className="stats__num">4.9★</div>
                  <div className="stats__lbl">Note moyenne</div>
                </div>
                <div className="stats__item">
                  <div className="stats__num">8 500</div>
                  <div className="stats__lbl">Clients satisfaits</div>
                </div>
                <div className="stats__item">
                  <div className="stats__num">30 min</div>
                  <div className="stats__lbl">Délai moyen</div>
                </div>
              </div>
            </div>

            {/* Image hero */}
            <div className="col-lg-6">
              <div className="hero-card anim-scale-in anim-delay-2">
                <ImageAsset imgKey="homeHero" className="img-home-hero" />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Prestations ────────────────────────────────────────── */}
      <section className="section section--light">
        <div className="container">
          <div className="d-flex align-items-end justify-content-between flex-wrap gap-3 mb-4">
            <SectionHeader
              label="Nos services"
              title="Tout ce dont vous avez besoin"
            />
            <Link to="/catalogue" className="btn-u btn-u--ghost btn-u--sm">
              Explorer le catalogue →
            </Link>
          </div>

          <div className="svc-grid">
            {[
              { label: 'Coupe',      sub: 'dès 20 €', to: '/catalogue' },
              { label: 'Barbe',      sub: 'dès 15 €', to: '/catalogue' },
              { label: 'Coloration', sub: 'dès 55 €', to: '/catalogue' },
              { label: 'Soin',       sub: 'dès 30 €', to: '/catalogue' },
              { label: 'À domicile', sub: '+ déplacement', to: '/map'  },
              { label: 'Carte live', sub: 'temps réel',    to: '/map'  },
            ].map(({ label, sub, to }) => (
              <Link key={label} to={to} className="svc-tile">
                {label}
                <span>{sub}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Coiffeurs recommandés ───────────────────────────────── */}
      <section className="section">
        <div className="container">
          <div className="d-flex align-items-end justify-content-between flex-wrap gap-3 mb-4">
            <SectionHeader
              label="Sélection"
              title="Nos experts recommandés"
              subtitle="Coiffeurs vérifiés, notés 4.7+ et disponibles dès maintenant."
            />
            <Link to="/catalogue" className="btn-u btn-u--ghost btn-u--sm">
              Voir tous →
            </Link>
          </div>

          <div className="row g-4">
            {featured.map((p, i) => (
              <div key={p.id} className={`col-md-4 anim-fade-up anim-delay-${i + 1}`}>
                <ProviderCard provider={p} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Comment ça marche ───────────────────────────────────── */}
      <section className="section section--grey">
        <div className="container">
          <SectionHeader
            label="Processus"
            title="Réservation en 3 étapes"
            align="center"
          />

          <div className="row g-4 mt-2">
            {[
              { step: '01', title: 'Géolocalisation', text: "Ouvrez la carte interactive. Votre position est détectée automatiquement pour afficher les coiffeurs à proximité." },
              { step: '02', title: 'Choisir un expert', text: "Parcourez les profils, comparez les avis et prestations, consultez les disponibilités en temps réel." },
              { step: '03', title: 'Réserver', text: "Confirmez votre créneau en 60 secondes. Recevez une confirmation immédiate et un rappel la veille." },
            ].map(({ step, title, text }, i) => (
              <div key={step} className={`col-md-4 anim-fade-up anim-delay-${i + 1}`}>
                <div className="card-u h-100">
                  <div style={{ fontSize: '2rem', fontFamily: 'var(--font-display)', fontWeight: 700, letterSpacing: '-0.04em', color: 'var(--border-2)', marginBottom: 12 }}>
                    {step}
                  </div>
                  <div style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: 8 }}>{title}</div>
                  <p className="card-u__text" style={{ marginTop: 0 }}>{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Band ───────────────────────────────────────────── */}
      <section className="cta-band">
        <div className="container">
          <div className="row justify-content-center text-center">
            <div className="col-lg-7">
              <div className="cta-band__label">Commencer</div>
              <h2 className="cta-band__title">
                Trouvez votre coiffeur<br />en 30 secondes
              </h2>
              <p className="cta-band__sub">
                Géolocalisation, carte interactive et réservation instantanée.
                Votre expert idéal est plus proche que vous ne le pensez.
              </p>
              <div className="cta-band__actions" style={{ justifyContent: 'center' }}>
                <Link to="/map" className="btn-u btn-u--primary btn-u--lg">
                  Ouvrir la carte
                </Link>
                <Link to="/contact" className="btn-u btn-u--ghost btn-u--lg">
                  Nous contacter
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section> 
    </>
  )
}
