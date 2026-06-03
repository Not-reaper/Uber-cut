// services/user.js — Gestion du profil utilisateur (API)
// Fonctions pour lire et modifier les informations du profil
// de l'utilisateur connecté.

import { API_BASE_URL } from '../config/api.js'

const BASE = `${API_BASE_URL}/user`

// Récupère les informations du profil de l'utilisateur connecté
// Retourne { user: { id, email, first_name, last_name, phone, ... } }
export async function getProfile() {
  const res = await fetch(`${BASE}/profile`, {
    credentials: 'include',
  })
  return res.json()
}

// Met à jour les informations du profil
// data = { firstName, lastName, phone, newPassword }
// newPassword vide = pas de changement de mot de passe
// Retourne { user } si succès, { error } si échec
export async function updateProfile(data) {
  const res = await fetch(`${BASE}/profile`, {
    method:      'PUT', // PUT = mise à jour d'une ressource existante
    headers:     { 'Content-Type': 'application/json' },
    credentials: 'include',
    body:        JSON.stringify(data),
  })
  return res.json()
}
