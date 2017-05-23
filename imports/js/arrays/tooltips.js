// Write the keys in lowercase
const generalTooltips = {
  'revenus annuels bruts': 'La somme de votre salaire, et toute autre source de revenus',
  'fonds propres': 'Vos économies, prévoyance et dons de tiers que vous allez engager dans le projet',
  "prix d'achat maximal": 'La bien le plus cher que vous pouvez acquérir avec les informations données',
  "prix d'achat": 'La valeur du bien que vus voulez acquérir',

  finma: 'Autorité fédérale de surveillance des marchés financiers',

  'charges/revenus': "Ne doit pas dépasser 33%, exceptions jusqu'à 38%",
  "ratio d'endettement": "Ne doit pas dépasser 33%, exceptions jusqu'à 38%",

  "emprunt/prix d'achat": 'Ne doit pas dépasser 80% dans la majorité des cas',
  'emprunt/valeur du bien': 'Ne doit pas dépasser 80% dans la majorité des cas',

  'frais de notaire': "Frais obligatoires lorsqu'on conclut un prêt hypothécaire - 5% du prix d'achat.",
  'frais retrait lpp': 'Lorsque vous retirez votre lpp en avance, vous devez payer des impôts sur ce retrait.',
  'travaux de plus-value': 'Ajoutent de la valeur au bien, sans augmenter les frais de notaire',
  expertise: 'Vérification de la valeur du bien par rapport à son état et son emplacement',
  'nb. de prêteurs potentiels': 'La quantité de prêteurs e-Potek dont les conditions correspondent à votre dossier',
  'charges estimées': "Avant les enchères d'e-Potek, cette estimation conservative sert d'indication",
  emprunteurs: 'Les personnes financièrement et légalement bénéficiaires du prêt',
  "type d'utilisation": "Les résidences principales permettent l'utilisation du 2ème pilier en tant que fonds propres",
  bonus: 'En développement', // TODO

  '2e pilier': 'Aussi appelé LPP',
  '2ème pilier': 'Aussi appelé LPP',
  lpp: 'Aussi appelé 2ème pilier',

  '3e pilier': 'En développement', // TODO
  '3ème pilier': 'En développement', // TODO
};

const offerTableTooltips = {
  montant: 'Le montant maximal que la banque peut vous prêter',
  libor: '"London Interbank Offered Rate", c\'est un type de taux d\'intérêt parmi les plus bas mais aussi le plus volatile',
  '2 ans': "Un taux d'intérêt qui arrive à échéance en 2 ans",
  '5 ans': "Un taux d'intérêt qui arrive à échéance en 5 ans",
  '10 ans': "Un taux d'intérêt qui arrive à échéance en 10 ans",
  amortissement: "L'amortissement annuel minimum de l'emprunt demandé par la banque",
  expertise: 'Indique si la banque veut faire une expertise supplémentaire, ajoute environ 2 semaines à la procédure',
  conditions: 'Les conditions que vous devez remplir pour avoir accès à cette offre',
};

export const tooltips = list => {
  switch (list) {
    case 'general':
      return generalTooltips;
    case 'table':
      return offerTableTooltips;
    default:
      throw new Error('Unknown tooltip list');
  }
};

export const tooltipsById = id => {
  const array = id.split('.');

  if (array.length !== 2) {
    throw Error('Wrong id given for tooltips, requires 2 strings separated by a .');
  }

  const list = tooltips(array[0]);

  return list[array[1]];
};
