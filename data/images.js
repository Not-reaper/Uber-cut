// data/images.js — Registre centralisé des images statiques
// Chaque image est référencée ici avec son chemin, son texte
// alternatif (accessibilité) et sa classe CSS.
//
// Pour changer une image :
//   1. Modifie "src" ici
//   2. Remplace le fichier dans /public/assets/images/
//
// Pour modifier le recadrage/style :
//   → Modifie la classe dans src/styles/images.css

export const images = {
  // Logo SVG de la marque
  brandMark: {
    src: 'placeholders/brand-mark.svg',
    alt: 'UberCut',
    className: 'img-brand-mark',
  },
  // Grande image d'ambiance sur la page d'accueil
  homeHero: {
    src: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=900&q=85&auto=format&fit=crop',
    alt: 'Coiffeur UberCut — mise en scène premium',
    className: 'img-home-hero',
  },
}
