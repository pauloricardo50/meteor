export const partnerList = {
  banqueDuLeman: {
    name: 'Banque du Léman',
    logo: 'banqueDuLeman_logo.png',
    cantons: [
      'GE',
    ],
  },
  creditAgricole: {
    name: 'Crédit Agricole Financements Suisse',
    logo: 'creditAgricole_logo.png',
    cantons: [
      'GE',
    ],
  },
  KFH: {
    name: 'Kreditanstalt für Hypotheken',
    logo: 'KFH_logo.png',
    cantons: [
      'GE',
    ],
  },
  allianz: {
    name: 'Allianz Suisse',
    logo: 'allianz_logo.png',
    cantons: [
      'GE', 'VD',
    ],
  },
  postFinance: {
    name: 'PostFinance',
    logo: 'postFinance_logo.png',
    cantons: [
      'GE', 'VD',
    ],
  },
  banqueMigros: {
    name: 'Banque Migros',
    logo: 'banqueMigros_logo.png',
    cantons: [
      'GE', 'VD',
    ],
  },
  vaudoiseAssurances: {
    name: 'Vaudoise Assurances',
    logo: 'vaudoiseAssurances_logo.png',
    cantons: [
      'GE', 'VD',
    ],
  },
  banqueWir: {
    name: 'Banque Wir',
    logo: 'banqueWir_logo.png',
    cantons: [
      'GE',
    ],
  },
  raiffeisen: {
    name: 'Raiffeisen',
    logo: 'raiffeisen_logo.png',
    cantons: [
      'GE', 'VD',
    ],
  },
  valiant: {
    name: 'Valiant',
    logo: 'valiant_logo.png',
    cantons: [
      'GE',
    ],
  },
  swisslife: {
    name: 'Swisslife',
    logo: 'swisslife_logo.png',
    cantons: [
      'GE', 'VD',
    ],
  },
  banqueCoop: {
    name: 'Banque Coop',
    logo: 'banqueCoop_logo.png',
    cantons: [
      'GE', 'VD',
    ],
  },
  baloiseAssurances: {
    name: 'Bâloise Assurances',
    logo: 'baloiseAssurances_logo.png',
    cantons: [
      'GE', 'VD',
    ],
  },
  helvetia: {
    name: 'Helvetia Assurance',
    logo: 'helvetia_logo.png',
    cantons: [
      'GE',
    ],
  },
  zurichSuisse: {
    name: 'Zurich Suisse',
    logo: 'zurichSuisse_logo.png',
    cantons: [
      'GE',
    ],
  },
};


// Given the canton of the borrower and the partners he wants to avoid, return a list of all the
// lenders we will potentially contact
export const getPartnerList = (canton, partnersToAvoid) => {
  const filteredList = partnerList.filter(
    partner => partner.cantons.includes(canton),
  );

  if (partnersToAvoid.length > 0) {
    partnersToAvoid.forEach((partner) => {
      if (filteredList[partner]) {
        delete filteredList[partner];
      }
    });
  }


  return filteredList;
};


export const getAllPartners = () => partnerList;
