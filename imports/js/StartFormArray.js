import { toMoney } from './conversionFunctions';

const multipleTrue = (id, state) => {
  if (state.borrowerCount > 1) {
    if (state[`${id}1`] !== undefined && state[`${id}1`] !== undefined) {
      return true;
    }
  } else {
    if (state[`${id}1`] !== undefined) {
      return true;
    }
  }

  return false;
}

const getInitialArray = state => [
];


const getAcquisitionArray = state => [
  {
    condition: state.knowsProperty === true,
    id: 'propertyValue',
    type: 'textInput',
    text1: 'Le prix d\'achat de la propriété est de',
    money: true,
  },
  {
    condition: state.knowsProperty === true && state.propertyValue !== undefined,
    id: 'notaryFeesAgreed',
    type: 'buttons',
    text1: `A ce prix je dois rajouter les frais de notaire de CHF ${toMoney(0.05 * state.propertyValue)}.`,
    question: true,
    buttons: [
      {
        id: true,
        label: 'Ok',
      },
    ],
  },
  {
    condition: state.knowsProperty === true && state.notaryFeesAgreed !== undefined,
    id: 'propertyWorkExists',
    type: 'buttons',
    question: true,
    text1: 'Souhaitez-vous rajouter à votre projet des travaux de plus-value?',
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
    condition: state.knowsProperty === true && state.propertyWorkExists,
    id: 'propertyWork',
    type: 'textInput',
    text1: 'Les travaux de plus-value sont estimés à',
    money: true,
  },
  {
    condition: state.knowsProperty === true &&
      (state.propertyWorkExists === false || state.propertyWork !== undefined),
    id: 'projectAgreed',
    type: 'buttons',
    text1: `Le prix de votre projet sera de CHF ${toMoney((1.05 * state.propertyValue) + (state.propertyWork || 0))}.`,
    question: true,
    buttons: [
      {
        id: true,
        label: 'Ok',
      },
    ],
  },
  {
    condition: state.knowsProperty === false || state.projectAgreed,
    id: 'usageType',
    type: 'buttons',
    text1: 'Quelle sera le type d\'utilisation de cette propriété?',
    question: true,
    buttons: [
      {
        id: 'primary',
        label: 'Ma Résidence Principale',
      },
      {
        id: 'secondary',
        label: 'Ma Résidence Secondaire',
      },
      {
        id: 'investment',
        label: 'Je veux le louer',
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
    text1: 'Quels sont vos revenus bruts annuels?',
    money: true,
  },
  {
    id: 'bonusExists',
    type: 'buttons',
    text1: 'Avez vous touché un bonus lors des 4 dernières années?',
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
    condition: state.bonusExists === false || multipleTrue('bonus42', state),
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
        id: 'description',
        type: 'selectInput',
        label: 'Type de revenu',
        options: [
          {
            id: 'welfareIncome',
            label: 'Allocations',
          }, {
            id: 'pensionIncome',
            label: 'Pensions',
          }, {
            id: 'rentIncome',
            label: 'Rentes',
          }, {
            id: 'realEstateIncome',
            label: 'Revenus de fortune immobilière',
          }, {
            id: 'other',
            label: 'Revenus de vos titres',
          },
        ],
      }, {
        id: 'value',
        type: 'textInput',
        label: 'Montant mensuel',
        money: true,
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
        id: 'description',
        type: 'selectInput',
        label: 'Type de charge',
        options: [
          {
            id: 'leasing',
            label: 'Leasings',
          }, {
            id: 'rent',
            label: 'Loyers',
          }, {
            id: 'personalLoan',
            label: 'Crédits personnels',
          }, {
            id: 'mortgageLoan',
            label: 'Prêt immobilier',
          }, {
            id: 'other',
            label: 'Autre',
          },
        ],
      }, {
        id: 'value',
        type: 'textInput',
        label: 'Montant mensuel',
        money: true,
      },
    ],
  },
  {
    id: 'fortune',
    type: 'multipleInput',
    text1: 'Quelle est votre fortune bancaire (cash et titres)?',
    question: true,
    money: true,
  },
  {
    condition: state.usageType === 'primary',
    id: 'insurance1',
    type: 'multipleInput',
    text1: 'Quels sont les fonds de prévoyance disponibles (2e et 3e pilier)?',
    money: true,
  },
  {
    condition: ((state.usageType === 'secondary' || state.usageType === 'investment') && multipleTrue('fortune', state)) ||
      (state.usageType === 'primary' && multipleTrue('insurance1', state)),
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
