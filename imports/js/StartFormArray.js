import { toMoney } from './conversionFunctions';


const getInitialArray = state => [
  {
    id: 'purchaseType',
    type: 'buttons',
    text1: 'Je voudrais un prêt pour',
    buttons: [
      {
        id: 'acquisition',
        label: 'une nouvelle acquisition',
      }, {
        id: 'refinancing',
        label: 'un refinancement',
      }, {
        id: 'liquidity',
        label: 'des liquidités',
      },
    ],
  },
  {
    condition: state.purchaseType === 'refinancing' || state.purchaseType === 'liquidity',
    hide: state.purchaseType === 'acquisition',
    id: 'dev',
    type: 'textInput',
    text1: 'Nous allons ouvrir e-Potek aux refinancements et liquidités tout bientôt, entrez votre adresse e-mail si vous voulez être tenu au courant:',
    final: true,
  },
];


const getAcquisitionArray = state => [
  {
    condition: state.purchaseType === 'acquisition',
    id: 'knowsProperty',
    type: 'buttons',
    text1: 'Où en êtes vous?',
    question: true,
    buttons: [
      {
        id: true,
        label: 'J\'ai identifé le bien',
      },
      {
        id: false,
        label: 'Je veux savoir combien emprunter',
      },
    ],
  },
  {
    condition: state.knowsProperty === true,
    id: 'propertyValue',
    type: 'textInput',
    text1: 'Le prix d\'achat de la propriété est de',
    money: true,
  },
  {
    condition: state.knowsProperty === true && state.propertyValue !== undefined,
    id: 'propertyWork',
    type: 'textInput',
    text1: 'Je veux faire des travaux supplémentaires valant',
    money: true,
  },
  {
    condition: state.knowsProperty === true && state.propertyWork !== undefined,
    id: 'notaryFeesAgreed',
    type: 'buttons',
    text1: `J'aurai donc des frais de notaire supplémentaires de CHF ${toMoney(0.05 * (state.propertyValue + state.propertyWork))}.`,
    question: true,
    buttons: [
      {
        id: true,
        label: 'Ok',
      },
    ],
  },
  {
    condition: state.knowsProperty === false || state.notaryFeesAgreed,
    id: 'usageType',
    type: 'buttons',
    text1: 'Quelle sera le type d\'utilisation de cette propriété?',
    question: true,
    buttons: [
      {
        id: 'primary',
        label: 'Résidence Principale',
      },
      {
        id: 'secondary',
        label: 'Résidence Secondaire',
      },
      {
        id: 'investment',
        label: 'Investissement',
      },
    ],
  },
  {
    condition: state.usageType === 'investment',
    id: 'propertyRent',
    type: 'textInput',
    text1: 'J\'estime que le loyer mensuel pour cette propriété sera',
    money: true,
  },
  {
    condition: state.usageType === 'primary' || state.usageType === 'secondary' || state.propertyRent,
    id: 'borrowerCount',
    type: 'buttons',
    text1: 'Combien d\'emprunteurs êtes vous?',
    question: true,
    buttons: [
      {
        id: 1,
        label: 'Un',
      },
      {
        id: 2,
        label: 'Deux',
      },
    ],
  },
  {
    condition: state.borrowerCount === 1,
    id: 'birthYear',
    type: 'textInput',
    text1: 'Je suis né en',
    placeholder: '1980',
    number: true,
  },
  {
    condition: state.borrowerCount > 1,
    id: 'oldestAge',
    type: 'textInput',
    text1: 'L\'emprunteur le plus agé a',
    text2: 'ans.',
    placeholder: '40',
    number: true,
  },
  {
    condition: state.birthYear || state.oldestAge,
    id: 'income',
    type: 'multipleInput',
    firstMultiple: true,
    text1: 'Combien gagnez vous par an (brut)?',
    money: true,
  },
  {
    id: 'bonusExists',
    type: 'buttons',
    text1: 'Gagnez-vous un bonus?',
    question: true,
    buttons: [
      {
        id: true,
        label: 'Oui',
      },
      {
        id: false,
        label: 'Non',
      },
    ],
  }, {
    condition: state.bonusExists === true,
    id: 'bonus1',
    type: 'multipleInput',
    text1: 'Bonus 2014',
    money: true,
  }, {
    condition: state.bonusExists === true,
    id: 'bonus2',
    type: 'multipleInput',
    text1: 'Bonus 2015',
    money: true,
  }, {
    condition: state.bonusExists === true,
    id: 'bonus3',
    type: 'multipleInput',
    text1: 'Bonus 2016',
    money: true,
  }, {
    condition: state.bonusExists === true,
    id: 'bonus4',
    type: 'multipleInput',
    text1: 'Bonus 2017',
    money: true,
  },
  {
    condition: state.bonusExists === false ||
      ((state.bonus42 !== undefined && state.borrowerCount > 1) || state.bonus41 !== undefined),
    id: 'otherIncome',
    type: 'buttons',
    text1: 'Avez-vous d\'autres revenus mensuels?',
    question: true,
    normalFlow: true,
    buttons: [
      {
        id: true,
        label: 'Oui',
      },
      {
        id: false,
        label: 'Non',
      },
    ],
  },
  {
    condition: state.otherIncome === true,
    id: 'otherIncomeArray',
    type: 'arrayInput',
    inputs: [
      {
        id: 'value',
        type: 'textInput',
        label: 'Montant mensuel',
        money: true,
      }, {
        id: 'description',
        type: 'selectInput',
        label: 'Type de revenu',
        options: [
          {
            id: 'welfareIncome',
            label: 'Allocation familiale',
          }, {
            id: 'pensionIncome',
            label: 'Pension alimentaire',
          }, {
            id: 'rentIncome',
            label: 'Revenu locatif',
          }, {
            id: 'realEstateIncome',
            label: 'Revenu de fortune immobilière',
          }, {
            id: 'other',
            label: 'Autre',
          },
        ],
      },
    ],
  },
  {
    condition: state.otherIncome === false ||
      ((state.otherIncomeArray && state.otherIncomeArray.length) >= 1 &&
      (state.otherIncomeArray[0].value && state.otherIncomeArray[0].description)),
    id: 'expensesArray',
    type: 'arrayInput',
    text1: 'Donnez-nous la liste de vos charges mensuelles',
    inputs: [
      {
        id: 'value',
        type: 'textInput',
        label: 'Montant mensuel',
        money: true,
      }, {
        id: 'description',
        type: 'selectInput',
        label: 'Type de charge',
        options: [
          {
            id: 'leasing',
            label: 'Leasing',
          }, {
            id: 'rent',
            label: 'Loyer',
          }, {
            id: 'personalLoan',
            label: 'Crédit personnel',
          }, {
            id: 'mortgageLoan',
            label: 'Prêt immobilier',
          }, {
            id: 'other',
            label: 'Autre',
          },
        ],
      },
    ],
  },
  {
    id: 'fortune',
    type: 'multipleInput',
    text1: 'A combien se monte votre épargne?',
    money: true,
  },
  {
    id: 'insurance1',
    type: 'multipleInput',
    text1: 'Combien avez-vous de LPP?',
    money: true,
  },
  {
    id: 'finalized',
    type: 'buttons',
    text1: 'Vous-êtes arrivé au bout, bien joué!',
    question: true,
    buttons: [
      {
        id: true,
        label: 'Afficher les résultats',
      },
    ],
  },
];


const getRefinancingArray = state => [

];


const getCommonArray = state => [

];


const getIncomeArray = state => [

];


const getChargeArray = state => [

];


const getFormArray = (state) => {
  return getInitialArray(state).concat(
    getAcquisitionArray(state),
    getRefinancingArray(state),
    getCommonArray(state),
    getIncomeArray(state),
    getChargeArray(state),
  );
};


export default getFormArray;
