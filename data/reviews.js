// data/reviews.js — Avis clients par coiffeur
// Les avis sont indexés par l'id du coiffeur (1, 2, 3…).
// daysAgo = nombre de jours depuis l'avis (affiché en relatif)

// Objet dont les clés sont les ids des coiffeurs
// Ex: reviewsByProviderId[1] → tableau des avis d'Alexandre
export const reviewsByProviderId = {
  1: [
    { name: 'Marie L.',   text: 'Exactement ce que je voulais, coupe impeccable. Alexandre sait vraiment écouter.',  stars: 5, daysAgo: 1 },
    { name: 'Thomas G.',  text: 'Super pro, ponctuel et très doué. Mon coiffeur attitré depuis 2 ans maintenant.',  stars: 5, daysAgo: 2 },
    { name: 'Julie D.',   text: 'Résultat parfait, je recommande les yeux fermés. La coloration tient super bien.',  stars: 5, daysAgo: 4 },
    { name: 'Camille F.', text: 'Très à l\'écoute pour le balayage, conseils au top. Je reviendrai sans hésiter.', stars: 4, daysAgo: 7 },
  ],
  2: [
    { name: 'Camille R.', text: 'Sofia est incroyable, ma coloration est magnifique ! Elle se déplace à l\'heure et avec tout le matos.', stars: 5, daysAgo: 1 },
    { name: 'Pierre M.',  text: 'Très à l\'écoute, conseils précieux et travail soigné. La kératine est top.',      stars: 5, daysAgo: 3 },
    { name: 'Sarah K.',   text: 'La meilleure coloriste que j\'aie eue. Merci Sofia, vivement la prochaine fois !', stars: 5, daysAgo: 5 },
  ],
  3: [
    { name: 'Luc B.',   text: 'Kevin est un artiste, dégradé parfait du premier coup. Ambiance super en plus.', stars: 5, daysAgo: 1 },
    { name: 'Amine T.', text: 'Dégradé nickel, ambiance top. Mon barbier parisien depuis 1 an !',               stars: 5, daysAgo: 2 },
    { name: 'Romain C.', text: 'Barbier sérieux, précis et sympa. Prix honnêtes pour Paris.',                   stars: 4, daysAgo: 6 },
  ],
}
