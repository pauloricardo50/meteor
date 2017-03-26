import { Meteor } from 'meteor/meteor';
import Scroll from 'react-scroll';
import { toMoney } from '../helpers/conversionFunctions';

const isTrue = (v, zeroAllowed = false) =>
  zeroAllowed ? v !== undefined : v !== undefined && v !== 0;
const multipleTrue = (id, state, zeroAllowed = false) => {
  if (state.borrowerCount > 1) {
    if (
      isTrue(state[`${id}1`], zeroAllowed) &&
      isTrue(state[`${id}1`], zeroAllowed)
    ) {
      return true;
    }
  } else if (isTrue(state[`${id}1`], zeroAllowed)) {
    return true;
  }

  return false;
};

const getAcquisitionArray = (state, props) => [
  {
    condition: state.knowsProperty,
    id: 'propertyValue',
    type: 'textInput',
    text1: "Le prix d'achat de la propriété est de",
    money: true,
  },
  {
    condition: state.knowsProperty,
    id: 'notaryFeesAgreed',
    type: 'buttons',
    text1: `A ce prix s'ajoutent les frais de notaire de CHF ${toMoney(0.05 * state.propertyValue)}.`,
    hideResult: true,
    buttons: [
      {
        id: true,
        label: 'Continuer',
      },
    ],
  },
  {
    condition: state.knowsProperty,
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
    deleteId: 'propertyWork',
  },
  {
    condition: state.propertyWorkExists === true,
    id: 'propertyWork',
    type: 'textInput',
    text1: 'Les travaux de plus-value sont estimés à',
    money: true,
  },
  {
    condition: state.propertyWork !== undefined && state.propertyWork !== 0,
    id: 'projectAgreed',
    type: 'buttons',
    text1: `Le coût de votre projet sera donc de CHF ${toMoney(1.05 * state.propertyValue + (state.propertyWork || 0))}.`,
    hideResult: true,
    buttons: [
      {
        id: true,
        label: 'Continuer',
      },
    ],
  },
  {
    id: 'usageType',
    type: 'buttons',
    text1: "Quel sera le type d'utilisation de cette propriété?",
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
    text1: "J'estime que le loyer mensuel pour cette propriété sera",
    money: true,
  },
  {
    id: 'borrowerCount',
    type: 'buttons',
    text1: "Combien d'emprunteurs êtes vous?",
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
    id: 'age',
    type: 'textInput',
    text1: "J'ai",
    text2: 'ans.',
    placeholder: '40',
    number: true,
    width: 50,
    validation: {
      min: 18,
      max: 120,
    },
  },
  {
    condition: state.borrowerCount > 1,
    id: 'oldestAge',
    type: 'textInput',
    text1: "L'emprunteur le plus agé a",
    text2: 'ans.',
    placeholder: '40',
    number: true,
    width: 50,
    validation: {
      min: 18,
      max: 120,
    },
  },
  {
    id: 'income',
    type: 'multipleInput',
    firstMultiple: true,
    text1: 'Quels est votre salaire annuel brut?',
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
  },
  {
    condition: state.bonusExists === true,
    id: 'bonus1',
    type: 'multipleInput',
    text1: 'Bonus 2014',
    money: true,
    zeroAllowed: true,
  },
  {
    condition: state.bonusExists === true,
    id: 'bonus2',
    type: 'multipleInput',
    text1: 'Bonus 2015',
    money: true,
    zeroAllowed: true,
  },
  {
    condition: state.bonusExists === true,
    id: 'bonus3',
    type: 'multipleInput',
    text1: 'Bonus 2016',
    money: true,
    zeroAllowed: true,
  },
  {
    condition: state.bonusExists === true,
    id: 'bonus4',
    type: 'multipleInput',
    text1: 'Bonus 2017',
    money: true,
    zeroAllowed: true,
  },
  {
    id: 'otherIncome',
    type: 'buttons',
    text1: "Avez-vous d'autres revenus?",
    question: true,
    deleteId: 'otherIncomeArray',
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
        id: 'value',
        type: 'textInput',
        label: 'Montant annuel',
        money: true,
      },
    ],
  },
  {
    id: 'expensesExist',
    type: 'buttons',
    text1: `Avez-vous des charges comme des leasings, ${state.usageType !== 'primary' ? 'rentes, ' : ''}pensions, loyers, crédits personnels ou autres prêts immobiliers?`,
    question: true,
    deleteId: 'expensesArray',
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
    text1: 'Donnez-nous la liste de vos charges annuelles',
    inputs: [
      {
        id: 'description',
        type: 'selectInput',
        label: 'Type de charge',
        options: [
          {
            id: 'leasing',
            label: 'Leasings',
          },
          state.usageType !== 'primary'
            ? {
                id: 'rent',
                label: 'Loyers',
              }
            : {},
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
        money: true,
        zeroAllowed: true,
      },
    ],
  },
  {
    id: 'realEstateExists',
    type: 'buttons',
    text1: "Êtes-vous propriétaire d'autres biens immobiliers?",
    question: true,
    deleteId: 'realEstateArray',
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
      },
      {
        id: 'loan',
        type: 'textInput',
        label: 'Emprunt actuel',
        money: true,
        zeroAllowed: true,
      },
    ],
  },
  {
    id: 'fortune',
    type: 'multipleInput',
    text1: 'Quelle est votre fortune bancaire personnelle (cash et titres)?',
    question: true,
    money: true,
  },
  {
    condition: state.usageType === 'primary',
    id: 'insurance1',
    type: 'multipleInput',
    text1: 'Quels sont les fonds de prévoyance disponibles au sein de votre 2e pilier?',
    money: true,
    zeroAllowed: true,
  },
  {
    condition: state.usageType === 'primary',
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
    text1: 'Quels sont les fonds de prévoyance disponibles au sein de votre 3e pilier?',
    money: true,
  },
];

