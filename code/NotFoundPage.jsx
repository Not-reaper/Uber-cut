// pages/NotFoundPage.jsx — Page 404 (URL : toute URL inconnue)
// Affichée quand l'utilisateur tape une URL qui n'existe pas.
// Définie avec path="*" dans App.jsx (wildcard = tout le reste).

import React from 'react'
import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <section className="section">
      <div className="container">
        <div className="not-found">
          <div className="not-found__num">404</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', letterSpacing: '-0.03em' }}>
            Page introuvable
          </h1>
          <p style={{ color: 'var(--muted)', maxWidth: '40ch', textAlign: 'center' }}>
            La page que vous cherchez n'existe pas ou a été déplacée.
          </p>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
            <Link to="/" className="btn-u btn-u--primary">Retour à l'accueil</Link>
            <Link to="/catalogue" className="btn-u btn-u--ghost">Voir le catalogue</Link>
          </div>
        </div>
      </div>
    </section>
  )
}
