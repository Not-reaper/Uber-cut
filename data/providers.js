// data/providers.js — Base de données des coiffeurs
// Contient tous les profils coiffeurs sous forme de tableau.
// C'est la "source de vérité" : toutes les pages lisent ici.
//
// Structure des chemins d'images :
//   'providers/alexandre/avatar.jpg'
//   → /public/assets/images/providers/alexandre/avatar.jpg
//
// imageClass     : associe chaque image à sa classe CSS (images.css)
// galleryClasses : classe individuelle pour chaque photo de galerie
//
// Pour ajouter un coiffeur :
//   1. Copie un objet ci-dessous et modifie les champs
//   2. Crée le dossier /public/assets/images/providers/<slug>/
//   3. Ajoute les classes CSS dans src/styles/images.css

// Position GPS de l'utilisateur (simulée = Paris centre)
// En production, on utiliserait navigator.geolocation pour la vraie position
export const USER_LOCATION = { lat: 48.8606, lng: 2.3376 } // Paris centre

export const providers = [
  {
    id: 1,
    slug: 'alexandre',
    name: 'Alexandre Moreau',
    avatar: 'providers/alexandre/avatar.jpg',
    lat: 48.8666,
    lng: 2.3311,
    rating: 4.9,
    reviews: 234,
    priceFrom: 55,
    tier: 'premium',          // 'standard' | 'premium' | 'luxury'
    speciality: 'Coupe & Styling',
    serviceType: 'both',      // 'home' | 'salon' | 'both'
    distanceKm: 1.2,
    available: true,
    experience: '8 ans',
    phone: '06 12 34 56 78',
    city: 'Paris 1er',
    hours: 'Lun–Sam  9h–20h',
    bio: "Spécialiste des coupes modernes et colorations tendance. Formé chez Toni & Guy London, Alexandre intervient à domicile ou dans son atelier du 1er arrondissement. Chaque prestation est pensée sur mesure.",
    gallery: [
      'providers/alexandre/gallery-1.jpg',
      'providers/alexandre/gallery-2.jpg',
      'providers/alexandre/gallery-3.jpg',
      'providers/alexandre/gallery-4.jpg',
    ],
    // Classes CSS individuelles (src/styles/images.css)
    imageClass: {
      avatar:      'img-alexandre-avatar',
      cardCover:   'img-alexandre-card',
      profileHero: 'img-alexandre-hero',
    },
    galleryClasses: ['img-alexandre-g1','img-alexandre-g2','img-alexandre-g3','img-alexandre-g4'],
    services: [
      { name: 'Coupe Homme',        price: 35,  duration: '30 min' },
      { name: 'Coupe Femme',        price: 55,  duration: '45 min' },
      { name: 'Coloration Premium', price: 90,  duration: '1h30'   },
      { name: 'Balayage',           price: 130, duration: '2h'     },
    ],
    availability: [
      { day: 'Lundi',    slots: ['09:00','10:30','14:00','16:00'] },
      { day: 'Mardi',    slots: ['09:00','11:00','15:00','17:00'] },
      { day: 'Mercredi', slots: ['09:30','13:00'] },
      { day: 'Jeudi',    slots: ['10:00','14:30','16:30'] },
      { day: 'Vendredi', slots: ['09:00','11:30','14:00'] },
      { day: 'Samedi',   slots: ['10:00','12:00'] },
    ],
  },
  {
    id: 2,
    slug: 'sofia',
    name: 'Sofia Benali',
    avatar: 'providers/sofia/avatar.jpg',
    lat: 48.8529,
    lng: 2.3499,
    rating: 4.8,
    reviews: 189,
    priceFrom: 65,
    tier: 'premium',
    speciality: 'Coloriste Expert',
    serviceType: 'home',
    distanceKm: 1.8,
    available: true,
    experience: '6 ans',
    phone: '06 23 45 67 89',
    city: 'Paris 11e',
    hours: 'Mar–Dim  10h–19h',
    bio: 'Coloriste certifiée en techniques naturelles. Balayages solaires, soin kératine et couleurs végétales — Sofia se déplace uniquement chez vous, matériel pro inclus. Résultat garanti.',
    gallery: [
      'providers/sofia/gallery-1.jpg' ,
      'providers/sofia/gallery-2.jpg',
      'providers/sofia/gallery-3.jpg',
      'providers/sofia/gallery-4.jpg',
    ],
    imageClass: {
      avatar:      'img-sofia-avatar',
      cardCover:   'img-sofia-card',
      profileHero: 'img-sofia-hero',
    },
    galleryClasses: ['img-sofia-g1','img-sofia-g2','img-sofia-g3','img-sofia-g4'],
    services: [
      { name: 'Coupe + Brushing',  price: 65,  duration: '1h'    },
      { name: 'Coloration Bio',    price: 95,  duration: '1h30'  },
      { name: 'Balayage Solaire',  price: 140, duration: '2h'    },
      { name: 'Soin Kératine',     price: 110, duration: '2h'    },
    ],
    availability: [
      { day: 'Mardi',    slots: ['10:00','13:00','16:00'] },
      { day: 'Mercredi', slots: ['10:00','14:00'] },
      { day: 'Jeudi',    slots: ['11:00','15:00'] },
      { day: 'Vendredi', slots: ['10:00','13:30','17:00'] },
      { day: 'Samedi',   slots: ['10:00','13:00'] },
      { day: 'Dimanche', slots: ['11:00'] },
    ],
  },
  {
    id: 3,
    slug: 'kevin',
    name: 'Kevin Tran',
    avatar: 'providers/kevin/avatar.jpg',
    lat: 48.8716,
    lng: 2.3484,
    rating: 4.7,
    reviews: 312,
    priceFrom: 28,
    tier: 'standard',
    speciality: 'Barber Urbain',
    serviceType: 'salon',
    distanceKm: 2.1,
    available: true,
    experience: '5 ans',
    phone: '06 34 56 78 90',
    city: 'Paris 18e',
    hours: 'Lun–Sam  10h–21h',
    bio: 'Barbier urbain passionné à Montmartre. Coupes tendances, contours nets, dégradés parfaits. Ambiance authentique dans un barbershop contemporain au pied de la Butte.',
    gallery: [
      'providers/kevin/gallery-1.jpg',
      'providers/kevin/gallery-2.jpg',
      'providers/kevin/gallery-3.jpg',
      'providers/kevin/gallery-4.jpg',
    ],
    imageClass: {
      avatar:      'img-kevin-avatar',
      cardCover:   'img-kevin-card',
      profileHero: 'img-kevin-hero',
    },
    galleryClasses: ['img-kevin-g1','img-kevin-g2','img-kevin-g3','img-kevin-g4'],
    services: [
      { name: 'Coupe Homme',        price: 28, duration: '25 min' },
      { name: 'Taille Barbe',       price: 20, duration: '20 min' },
      { name: 'Coupe + Barbe',      price: 40, duration: '45 min' },
      { name: 'Dégradé Américain',  price: 28, duration: '30 min' },
    ],
    availability: [
      { day: 'Lundi',    slots: ['10:00','12:00','15:00','18:00'] },
      { day: 'Mardi',    slots: ['10:00','14:00','17:00','20:00'] },
      { day: 'Mercredi', slots: ['11:00','15:00','19:00'] },
      { day: 'Jeudi',    slots: ['10:00','13:00','16:00','19:00'] },
      { day: 'Vendredi', slots: ['10:00','14:00','18:00'] },
      { day: 'Samedi',   slots: ['10:00','12:00','14:00'] },
    ],
  },
]

// Trouve un coiffeur par son id (fonctionne avec string "1" ou number 1)
// Retourne l'objet coiffeur ou null si introuvable
export function getProviderById(id) {
  return providers.find(p => p.id === Number(id)) || null
}

// Tous les niveaux de tier possibles (utilisé pour les filtres)
export const TIERS = ['standard', 'premium', 'luxury']

// Texte affiché selon le type de service du coiffeur
export const SERVICE_TYPE_LABELS = {
  home:  'À domicile',    // le coiffeur vient chez le client
  salon: 'En salon',      // le client va au salon
  both:  'Domicile & salon', // les deux options possibles
}