const getErrorArray = (state, props) => [
  {
    condition: state.usageType === 'primary' &&
      (props.fortune < props.fees + 0.1 * props.propAndWork &&
        props.insuranceFortune >= 0.1 * props.propAndWork),
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
    condition: props.fortune + props.insuranceFortune < props.minFortune,
    id: 'error',
    type: 'buttons',
    text1: `Vous devez avoir au moins CHF ${toMoney(props.minFortune)} de fonds propres pour ce projet, vous pouvez modifier les valeurs en haut.`,
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
    condition: state.type === 'acquisition',
    id: 'fortuneUsed',
    type: 'sliderInput',
    // text1: `Vous avez CHF ${toMoney(props.fortune + props.insuranceFortune)} de fonds propres au total, combien voulez-vous allouer à ce projet? Vous devez mettre au minimum ${state.propertyWorkExists ? `les frais de notaire ainsi que ${state.usageType === 'secondary' ? 30 : 20}% du prix d'achat + les travaux` : `${state.usageType === 'secondary' ? 35 : 25}% du projet`}, soit CHF ${toMoney(props.minFortune)}.`,
    text1: `Vous avez CHF ${toMoney(props.fortune + props.insuranceFortune)} de fonds propres au total, combien voulez-vous allouer à ce projet? Au minimum CHF ${toMoney(props.minFortune)}.`,
    question: true,
    money: true,
    sliderMin: props.minFortune,
    sliderMax: props.fortune + props.insuranceFortune,
  },
  {
    condition: (props.income &&
      props.monthly / ((props.income - props.expenses) / 12)) > 0.38,
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

  // If the user wants to borrow less than CHF 100000
  {
    condition: state.type === 'acquisition' &&
      state.fortuneUsed &&
      props.propAndWork - state.fortuneUsed <= 100000,
    id: 'error',
    type: 'buttons',
    text1: "Vous utilisez trop de fonds propres, nous ne pouvons malheureusement pas vous aider pour un emprunt de moins de CHF 100'000.",
    buttons: [],
  },
  {
    condition: state.type === 'test' || state.fortuneUsed >= props.minFortune,
    id: 'finalized',
    type: 'buttons',
    text1: 'Vous-êtes arrivé au bout, bien joué!',
    hideResult: true,
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

const getFormArray = (state, props) => getAcquisitionArray(state, props).concat(
  state.type === 'acquisition' ? getErrorArray(state, props) : [], // these errors only for acquisitions
  getFinalArray(state, props),
);

export default getFormArray;
