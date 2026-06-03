// services/auth.js — Authentification (connexion / inscription)
// Communique avec le backend PHP pour gérer les sessions.
// Le serveur utilise des cookies HTTP pour mémoriser la session.
//
// Résultats possibles :
//   Succès : { user: { id, email, first_name, ... } }
//   Erreur : { error: 'message d\'erreur' }

import { API_BASE_URL } from '../config/api.js'

// URL de base pour toutes les requêtes d'authentification
const BASE = `${API_BASE_URL}/auth`

// Crée un nouveau compte utilisateur
// data = { firstName, lastName, email, phone, password }
export async function register(data) {
  const res = await fetch(`${BASE}/register`, {
    method:      'POST',
    headers:     { 'Content-Type': 'application/json' },
    credentials: 'include', // le serveur peut créer un cookie de session
    body:        JSON.stringify(data),
  })
  return res.json()
}

// Connecte un utilisateur existant avec email + mot de passe
// Le serveur crée un cookie de session si les identifiants sont corrects
export async function login(email, password) {
  const res = await fetch(`${BASE}/login`, {
    method:      'POST',
    headers:     { 'Content-Type': 'application/json' },
    credentials: 'include',
    body:        JSON.stringify({ email, password }),
  })
  return res.json()
}

// Déconnecte l'utilisateur : détruit la session côté serveur
// (le cookie devient invalide)
export async function logout() {
  await fetch(`${BASE}/logout`, {
    method:      'POST',
    credentials: 'include',
  })
}

// Vérifie si une session est active (appelé au démarrage de l'app)
// Permet de rester connecté après un rechargement de la page
// Retourne { user } si session valide, { error } sinon
export async function getMe() {
  const res = await fetch(`${BASE}/me`, {
    credentials: 'include', // envoie le cookie existant
  })
  return res.json()
}
