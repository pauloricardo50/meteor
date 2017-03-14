import { Meteor } from 'meteor/meteor';
import Scroll from 'react-scroll';
import { toMoney } from './conversionFunctions';

const isTrue = (v, zeroAllowed = false) => (zeroAllowed ? v !== undefined : v !== undefined && v !== 0);
const multipleTrue = (id, state, zeroAllowed = false) => {
  if (state.borrowerCount > 1) {
    if (isTrue(state[`${id}1`], zeroAllowed) && isTrue(state[`${id}1`], zeroAllowed)) {
      return true;
    }
  } else if (isTrue(state[`${id}1`], zeroAllowed)) {
    return true;
  }

  return false;
};

const arrayIsTrue = (a, keys = ['value', 'description']) =>
  (a && a.length) >= 1 && keys.reduce((tot, key) => tot && a[0][key] !== undefined, true);

const getInitialArray = state => [
];


const getAcquisitionArray = (state, props) => [
  {
    condition: state.knowsProperty === true,
    id: 'propertyValue',
    type: 'textInput',
    text1: 'Le prix d\'achat de la propriété est de',
    money: true,
  },
  {
    // condition: state.knowsProperty === true && state.propertyValue !== undefined,
    condition: state.knowsProperty,
    id: 'notaryFeesAgreed',
    type: 'buttons',
    text1: `A ce prix s'ajoutent les frais de notaire de CHF ${toMoney(0.05 * state.propertyValue)}.`,
    question: true,
    buttons: [
      {
        id: true,
        label: 'Continuer',
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
    condition: state.knowsProperty === true && (state.propertyWork !== undefined && state.propertyWork !== 0),
    id: 'projectAgreed',
    type: 'buttons',
    text1: `Le prix de votre projet sera donc de CHF ${toMoney((1.05 * state.propertyValue) + (state.propertyWork || 0))}.`,
    question: true,
    buttons: [
      {
        id: true,
        label: 'Continuer',
      },
    ],
  },
  {
    condition: state.knowsProperty === false || state.projectAgreed || state.propertyWorkExists === false,
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
    validation: {
      min: 1900,
      max: 1999,
    },
  },
  {
    condition: state.borrowerCount > 1,
    id: 'oldestAge',
    type: 'textInput',
    text1: 'L\'emprunteur le plus agé a',
    text2: 'ans.',
    placeholder: '40',
    number: true,
    validation: {
      min: 18,
      max: 120,
    },
  },
  {
    condition: state.birthYear || state.oldestAge,
    id: 'income',
    type: 'multipleInput',
    firstMultiple: true,
    text1: 'Quels est votre salaire brut (annuel)?',
    money: true,
    zeroAllowed: true,
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
    zeroAllowed: true,
  }, {
    condition: state.bonusExists === true,
    id: 'bonus2',
    type: 'multipleInput',
    text1: 'Bonus 2015',
    money: true,
    zeroAllowed: true,
  }, {
    condition: state.bonusExists === true,
    id: 'bonus3',
    type: 'multipleInput',
    text1: 'Bonus 2016',
    money: true,
    zeroAllowed: true,
  }, {
    condition: state.bonusExists === true,
    id: 'bonus4',
    type: 'multipleInput',
    text1: 'Bonus 2017',
    money: true,
    zeroAllowed: true,
  },
  {
    condition: state.bonusExists === false || multipleTrue('bonus4', state, true),
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
    existId: 'otherIncome',
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
    condition: state.otherIncome === false || arrayIsTrue(state.otherIncomeArray),
    id: 'expensesExist',
    type: 'buttons',
    text1: 'Avez-vous des charges mensuelles comme des leasings, rentes, pensions, loyers, crédits personnels ou prêts immobiliers?',
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
  },
  {
    condition: state.expensesExist,
    id: 'expensesArray',
    existId: 'expensesExist',
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
            label: 'Prêts immobilier',
          }, {
            id: 'pensions',
            label: 'Pensions et Rentes',
          },
        ],
      }, {
        id: 'value',
        type: 'textInput',
        label: 'Montant mensuel',
        money: true,
        zeroAllowed: true,
      },
    ],
  },
  {
    condition: state.expensesExist === false || arrayIsTrue(state.expensesArray),
    id: 'realEstateExists',
    type: 'buttons',
    text1: 'Êtes-vous propriétaire d\'autres biens immobiliers?',
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
  },
  {
    condition: state.realEstateExists,
    id: 'realEstateArray',
    existId: 'realEstateExists',
    type: 'arrayInput',
    allOptions: true,
    inputs: [
      {
        id: 'description',
        type: 'selectInput',
        label: 'Type de Propriété',
        options: [
          {
            id: 'primary',
            label: 'Propriété Principale',
          }, {
            id: 'secondary',
            label: 'Propriété Secondaire',
          }, {
            id: 'investment',
            label: 'Bien d\'investissement',
          },
        ],
      }, {
        id: 'value',
        type: 'textInput',
        label: 'Valeur du bien',
        money: true,
      }, {
        id: 'loan',
        type: 'textInput',
        label: 'Emprunt actuel',
        money: true,
        zeroAllowed: true,
      },
    ],
  },
  {
    condition: state.realEstateExists === false || arrayIsTrue(state.realEstateArray, ['description', 'value', 'loan']),
    id: 'fortune',
    type: 'multipleInput',
    text1: 'Quelle est votre fortune bancaire personnelle (cash et titres)?',
    question: true,
    money: true,
  },
  {
    condition: state.usageType === 'primary' && multipleTrue('fortune', state),
    id: 'insurance1',
    type: 'multipleInput',
    text1: 'Quels sont les fonds de prévoyance disponibles dans votre 2e pilier?',
    money: true,
    zeroAllowed: true,
  },
  {
    condition: state.usageType === 'primary' && multipleTrue('insurance1', state, true),
    id: 'insurance2Exists',
    type: 'buttons',
    text1: 'Avez-vous un 3e pilier?',
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
  },
  {
    condition: state.usageType === 'primary' && state.insurance2Exists,
    id: 'insurance2',
    type: 'multipleInput',
    text1: 'Combien vaut votre 3e pilier?',
    money: true,
  },
];


