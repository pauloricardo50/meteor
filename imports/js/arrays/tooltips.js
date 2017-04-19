// Write the keys in lowercase
const generalTooltips = {
  finma: 'Autorité fédérale de surveillance des marchés financiers',

  'charges/revenus': "Ne doit pas dépasser 33%, exceptions jusqu'à 38%",
  "ratio d'endettement": "Ne doit pas dépasser 33%, exceptions jusqu'à 38%",

  "emprunt/prix d'achat": 'Ne doit pas dépasser 80% dans la majorité des cas',
  'emprunt/Valeur du bien': 'Ne doit pas dépasser 80% dans la majorité des cas',

  'frais de notaire': "Frais obligatoires lorsqu'on conclut un prêt hypothécaire",
  'travaux de plus-value': 'Ajoutent de la valeur au bien, sans augmenter les frais de notaire',
  expertise: 'Vérification de la valeur du bien par rapport à son état et son emplacement',
  'nb. de prêteurs potentiels': 'La quantité de prêteurs e-Potek dont les conditions correspondent à votre dossier',
  'charges estimées': "Avant les enchères d'e-Potek, cette estimation conservative sert d'indication",
};

const offerTableTooltips = {
  montant: 'Le montant maximal que la banque peut vous prêter',
  libor: '"London Interbank Offered Rate", c\'est un type de taux d\'intérêt parmi les plus bas mais le plus volatile',
  '2 ans': "Un taux d'intérêt qui arrive à échéance en 2 ans",
  '5 ans': "Un taux d'intérêt qui arrive à échéance en 5 ans",
  '10 ans': "Un taux d'intérêt qui arrive à échéance en 10 ans",
  amortissement: "L'amortissement annuel minimum de l'emprunt demandé par la banque",
  expertise: 'Indique si la banque veut faire une expertise supplémentaire, ajoute environ 2 semaines à la procédure',
};

const tooltips = list => {
  switch (list) {
    case 'general':
      return generalTooltips;
    case 'table':
      return offerTableTooltips;
    default:
      throw new Error('Unknown tooltip list');
  }
};

export default tooltips;
