// utils/format.js — Fonctions de formatage d'affichage
// Petites fonctions utilitaires pour formater les données
// avant de les afficher à l'utilisateur.

// Formate un nombre en euros avec le symbole €
// Exemples : euro(55) → "55 €"  |  euro(130) → "130 €"
export function euro(n) {
  return `${n} €`
}

// Formate un nombre de jours en texte relatif lisible
// Exemples : daysAgo(0) → "aujourd'hui"
//            daysAgo(1) → "il y a 1 jour"
//            daysAgo(7) → "il y a 7 jours"
export function daysAgo(n) {
  if (n === 0) return "aujourd'hui"
  if (n === 1) return 'il y a 1 jour'
  return `il y a ${n} jours`
}
