export const TOOLTIP_LISTS = {
  GENERAL: 'GENERAL',
  OFFER_TABLE: 'OFFER_TABLE',
  DEV: 'DEV',
};

// Write the keys in lowercase
// If `double` is true, it means there need to be 2 strings for the
// "Learn More" part.
export const generalTooltips = {
  'plan financier': { id: 'financialPlan', double: true },
  'structure de financement': { id: 'financialPlan', double: true },

  'charges / revenus': { id: 'incomeRatio', double: true },
  "taux d'effort": { id: 'incomeRatio', double: true },

  'revenus annuels bruts': { id: 'income', double: true },
  'salaire brut': { id: 'income', double: true },
  revenus: { id: 'income', double: true },

  bonus: { id: 'bonus', double: true },
  gratification: { id: 'bonus', double: true },

  emprunteurs: { id: 'borrower', double: false },
  emprunteur: { id: 'borrower', double: false },

  finma: { id: 'finma', double: true },

  'prêteurs intéressés': { id: 'interestedLenders', double: false },

  "prêt / prix d'achat": { id: 'borrowRatio', double: true },
  "taux d'avance": { id: 'borrowRatio', double: true },
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

export const devTooltips = {
  match1: { id: 'id1' },
  match2: { id: 'id2' },
};

export const tooltips = (list) => {
  switch (list) {
  case TOOLTIP_LISTS.GENERAL:
    return generalTooltips;
  case TOOLTIP_LISTS.OFFER_TABLE:
    return offerTableTooltips;
  case TOOLTIP_LISTS.DEV:
    return devTooltips;
  default:
    throw new Error(`Unknown tooltip list ${list}`);
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
