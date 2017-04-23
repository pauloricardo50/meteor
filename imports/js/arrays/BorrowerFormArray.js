import React from 'react';

export const getBorrowerInfoArray = (borrowers, id) => {
  const b = borrowers.find(borr => borr._id === id);
  const multiple = borrowers.length > 1;
  // If this is the first borrower in the array of borrowers, don't ask for same address
  const isFirst = borrowers[0]._id === id;

  if (!b) {
    return [];
  }

  return [
    {
      type: 'textInput',
      label: 'Prénom',
      placeholder: 'Jean',
      id: 'firstName',
      currentValue: b.firstName,
    },
    {
      type: 'textInput',
      label: 'Nom',
      placeholder: 'Ducret',
      id: 'lastName',
      currentValue: b.lastName,
    },
    {
      type: 'radioInput',
      label: 'Genre',
      options: [
        { id: 'f', label: 'Femme' },
        { id: 'm', label: 'Homme' },
        { id: 'other', label: 'Autre' },
      ],
      id: 'gender',
      currentValue: b.gender,
    },
    {
      type: 'h3',
      text: 'Votre addresse',
    },
    {
      type: 'radioInput',
      label: `Utiliser la même adresse que ${borrowers[0].firstName || 'Emprunteur 1'}?`,
      options: [{ id: true, label: 'Oui' }, { id: false, label: 'Non' }],
      id: 'sameAddress',
      currentValue: b.sameAddress,
      showCondition: multiple && !isFirst,
    },
    {
      type: 'textInput',
      label: 'Adresse 1',
      placeholder: 'Rue des Champs 7',
      id: 'address1',
      currentValue: b.address1,
      disabled: !!b.sameAddress,
    },
    {
      type: 'textInput',
      label: 'Adresse 2',
      placeholder: '',
      id: 'address2',
      currentValue: b.address2,
      disabled: !!b.sameAddress,
      required: false,
    },
    {
      type: 'textInput',
      number: true,
      label: 'Code Postal',
      placeholder: '1200',
      id: 'zipCode',
      currentValue: b.zipCode,
      disabled: !!b.sameAddress,
    },
    {
      type: 'textInput',
      label: 'Localité',
      placeholder: 'Genève',
      id: 'city',
      currentValue: b.city,
      disabled: !!b.sameAddress,
    },
    {
      type: 'textInput',
      label: 'Nationalités',
      placeholder: 'Suisse, Français',
      id: 'citizenships',
      currentValue: b.citizenships,
    },
    {
      type: 'textInput',
      label: 'Permis de résidence',
      placeholder: 'Permis C',
      id: 'residencyPermit',
      currentValue: b.residencyPermit,
      info: "Si vous n'êtes pas Suisse",
      required: false,
    },
    {
      type: 'textInput',
      number: true,
      label: 'Age',
      placeholder: '40',
      id: 'age',
      currentValue: b.age,
    },
    {
      type: 'textInput',
      label: 'Lieu de Naissance',
      placeholder: 'Berne, Suisse',
      id: 'birthPlace',
      currentValue: b.birthPlace,
    },
    {
      type: 'radioInput',
      label: 'État civil',
      options: [
        { id: 'married', label: b.gender === 'f' ? 'Mariée' : 'Marié' },
        { id: 'pacsed', label: b.gender === 'f' ? 'Pacsée' : 'Pacsé' },
        {
          id: 'single',
          label: b.gender === 'f' ? 'Célibataire' : 'Célibataire',
        },
        { id: 'divorced', label: b.gender === 'f' ? 'Divorcée' : 'Divorcé' },
      ],
      id: 'civilStatus',
      currentValue: b.civilStatus,
    },
    {
      type: 'textInput',
      label: 'Employeur',
      placeholder: 'Google',
      id: 'company',
      currentValue: b.company,
      required: false,
    },
    {
      type: 'textInput',
      label: 'Votre Banque Personelle',
      placeholder: 'UBS SA',
      id: 'personalBank',
      currentValue: b.personalBank,
    },
  ];
};

