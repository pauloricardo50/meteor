export const partnerList = [
  {
    key: 'banqueDuLeman',
    name: 'Banque du Léman',
    logo: 'banqueDuLeman_logo.png',
    cantons: ['GE'],
  },
  {
    key: 'creditAgricole',
    name: 'Crédit Agricole Financements Suisse',
    logo: 'creditAgricole_logo.png',
    cantons: ['GE'],
  },
  {
    key: 'KFH',
    name: 'Kreditanstalt für Hypotheken',
    logo: 'KFH_logo.png',
    cantons: ['GE'],
  },
  {
    key: 'allianz',
    name: 'Allianz Suisse',
    logo: 'allianz_logo.png',
    cantons: ['GE', 'VD'],
  },
  {
    key: 'postFinance',
    name: 'PostFinance',
    logo: 'postFinance_logo.png',
    cantons: ['GE', 'VD'],
  },
  {
    key: 'banqueMigros',
    name: 'Banque Migros',
    logo: 'banqueMigros_logo.png',
    cantons: ['GE', 'VD'],
  },
  {
    key: 'vaudoiseAssurances',
    name: 'Vaudoise Assurances',
    logo: 'vaudoiseAssurances_logo.png',
    cantons: ['GE', 'VD'],
  },
  {
    key: 'banqueWir',
    name: 'Banque Wir',
    logo: 'banqueWir_logo.png',
    cantons: ['GE'],
  },
  {
    key: 'raiffeisen',
    name: 'Raiffeisen',
    logo: 'raiffeisen_logo.png',
    cantons: ['GE', 'VD'],
  },
  {
    key: 'valiant',
    name: 'Valiant',
    logo: 'valiant_logo.png',
    cantons: ['GE'],
  },
  {
    key: 'swisslife',
    name: 'Swisslife',
    logo: 'swisslife_logo.png',
    cantons: ['GE', 'VD'],
  },
  {
    key: 'banqueCoop',
    name: 'Banque Coop',
    logo: 'banqueCoop_logo.png',
    cantons: ['GE', 'VD'],
  },
  {
    key: 'baloiseAssurances',
    name: 'Bâloise Assurances',
    logo: 'baloiseAssurances_logo.png',
    cantons: ['GE', 'VD'],
  },
  {
    key: 'helvetia',
    name: 'Helvetia Assurance',
    logo: 'helvetia_logo.png',
    cantons: ['GE'],
  },
  {
    key: 'zurichSuisse',
    name: 'Zurich Suisse',
    logo: 'zurichSuisse_logo.png',
    cantons: ['GE'],
  },
];

// Given the canton of the borrower and the partners he wants to avoid, return a list of all the
// lenders we will potentially contact
export const getPartnerList = (canton, partnersToAvoid) => {
  const filteredList = partnerList.filter(partner =>
    partner.cantons.includes(canton));

  if (partnersToAvoid && partnersToAvoid.length > 0) {
    partnersToAvoid.forEach((partnerToAvoid, index) => {
      if (filteredList[index].key === partnerToAvoid) {
        filteredList.splice(index, 1);
      }
    });
  }

  return filteredList;
};

export const getAllPartners = () => partnerList;
