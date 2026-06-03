// services/appointments.js — Gestion des rendez-vous (API)
// Toutes les fonctions qui communiquent avec le serveur
// pour les rendez-vous sont ici.
// "credentials: 'include'" envoie le cookie de session
// pour que le serveur sache qui est connecté.

import { API_BASE_URL } from '../config/api.js'

// URL de base pour toutes les requêtes rendez-vous
const BASE = `${API_BASE_URL}/appointments`

// Récupère la liste des rendez-vous de l'utilisateur connecté
// Retourne { appointments: [...] }
export async function getAppointments() {
  const res = await fetch(BASE, {
    credentials: 'include', // envoie le cookie de session
  })
  return res.json() // convertit la réponse JSON en objet JS
}

// Crée un nouveau rendez-vous
// data = { hairdresser_id, service_name, price, date, time, location }
// Retourne { appointment } si succès, { error } si échec
export async function createAppointment(data) {
  const res = await fetch(BASE, {
    method:      'POST',
    headers:     { 'Content-Type': 'application/json' }, // format d'envoi
    credentials: 'include',
    body:        JSON.stringify(data), // convertit l'objet JS en texte JSON
  })
  return res.json()
}

// Annule un rendez-vous existant par son identifiant
// Retourne { success } ou { error }
export async function cancelAppointment(id) {
  const res = await fetch(`${BASE}/${id}`, {
    method:      'DELETE', // méthode HTTP pour supprimer
    credentials: 'include',
  })
  return res.json()
}
