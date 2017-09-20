export const getBorrowerInfoArray = (borrowers, id) => {
  const b = borrowers.find(borr => borr._id === id);
  const multiple = borrowers.length > 1;
  // If this is the first borrower in the array of borrowers, don't ask for same address
  const isFirst = borrowers[0]._id === id;

  if (!b) {
    throw new Error("couldn't find borrower");
  }

  return [
    {
      id: 'firstName',
      type: 'textInput',
      label: 'Prénom',
      placeholder: 'Jean',
    },
    {
      id: 'lastName',
      type: 'textInput',
      label: 'Nom',
      placeholder: 'Ducret',
    },
    {
      id: 'gender',
      type: 'radioInput',
      label: 'Genre',
      options: [
        { id: 'f', label: 'Femme' },
        { id: 'm', label: 'Homme' },
        { id: 'other', label: 'Autre' },
      ],
    },
    {
      type: 'h3',
      text: 'Votre addresse',
      ignore: true,
    },
    {
      id: 'sameAddress',
      type: 'radioInput',
      label: `Utiliser la même adresse que ${borrowers[0].firstName ||
        'Emprunteur 1'}?`,
      options: [{ id: true, label: 'Oui' }, { id: false, label: 'Non' }],
      condition: multiple && !isFirst,
    },
    {
      id: 'address1',
      type: 'textInput',
      label: 'Adresse 1',
      placeholder: 'Rue des Champs 7',
      disabled: !!b.sameAddress,
    },
    {
      id: 'address2',
      type: 'textInput',
      label: 'Adresse 2',
      placeholder: '',
      disabled: !!b.sameAddress,
      required: false,
    },
    {
      id: 'zipCode',
      type: 'textInput',
      number: true,
      label: 'Code Postal',
      placeholder: '1200',
      disabled: !!b.sameAddress,
      saveOnChange: false,
    },
    {
      id: 'city',
      type: 'textInput',
      label: 'Localité',
      placeholder: 'Genève',
      disabled: !!b.sameAddress,
    },
    {
      type: 'conditionalInput',
      conditionalTrueValue: false,
      inputs: [
        {
          id: 'isSwiss',
          type: 'radioInput',
          label: 'Avez-vous la nationalité Suisse?',
          options: [{ id: true, label: 'Oui' }, { id: false, label: 'Non' }],
        },
        {
          id: 'residencyPermit',
          type: 'selectFieldInput',
          label: 'Permis de résidence',
          required: false,
          options: [
            {
              id: 'b',
              label: 'Permis B',
            },
            {
              id: 'c',
              label: 'Permis C',
            },
            {
              id: 'ci',
              label: 'Permis Ci',
            },
            {
              id: 'f',
              label: 'Permis F',
            },
            {
              id: 'g',
              label: 'Permis G',
            },
            {
              id: 'l',
              label: 'Permis L',
            },
            {
              id: 'n',
              label: 'Permis N',
            },
            {
              id: 's',
              label: 'Permis S',
            },
            {
              id: 'other',
              label: 'Autre',
            },
          ],
        },
      ],
    },
    {
      id: 'age',
      type: 'textInput',
      number: true,
      label: 'Age',
      placeholder: '40',
      saveOnChange: false,
    },
    {
      id: 'birthPlace',
      type: 'textInput',
      label: 'Lieu de Naissance',
      placeholder: 'Berne, Suisse',
    },
    {
      id: 'civilStatus',
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
    },
    {
      id: 'childrenCount',
      type: 'textInput',
      number: true,
      label: 'Enfants à charge',
      placeholder: '2',
    },
    {
      id: 'company',
      type: 'textInput',
      label: 'Employeur',
      placeholder: 'Google',
      required: false,
    },
    {
      id: 'worksForOwnCompany',
      type: 'radioInput',
      label: 'Êtes-vous employé de votre propre entreprise?',
      options: [{ id: true, label: 'Oui' }, { id: false, label: 'Non' }],
    },
    {
      id: 'personalBank',
      type: 'textInput',
      label: 'Votre Banque Personelle',
      placeholder: 'UBS SA',
    },
  ];
};

