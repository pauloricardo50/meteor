// Write the keys in lowercase
// If the value is an array, it means there need to be 2 strings for the
// "Learn More" part.
export const generalTooltips = {
  asdfgaewra: { id: '' },
  // 'revenus annuels bruts': 'yearlyIncome',
  // 'fonds propres requis': 'ownFundsRequired',
  // 'fonds propres - total': 'ownFunds',
  // 'fonds propres': 'ownFunds',
  // "prix d'achat": 'purchasePrice',
  // finma: ['finma'],
  // 'charges / revenus': 'incomeRatio',
  // "ratio d'endettement": 'incomeRatio',
  // "prêt / prix d'achat": 'borrowRatio',
  // 'prêt / valeur du bien': 'borrowRatio',
  // 'frais de notaire': ['notaryFees'],
  // 'frais retrait prévoyance': 'insuranceFees',
  // 'travaux de plus-value': ['propertyWork'],
  // // expertise: 'expertise',
  // 'prêteurs intéressés': 'interestedLenders',
  // 'charges estimées': 'monthlyEstimated',
  // emprunteurs: 'borrowers',
  // "type d'utilisation": 'usageType',
  // 'bonus considéré': ['consideredBonus'],
  // bonus: 'bonus',
  // 'autres sources de revenus': 'otherIncome',
  // '2e pilier': 'secondPillar',
  // '2ème pilier': 'secondPillar',
  // lpp: 'lpp',
  // '3e pilier': 'thirdPillar',
  // '3ème pilier': 'thirdPillar',
  // 'offres standard': 'standardOffers',
  // standard: 'standardOffers', // careful with this one, it could trigger on unwanted "standard" uses
  // 'offres avec contrepartie': 'counterpartOffers',
  // 'avec contrepartie': 'counterpartOffers',
};

export const offerTableTooltips = {
  montant: { id: 'offerTable.amount' },
  libor: { id: 'offerTable.libor' },
  '2 ans': { id: 'offerTable.2' },
  '5 ans': { id: 'offerTable.5' },
  '10 ans': { id: 'offerTable.10' },
  amortissement: { id: 'offerTable.amortization' },
  expertise: { id: 'offerTable.expertise' },
  conditions: { id: 'offerTable.conditions' },
};

export const tooltips = (list) => {
  switch (list) {
  case 'general':
    return generalTooltips;
  case 'table':
    return offerTableTooltips;
  default:
    throw new Error('Unknown tooltip list');
  }
};

export const tooltipsById = (id) => {
  if (typeof id !== 'string') {
    throw new Error('not a string');
  }
  const [listId, ...ids] = id.split('.');

  if (ids.length <= 0 || ids[0] === '') {
    throw Error('Wrong id given for tooltips, requires 2 strings separated by a .');
  }

  const list = tooltips(listId);

  return list[ids.join('.')];
};
