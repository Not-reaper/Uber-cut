// Navbar.jsx — Barre de navigation en haut de chaque page
// Affiche les liens de navigation et change les boutons
// selon que l'utilisateur est connecté ou non.
 
import React from 'react'
// NavLink : comme <Link> mais ajoute une classe CSS quand le lien est actif
// useNavigate : permet de naviguer vers une autre page par code
import { NavLink, useNavigate } from 'react-router-dom'
// useAuth : donne accès à l'utilisateur connecté et à la fonction logout
import { useAuth } from '../../context/AuthContext.jsx'

export default function Navbar() {
  // user = objet utilisateur si connecté, null sinon
  // logout = fonction pour déconnecter l'utilisateur
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  // Appelé quand on clique sur "Déconnexion"
  function handleLogout() {
    logout()           // supprime la session
    navigate('/')      // redirige vers la page d'accueil
  }

  return (
    <header className="nav-shell">
      <div className="container-fluid px-4">
        <div className="nav-row">

          {/* Logo cliquable qui ramène à l'accueil */}
          <NavLink to="/" className="brand" aria-label="UberCut — Accueil">
            <span className="brand__mark" aria-hidden="true">✂</span>
            <span className="brand__name">UberCut</span>
          </NavLink>

          {/* Liens de navigation principale */}
          <nav className="nav-links" aria-label="Navigation principale">
            {/* "end" sur "/" empêche ce lien d'être actif sur toutes les pages */}
            <NavLink
              to="/"
              end
              className={({ isActive }) => `nav-link-u${isActive ? ' is-active' : ''}`}
            >
              Accueil
            </NavLink>
            <NavLink
              to="/map"
              className={({ isActive }) => `nav-link-u${isActive ? ' is-active' : ''}`}
            >
              Carte
            </NavLink>
            <NavLink
              to="/catalogue"
              className={({ isActive }) => `nav-link-u${isActive ? ' is-active' : ''}`}
            >
              Coiffeurs
            </NavLink>
            <NavLink
              to="/contact"
              className={({ isActive }) => `nav-link-u${isActive ? ' is-active' : ''}`}
            >
              Contact
            </NavLink>
          </nav>

          {/* Boutons à droite : change selon si l'utilisateur est connecté */}
          <div className="nav-actions">
            {user ? (
              // Utilisateur connecté → "Mon profil" + "Déconnexion"
              <>
                <NavLink to="/profile" className="btn-u btn-u--ghost btn-u--sm">
                  Mon profil
                </NavLink>
                <button onClick={handleLogout} className="btn-u btn-u--primary btn-u--sm">
                  Déconnexion
                </button>
              </>
            ) : (
              // Utilisateur non connecté → "Connexion" + "Inscription"
              <>
                <NavLink to="/login" className="btn-u btn-u--ghost btn-u--sm">
                  Connexion
                </NavLink>
                <NavLink to="/register" className="btn-u btn-u--primary btn-u--sm">
                  Inscription
                </NavLink>
              </>
            )}
          </div>

        </div>
      </div>
    </header>
  )
}
