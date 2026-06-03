// Footer.jsx — Pied de page du site
// Affiché sur toutes les pages SAUF la carte (/map)
// car la carte prend tout l'écran.

import React from 'react'
// useLocation permet de savoir sur quelle URL on se trouve
import { useLocation } from 'react-router-dom'

export default function Footer() {
  // pathname = chemin de l'URL actuelle, ex: "/catalogue" ou "/map"
  const { pathname } = useLocation()

  // Sur la page carte, on ne veut pas de footer (plein écran)
  if (pathname.startsWith('/map')) return null

  return (
    <footer className="footer-shell">
      <div className="container-fluid px-4">
        <div className="footer-row">

          {/* Logo / nom de la marque */}
          <div className="footer-brand">
            <span aria-hidden="true">✂</span>
            UberCut
          </div>

          {/* Copyright avec l'année automatique */}
          <p className="footer-copy">
            © {new Date().getFullYear()} UberCut · Paris · Tous droits réservés
          </p>

          {/* Liens légaux */}
          <nav className="footer-links" aria-label="Liens légaux">
            <a href="#" className="footer-link">Mentions légales</a>
            <a href="#" className="footer-link">Confidentialité</a>
            <a href="#" className="footer-link">CGU</a>
          </nav>

        </div>
      </div>
    </footer>
  )
}
