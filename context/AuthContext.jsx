// AuthContext.jsx — Gestion de la session utilisateur
// Le "contexte" React permet de partager des données entre
// tous les composants sans passer des props manuellement.
// Ici, il partage : l'utilisateur connecté, setUser, logout.

import React, { createContext, useContext, useState, useEffect } from 'react'
// getMe vérifie si une session est active au chargement de l'app
// apiLogout détruit la session côté serveur
import { getMe, logout as apiLogout } from '../services/auth'

// Crée le contexte (une sorte de "variable globale" pour React)
const AuthContext = createContext(null)

// AuthProvider : enveloppe l'app et rend user/setUser/logout disponibles partout
export function AuthProvider({ children }) {
  // user = null si non connecté, objet { id, email, first_name… } si connecté
  const [user, setUser] = useState(null)
  // loading = true pendant la vérification initiale de la session
  const [loading, setLoading] = useState(true)

  // Au premier chargement, on vérifie si l'utilisateur a déjà une session active
  useEffect(() => {
    getMe().then(data => {
      setUser(data.user || null) // null si pas de session
      setLoading(false)          // la vérification est terminée
    })
  }, []) // [] = s'exécute une seule fois au montage du composant

  // Déconnexion : appel API + reset du state local
  function logout() {
    apiLogout().then(() => setUser(null))
  }

  return (
    // .Provider rend les valeurs accessibles à tous les composants enfants
    <AuthContext.Provider value={{ user, setUser, logout, loading }}>
      {/* On n'affiche rien tant que la session n'est pas vérifiée
          (évite un flash de contenu non connecté au rechargement) */}
      {!loading && children}
    </AuthContext.Provider>
  )
}

// Hook personnalisé pour utiliser facilement le contexte dans n'importe quel composant
// Usage : const { user, logout } = useAuth()
export function useAuth() {
  return useContext(AuthContext)
}
