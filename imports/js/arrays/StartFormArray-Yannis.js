// Comment lire ce fichier
// chaque { et } délimite une phrase de oscar
// Dans ces parenthèses, il y a des valeurs avec un nom
// Par exemple:
// label: 'Continuer'
// Label, c'est le nom, 'Continuer', c'est la valeur

// Les noms possibles sont:
// condition: indique la condition nécessaire pour afficher cette ligne en
// particulier, si tu lis la valeur associée à ce nom, tu peux déchiffrer
// la condition

// id: indique le "nom" associée à la valeur pour être réutilisée plus tard

// text1: Le texte affiché dans la phrase oscar

// buttons: Une liste des boutons affichés sous la phrase, qu'on peut cliquer

// D'autres existent ici et là, tu peux déduire leur utilité

[
  {
    condition: state.knowsProperty,
    id: 'propertyValue',
    text1: "Le prix d'achat de la propriété est de",
  },
  {
    condition: state.knowsProperty,
    id: 'notaryFeesAgreed',
    text1: "A ce prix s'ajoutent les frais de notaire de CHF XXX .",
    buttons: [
      {
        label: 'Continuer',
      },
    ],
  },
  {
    condition: state.knowsProperty,
    id: 'propertyWorkExists',
    text1: 'Souhaitez-vous rajouter à votre projet des travaux de plus-value?',
    buttons: [
      {
        label: 'Oui',
      },
      {
        label: 'Non',
      },
    ],
  },
  {
    condition: state.propertyWorkExists === true,
    id: 'propertyWork',
    text1: 'Les travaux de plus-value sont estimés à',
  },
  {
    condition: state.propertyWork !== undefined && state.propertyWork !== 0,
    id: 'projectAgreed',
    text1: 'Le coût de votre projet sera donc de CHF XXX .',
    buttons: [
      {
        label: 'Continuer',
      },
    ],
  },
  {
    id: 'usageType',
    text1: "Quel sera le type d'utilisation de cette propriété?",
    buttons: [
      {
        label: 'Ma Résidence Principale',
      },
      {
        label: 'Ma Résidence Secondaire',
      },
      {
        label: 'Je veux le louer',
      },
    ],
  },
  {
    condition: state.usageType === 'investment',
    id: 'propertyRent',
    text1: "J'estime que le loyer mensuel pour cette propriété sera",
  },
  {
    id: 'borrowerCount',
    text1: "Combien d'emprunteurs êtes vous?",
    buttons: [
      {
        label: 'Un',
      },
      {
        label: 'Deux',
      },
    ],
  },
  {
    condition: state.borrowerCount === 1,
    id: 'age',
    text1: "J'ai",
    text2: 'ans.',
    placeholder: '40',
    validation: {
      min: 18,
      max: 120,
    },
  },
  {
    condition: state.borrowerCount > 1,
    id: 'oldestAge',
    text1: "L'emprunteur le plus agé a",
    text2: 'ans.',
    placeholder: '40',
    validation: {
      min: 18,
      max: 120,
    },
  },
  {
    id: 'initialIncome',
    text1: 'Vous avez indiqué que vos revenus sont de CHF XXX par an, vous pouvez les détailler maintenant.',
    buttons: [
      {
        label: 'Ok',
      },
    ],
  },
  {
    id: 'income',
    text1: 'Quel est votre salaire annuel brut?',
  },
  {
    id: 'bonusExists',
    text1: 'Avez vous touché un bonus lors des 4 dernières années?',
    buttons: [
      {
        label: 'Oui',
      },
      {
        label: 'Non',
      },
    ],
  },
  {
    condition: state.bonusExists === true,
    id: 'bonus4',
    text1: 'Bonus 2017',
  },
  {
    condition: state.bonusExists === true,
    id: 'bonus3',
    text1: 'Bonus 2016',
  },
  {
    condition: state.bonusExists === true,
    id: 'bonus2',
    text1: 'Bonus 2015',
  },
  {
    condition: state.bonusExists === true,
    id: 'bonus1',
    text1: 'Bonus 2014',
  },
  {
    id: 'otherIncome',
    text1: "Avez-vous d'autres revenus annuels?",
    buttons: [
      {
        label: 'Oui',
      },
      {
        label: 'Non',
      },
    ],
  },
  {
    condition: state.otherIncome === true,
    id: 'otherIncomeArray',
    inputs: [
      {
        id: 'description',
        label: 'Type de revenu',
        options: [
          {
            label: 'Allocations',
          },
          {
            label: 'Pensions',
          },
          {
            label: 'Rentes',
          },
          {
            label: 'Revenus de fortune immobilière',
          },
          {
            label: 'Revenus de vos titres',
          },
        ],
      },
      {
        id: 'value',
        label: 'Montant annuel',
      },
    ],
  },
  {
    id: 'expensesExist',
    text1: 'Avez-vous des charges comme des leasings, rentes, pensions, loyers, crédits personnels ou autres prêts immobiliers?',
    buttons: [
      {
        label: 'Oui',
      },
      {
        label: 'Non',
      },
    ],
  },
  {
    condition: state.expensesExist,
    id: 'expensesArray',
    text1: 'Donnez-nous la liste de vos charges',
    inputs: [
      {
        id: 'description',
        label: 'Type de charge',
        options: [
          {
            label: 'Leasings',
          },
          {
            label: 'Loyers',
          },
          {
            label: 'Crédits personnels',
          },
          {
            label: 'Prêts immobilier',
          },
          {
            label: 'Pensions et Rentes',
          },
        ],
      },
      {
        id: 'value',
        label: 'Montant annuel',
      },
    ],
  },
  {
    id: 'initialFortune',
    text1: 'Vous avez indiqué que votre fortune est de CHF XXX par an, vous pouvez la détailler maintenant.',
    buttons: [
      {
        label: 'Ok',
      },
    ],
  },
  {
    id: 'fortune',
    text1: 'Quelle est votre fortune bancaire personnelle (cash et titres)?',
  },
  {
    condition: state.usageType === 'primary',
    id: 'insurance1',
    text1: 'Quels sont les fonds de prévoyance disponibles au sein de votre 2e pilier?',
  },
  {
    condition: state.usageType === 'primary',
    id: 'insurance2Exists',
    text1: 'Avez-vous un 3e pilier?',
    buttons: [
      {
        label: 'Oui',
      },
      {
        label: 'Non',
      },
    ],
  },
  {
    condition: state.usageType === 'primary' && state.insurance2Exists,
    id: 'insurance2',
    text1: 'Quels sont les fonds de prévoyance disponibles au sein de votre 3e pilier?',
  },
  {
    id: 'realEstateExists',
    text1: "Êtes-vous propriétaire d'autres biens immobiliers?",
    buttons: [
      {
        label: 'Oui',
      },
      {
        label: 'Non',
      },
    ],
  },
  {
    condition: state.realEstateExists,
    id: 'realEstateArray',
    inputs: [
      {
        id: 'description',
        label: 'Type de Propriété',
        options: [
          {
            label: 'Propriété Principale',
          },
          {
            label: 'Propriété Secondaire',
          },
          {
            label: "Bien d'investissement",
          },
        ],
      },
      {
        id: 'value',
        label: 'Valeur du bien',
      },
      {
        id: 'loan',
        label: 'Emprunt actuel',
      },
    ],
  },

  // Erreurs possibles
  {
    condition: state.usageType === 'primary' &&
      (props.fortune < props.minCash &&
        props.insuranceFortune >= 0.1 * props.propAndWork),
    id: 'error',
    text1: 'Vous devez avoir au moins CHF XXX de fortune (sans compter votre prévoyance) pour ce projet, vous pouvez modifier les valeurs en haut.',
    buttons: [
      {
        label: 'Pourquoi ?',
      },
    ],
  },
  {
    condition: props.fortune + props.insuranceFortune < props.minFortune,
    id: 'error',
    text1: 'Vous devez avoir au moins CHF XXX de fonds propres pour ce projet, vous pouvez modifier les valeurs en haut.',
    buttons: [
      {
        label: 'Pourquoi ?',
      },
    ],
  },

  // Choix des fonds propres
  {
    condition: state.type === 'acquisition',
    id: 'loanWanted',
    text1: 'Combien voulez-vous emprunter ? Minimum CHF XXX',
  },
  {
    condition: state.type === 'acquisition' &&
      (state.usageType !== 'primary' ||
        (state.usageType === 'primary' && props.insuranceFortune <= 0)),
    id: 'fortuneRequiredAgreed',
    text1: 'Vous devrez donc mettre CHF XXX de fonds propres.',
    buttons: [
      {
        label: 'Continuer',
      },
    ],
  },
  {
    condition: state.type === 'acquisition' &&
      state.usageType === 'primary' &&
      props.fortune >= props.fortuneNeeded &&
      props.insuranceFortune > 0,
    id: 'useInsurance',
    text1: 'Voulez-vous utiliser votre fortune de prévoyance sur ce projet ?',
    buttons: [
      {
        label: 'Oui',
      },
      {
        label: 'Non',
      },
      {
        label: 'Pourquoi?',
      },
    ],
  },
  {
    condition: state.type === 'acquisition' &&
      state.usageType === 'primary' &&
      props.fortune < props.fortuneNeeded,
    id: 'useInsurance',
    text1: 'Vous devrez utiliser votre fortune de prévoyance pour ce projet',
    buttons: [
      {
        label: 'Ok',
      },
      {
        label: 'Pourquoi?',
      },
      {
        label: 'Conditions',
      },
    ],
  },
  {
    condition: state.type === 'acquisition' &&
      state.usageType === 'primary' &&
      state.useInsurance === true,
    id: 'fortuneSliders',
    text1: 'Vous devez donc mettre CHF XXX de fonds propres, comment voulez-vous les répartir?',
  },
  {
    condition: (props.income &&
      props.monthly / ((props.income - props.expenses) / 12)) > 0.38,
    id: 'error',
    text1: 'Vos revenus disponibles (CHF XXX /mois) sont insuffisants pour couvrir les coûts mensuels de ce projet (CHF XXX /mois) sans représenter plus de 38% de ces revenus, vous pouvez modifier les valeurs en haut.',
    buttons: [
      {
        label: 'Pourquoi ?',
      },
    ],
  },
  {
    condition: state.type === 'test' ||
      state.fortuneUsed + (state.insuranceFortuneUsed || 0) >= props.minFortune,
    id: 'finalized',
    text1: 'Vous-êtes arrivé au bout, formidable!',
    buttons: [
      {
        label: 'Afficher les résultats',
      },
    ],
  },
];
