// AppLayout.jsx — Structure commune à toutes les pages
// Ce composant "enveloppe" chaque page : il ajoute
// automatiquement la barre de navigation et le footer.

import React from 'react'
import Navbar from './Navbar.jsx'
import Footer from './Footer.jsx'

// { children } représente le contenu de la page qui sera affiché
// entre la navbar et le footer (HomePage, MapPage, etc.)
export default function AppLayout({ children }) {
  return (
    <div className="app-root">
      {/* Barre de navigation en haut */}
      <Navbar />
      {/* <main> contient le contenu principal de la page */}
      <main className="app-main">{children}</main>
      {/* Pied de page en bas */}
      <Footer />
    </div>
  )
}