export const getBorrowerFinanceArray = (borrowers, id, loanRequest) => {
  const b = borrowers.find(borr => borr._id === id);
  const multiple = borrowers.length > 1;
  // If this is the first borrower in the array of borrowers, don't ask for same address
  const isFirst = borrowers[0]._id === id;

  if (!b) {
    return [];
  }

  const incomeArray = [
    {
      type: 'h3',
      text: 'Revenus & Charges',
    },
    {
      type: 'textInput',
      money: true,
      label: 'Revenus bruts annuels',
      placeholder: "CHF 100'000",
      id: 'salary',
      currentValue: b.salary,
    },
    {
      type: 'conditionalInput',
      conditionalTrueValue: true,
      inputs: [
        {
          type: 'radioInput',
          label: 'Avez-vous un bonus ?',
          options: [{ id: true, label: 'Oui' }, { id: false, label: 'Non' }],
          id: 'bonusExists',
          currentValue: b.bonusExists,
        },
        {
          type: 'textInput',
          money: true,
          label: 'Bonus 2017',
          placeholder: "CHF 10'000",
          id: 'bonus.bonus2017',
          currentValue: b.bonus && b.bonus.bonus2017,
        },
        {
          type: 'textInput',
          money: true,
          label: 'Bonus 2016',
          placeholder: "CHF 10'000",
          id: 'bonus.bonus2016',
          currentValue: b.bonus && b.bonus.bonus2016,
        },
        {
          type: 'textInput',
          money: true,
          label: 'Bonus 2015',
          placeholder: "CHF 10'000",
          id: 'bonus.bonus2015',
          currentValue: b.bonus && b.bonus.bonus2015,
        },
        {
          type: 'textInput',
          money: true,
          label: 'Bonus 2014',
          placeholder: "CHF 10'000",
          id: 'bonus.bonus2014',
          currentValue: b.bonus && b.bonus.bonus2014,
        },
      ],
    },
    {
      type: 'arrayInput',
      label: 'Charges',
      id: 'expenses',
      currentValue: b.expenses,
      required: false,
      inputs: [
        {
          id: 'description',
          type: 'selectInput',
          label: 'Type de charge',
          placeholder: 'Choisissez...',
          options: [
            {
              id: 'leasing',
              label: 'Leasings',
            },
            {
              id: 'rent',
              label: 'Loyers',
            },
            {
              id: 'personalLoan',
              label: 'Crédits personnels',
            },
            {
              id: 'mortgageLoan',
              label: 'Prêts immobilier',
            },
            {
              id: 'pensions',
              label: 'Pensions et Rentes',
            },
          ],
        },
        {
          id: 'value',
          type: 'textInput',
          label: 'Montant annuel',
          placeholder: "CHF 10'000",
          money: true,
        },
      ],
    },
    {
      type: 'arrayInput',
      label: 'Autres revenus',
      id: 'otherIncome',
      currentValue: b.otherIncome,
      required: false,
      inputs: [
        {
          id: 'description',
          type: 'selectInput',
          label: 'Type de revenu',
          placeholder: 'Choisissez...',
          options: [
            {
              id: 'welfareIncome',
              label: 'Allocations',
            },
            {
              id: 'pensionIncome',
              label: 'Pensions',
            },
            {
              id: 'rentIncome',
              label: 'Rentes',
            },
            {
              id: 'realEstateIncome',
              label: 'Revenus de fortune immobilière',
            },
            {
              id: 'other',
              label: 'Revenus de vos titres',
            },
          ],
        },
        {
          type: 'textInput',
          money: true,
          id: 'value',
          label: 'Montant annuel',
          placeholder: "CHF 10'000",
        },
      ],
    },
  ];

  const fortuneArray = [
    {
      type: 'h3',
      text: 'Fortune',
    },
    {
      type: 'textInput',
      money: true,
      label: 'Fortune Bancaire',
      placeholder: "CHF 100'000",
      id: 'bankFortune',
      currentValue: b.bankFortune,
    },
    {
      id: 'realEstate',
      type: 'arrayInput',
      label: 'Fortune Immobilière',
      currentValue: b.realEstate,
      inputs: [
        {
          id: 'description',
          type: 'selectInput',
          label: 'Type de Propriété',
          placeholder: 'Choisissez...',
          options: [
            {
              id: 'primary',
              label: 'Propriété Principale',
            },
            {
              id: 'secondary',
              label: 'Propriété Secondaire',
            },
            {
              id: 'investment',
              label: "Bien d'investissement",
            },
          ],
        },
        {
          id: 'value',
          type: 'textInput',
          label: 'Valeur du bien',
          money: true,
          placeholder: "CHF 500'000",
        },
        {
          id: 'loan',
          type: 'textInput',
          label: 'Emprunt actuel',
          money: true,
          placeholder: "CHF 300'000",
        },
      ],
    },
    {
      type: 'arrayInput',
      label: 'Autre Fortune',
      id: 'otherFortune',
      currentValue: b.otherFortune,
      required: false,
      inputs: [
        {
          id: 'description',
          type: 'selectInput',
          label: 'Type de fortune',
          placeholder: 'Choisissez...',
          options: [
            {
              id: 'art',
              label: "Objets d'art",
            },
            {
              id: 'cars',
              label: 'Véhicules',
            },
            {
              id: 'boats',
              label: 'Bateaux',
            },
            {
              id: 'airplanes',
              label: 'Aéronefs',
            },
            {
              id: 'jewelry',
              label: 'Bijoux',
            },
          ],
        },
        {
          type: 'textInput',
          money: true,
          id: 'value',
          label: 'Valeur',
          placeholder: "CHF 100'000",
        },
      ],
    },
  ];

  const insuranceArray = [
    {
      type: 'h3',
      text: 'Assurances',
      // showCondition: index === 0,
    },
    {
      type: 'textInput',
      money: true,
      label: 'LPP / 2ème Pilier',
      placeholder: "CHF 100'000",
      id: 'insuranceSecondPillar',
      currentValue: b.insuranceSecondPillar,
      required: false,
    },
    {
      type: 'textInput',
      money: true,
      label: 'Assurance 3A',
      placeholder: "CHF 100'000",
      id: 'insuranceThirdPillar',
      currentValue: b.insuranceThirdPillar,
      required: false,
    },
    {
      type: 'textInput',
      money: true,
      label: 'Assurance 3B',
      placeholder: "CHF 100'000",
      id: 'insurance3B',
      currentValue: b.insurance3B,
      required: false,
    },
    {
      type: 'textInput',
      money: true,
      label: 'Risque Pure',
      placeholder: "CHF 100'000",
      id: 'insurancePureRisk',
      currentValue: b.insurancePureRisk,
      required: false,
    },
  ];

  return incomeArray.concat([...fortuneArray, ...insuranceArray]);
};