export const getBorrowerFinanceArray = (borrowers, id, loanRequest) => {
  const b = borrowers.find(borr => borr._id === id);
  const multiple = borrowers.length > 1;
  // If this is the first borrower in the array of borrowers, don't ask for same address
  const isFirst = borrowers[0]._id === id;

  if (!b) {
    throw new Error("couldn't find borrower");
  }

  const incomeArray = [
    {
      type: 'h3',
      text: 'Revenus & Charges',
      ignore: true,
    },
    {
      id: 'salary',
      type: 'textInput',
      money: true,
      label: 'Revenus bruts annuels',
      placeholder: "CHF 100'000",
    },
    {
      type: 'conditionalInput',
      conditionalTrueValue: true,
      inputs: [
        {
          id: 'bonusExists',
          type: 'radioInput',
          label: 'Avez-vous un bonus ?',
          options: [{ id: true, label: 'Oui' }, { id: false, label: 'Non' }],
        },
        {
          id: 'bonus.bonus2017',
          type: 'textInput',
          money: true,
          label: 'Bonus 2017',
          placeholder: "CHF 10'000",
        },
        {
          id: 'bonus.bonus2016',
          type: 'textInput',
          money: true,
          label: 'Bonus 2016',
          placeholder: "CHF 10'000",
        },
        {
          id: 'bonus.bonus2015',
          type: 'textInput',
          money: true,
          label: 'Bonus 2015',
          placeholder: "CHF 10'000",
        },
        {
          id: 'bonus.bonus2014',
          type: 'textInput',
          money: true,
          label: 'Bonus 2014',
          placeholder: "CHF 10'000",
        },
      ],
    },
    {
      id: 'expenses',
      type: 'arrayInput',
      label: 'Charges',
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
            {
              id: 'other',
              label: 'Autre',
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
      id: 'otherIncome',
      type: 'arrayInput',
      label: 'Autres revenus',
      required: false,
      inputs: [
        {
          id: 'description',
          type: 'selectInput',
          label: 'Type de revenu',
          placeholder: 'Choisissez...',
          options: [
            { id: 'welfareIncome' },
            { id: 'pensionIncome' },
            { id: 'rentIncome' },
            { id: 'realEstateIncome' },
            { id: 'investmentIncome' },
            { id: 'other' },
          ],
        },
        {
          id: 'value',
          type: 'textInput',
          money: true,
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
      ignore: true,
    },
    {
      id: 'bankFortune',
      type: 'textInput',
      money: true,
      label: 'Fortune Bancaire',
      placeholder: "CHF 100'000",
    },
    {
      id: 'realEstate',
      type: 'arrayInput',
      label: 'Fortune Immobilière',
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
      id: 'otherFortune',
      type: 'arrayInput',
      label: 'Autre Fortune',
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
          id: 'value',
          type: 'textInput',
          money: true,
          label: 'Valeur',
          placeholder: "CHF 100'000",
        },
      ],
    },
  ];

  const insuranceArray = [
    {
      type: 'h3',
      text: 'Prévoyance',
      ignore: true,
    },
    {
      id: 'insuranceSecondPillar',
      type: 'textInput',
      money: true,
      label: 'LPP / 2ème Pilier',
      placeholder: "CHF 100'000",
      required: false,
    },
    {
      id: 'insuranceThirdPillar',
      type: 'textInput',
      money: true,
      label: 'Assurance 3A',
      placeholder: "CHF 100'000",
      required: false,
    },
    {
      id: 'insurance3B',
      type: 'textInput',
      money: true,
      label: 'Assurance 3B',
      placeholder: "CHF 100'000",
      required: false,
    },
    {
      id: 'insurancePureRisk',
      type: 'textInput',
      money: true,
      label: 'Risque Pure',
      placeholder: "CHF 100'000",
      required: false,
    },
  ];

  return incomeArray.concat([...fortuneArray, ...insuranceArray]);
};