const getRefinancingArray = state => [

];


const getCommonArray = state => [

];

const finalCondition = s => ((s.usageType === 'secondary' || s.usageType === 'investment') && multipleTrue('fortune', s)) || (s.usageType === 'primary' && (multipleTrue('insurance2', s, true) || s.insurance2Exists === false));
const getErrorArray = (state, props) => [
  {
    condition: finalCondition(state) && state.usageType === 'primary' && (props.fortune < props.fees + (0.1 * (props.propAndWork)) && (props.insuranceFortune >= 0.1 * props.propAndWork)),
    id: 'error',
    type: 'buttons',
    text1: `Vous devez avoir au moins CHF ${toMoney(0.15 * state.propertyValue)} de fortune (sans compter votre prévoyance) pour ce projet, vous pouvez modifier les valeurs en haut.`,
    buttons: [
      {
        id: false,
        label: 'Pourquoi ?',
        noPrimary: true,
      },
    ],
  },
  {
    condition: finalCondition(state) && ((props.fortune + props.insuranceFortune) < props.minFortune),
    id: 'error',
    type: 'buttons',
    text1: `Vous devez avoir au moins CHF ${toMoney(props.minFortune)} pour ce projet, vous pouvez modifier les valeurs en haut.`,
    buttons: [
      {
        id: false,
        label: 'Pourquoi ?',
        noPrimary: true,
      },
    ],
  },
  {
    condition: finalCondition(state) && ((props.income && props.monthly / ((props.income - props.expenses) / 12)) > 0.38),
    id: 'error',
    type: 'buttons',
    text1: `Vos revenus disponibles (CHF ${toMoney((props.income - props.expenses) / 12)}/mois) sont insuffisants pour couvrir les coûts mensuels de ce projet (CHF ${toMoney(props.monthly)}) sans représenter plus de 38% de ces revenus, vous pouvez modifier les valeurs en haut.`,
    buttons: [
      {
        id: false,
        label: 'Pourquoi ?',
        noPrimary: true,
      },
    ],
  },
];


const getFinalArray = (state, props) => [
  {
    condition: finalCondition(state),
    id: 'fortuneUsed',
    type: 'textInput',
    text1: `Vous avez CHF ${toMoney(props.fortune + props.insuranceFortune)} de fonds propres au total, combien voulez-vous allouer à ce projet? Vous devez mettre au minimum ${state.propertyWorkExists ? 'les frais de notaire ainsi que 20% du prix d\'achat + les travaux' : '25% du projet'}, soit CHF ${toMoney(props.minFortune)}.`,
    question: true,
    money: true,
    normalFlow: true,
  },

// If the user wants to borrow less than CHF 100000
  {
    condition: state.fortuneUsed && (props.propAndWork) - state.fortuneUsed <= 100000,
    id: 'error',
    type: 'buttons',
    text1: 'Vous utilisez trop de fonds propres, nous ne pouvons malheureusement pas vous aider pour un emprunt de moins de CHF 100\'000.',
    buttons: [
    ],
  },
  {
    condition: state.fortuneUsed >= props.minFortune,
    id: 'finalized',
    type: 'buttons',
    text1: 'Vous-êtes arrivé au bout, bien joué!',
    question: true,
    buttons: [
      {
        id: true,
        label: 'Afficher les résultats',
        onClick() {
          const options = {
            duration: 350,
            delay: 0,
            smooth: true,
          };
          Meteor.defer(() => Scroll.scroller.scrollTo('final', options));
        },
      },
    ],
  },
];


const getFormArray = (state, props) => {
  return getInitialArray(state, props).concat(
    getAcquisitionArray(state, props),
    getRefinancingArray(state, props),
    getCommonArray(state, props),
    getErrorArray(state, props),
    getFinalArray(state, props),
  );
};


export default getFormArray;
