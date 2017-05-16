import React from 'react';
import { Meteor } from 'meteor/meteor';
import Scroll from 'react-scroll';
import constants from '/imports/js/config/constants';

import FortuneSliders from '/imports/ui/pages/public/startPage/FortuneSliders.jsx';
import AutoTooltip from '/imports/ui/components/general/AutoTooltip.jsx';

import { toMoney } from '../helpers/conversionFunctions';

const getAcquisitionArray = (state, props, setFormState) => [
  {
    id: 'propertyValue',
    condition: state.knowsProperty === true,
    type: 'textInput',
    text1: "Le prix d'achat de la propriété est de",
    money: true,
  },
  {
    id: 'notaryFeesAgreed',
    condition: state.knowsProperty === true,
    type: 'buttons',
    text1: (
      <span>
        <AutoTooltip>A ce prix s'ajoutent les frais de notaire de</AutoTooltip>
        {' '}
        <span className="active">
          CHF {toMoney(0.05 * state.propertyValue)}
        </span>
        .
      </span>
    ),
    hideResult: true,
    buttons: [{ id: true, label: 'Continuer' }],
  },
  {
    id: 'propertyWorkExists',
    condition: state.knowsProperty === true,
    type: 'buttons',
    question: true,
    text1: 'Souhaitez-vous rajouter à votre projet des travaux de plus-value?',
    buttons: [{ id: true, label: 'Oui' }, { id: false, label: 'Non' }],
    deleteId: 'propertyWork',
  },
  {
    id: 'propertyWork',
    condition: state.propertyWorkExists === true,
    type: 'textInput',
    text1: 'Les travaux de plus-value sont estimés à',
    money: true,
  },
  {
    id: 'projectAgreed',
    condition: state.propertyWork !== undefined && state.propertyWork !== 0,
    type: 'buttons',
    text1: (
      <span>
        Le coût de votre projet sera donc de
        {' '}
        <span className="active">
          CHF {toMoney(1.05 * state.propertyValue + (state.propertyWork || 0))}
        </span>
        .
      </span>
    ),
    hideResult: true,
    buttons: [{ id: true, label: 'Continuer' }],
  },
  {
    id: 'usageType',
    type: 'buttons',
    text1: "Quel sera le type d'utilisation de cette propriété?",
    question: true,
    buttons: [
      { id: 'primary', label: 'Ma Résidence Principale' },
      { id: 'secondary', label: 'Ma Résidence Secondaire' },
      { id: 'investment', label: 'Je veux le louer' },
    ],
  },
  {
    id: 'propertyRent',
    condition: state.usageType === 'investment',
    type: 'textInput',
    text1: "J'estime que le loyer mensuel pour cette propriété sera",
    money: true,
  },
  {
    id: 'borrowerCount',
    type: 'buttons',
    text1: "Combien d'emprunteurs êtes vous?",
    question: true,
    buttons: [{ id: 1, label: 'Un' }, { id: 2, label: 'Deux' }],
  },
  {
    id: 'age',
    condition: state.borrowerCount === 1,
    type: 'textInput',
    text1: "J'ai",
    text2: 'ans.',
    placeholder: '18',
    number: true,
    width: 50,
    validation: { min: 18, max: 120 },
  },
  {
    id: 'oldestAge',
    condition: state.borrowerCount > 1,
    type: 'textInput',
    text1: "L'emprunteur le plus agé a",
    text2: 'ans.',
    placeholder: '18',
    number: true,
    width: 50,
    validation: { min: 18, max: 120 },
  },
  {
    id: 'gender',
    condition: state.borrowerCount === 1 && state.age >= 50,
    type: 'buttons',
    text1: 'Je suis',
    text2: '.',
    buttons: [{ id: 'f', label: 'une femme' }, { id: 'm', label: 'un homme' }],
  },
  {
    id: 'oldestGender',
    condition: state.borrowerCount > 1 && state.oldestAge >= 50,
    type: 'buttons',
    text1: 'Et cette personne est',
    buttons: [{ id: 'f', label: 'une femme' }, { id: 'm', label: 'un homme' }],
  },
  {
    id: 'initialIncomeAgreed',
    type: 'buttons',
    text1: (
      <span>
        Vous avez indiqué que vos revenus sont de
        {' '}
        <span className="active">
          CHF {toMoney(state.initialIncome)}
        </span>
        {' '}
        par an, vous pouvez les détailler maintenant.
      </span>
    ),
    hideResult: true,
    buttons: [{ id: true, label: 'Ok' }],
  },
  {
    id: 'income',
    type: 'multipleInput',
    firstMultiple: true,
    text1: (
      <span>
        Quel est votre salaire <span className="bold">annuel</span> brut?
      </span>
    ),
    money: true,
    zeroAllowed: true,
  },
  {
    id: 'bonusExists',
    type: 'buttons',
    text1: 'Avez vous touché un bonus lors des 4 dernières années?',
    question: true,
    buttons: [{ id: true, label: 'Oui' }, { id: false, label: 'Non' }],
  },
  {
    id: 'bonus4',
    condition: state.bonusExists === true,
    type: 'multipleInput',
    text1: 'Bonus 2017',
    money: true,
    zeroAllowed: true,
  },
  {
    id: 'bonus3',
    condition: state.bonusExists === true,
    type: 'multipleInput',
    text1: 'Bonus 2016',
    money: true,
    zeroAllowed: true,
  },
  {
    id: 'bonus2',
    condition: state.bonusExists === true,
    type: 'multipleInput',
    text1: 'Bonus 2015',
    money: true,
    zeroAllowed: true,
  },
  {
    id: 'bonus1',
    condition: state.bonusExists === true,
    type: 'multipleInput',
    text1: 'Bonus 2014',
    money: true,
    zeroAllowed: true,
  },
  {
    id: 'otherIncome',
    type: 'buttons',
    text1: (
      <span>
        Avez-vous d'autres sources de
        {' '}
        <span className="bold">revenus annuels</span>
        ?
      </span>
    ),
    question: true,
    deleteId: 'otherIncomeArray',
    buttons: [{ id: true, label: 'Oui' }, { id: false, label: 'Non' }],
  },
  {
    id: 'otherIncomeArray',
    condition: state.otherIncome === true,
    existId: 'otherIncome',
    type: 'arrayInput',
    inputs: [
      {
        id: 'description',
        type: 'selectInput',
        label: 'Type de revenu',
        options: [
          { id: 'welfareIncome', label: 'Allocations' },
          { id: 'pensionIncome', label: 'Pensions' },
          { id: 'rentIncome', label: 'Rentes' },
          { id: 'realEstateIncome', label: 'Revenus de fortune immobilière' },
          { id: 'investmentIncome', label: 'Revenus de vos titres' },
          { id: 'other', label: 'Autre activité' },
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
    text1: (
      <span>
        Avez-vous des
        {' '}
        <span className="bold">charges annuelles</span>
        {' '}
        comme des leasings,
        {' '}
        {state.usageType !== 'primary' ? 'rentes, ' : ''}
        pensions, loyers, crédits personnels ou autres prêts immobiliers?
      </span>
    ),
    question: true,
    deleteId: 'expensesArray',
    buttons: [{ id: true, label: 'Oui' }, { id: false, label: 'Non' }],
  },
  {
    id: 'expensesArray',
    condition: state.expensesExist === true,
    existId: 'expensesExist',
    type: 'arrayInput',
    text1: (
      <span>
        Donnez-nous la liste de vos charges
        {' '}
        <span className="bold">annuelles</span>
      </span>
    ),
    inputs: [
      {
        id: 'description',
        type: 'selectInput',
        label: 'Type de charge',
        options: [
          { id: 'leasing', label: 'Leasings' },
          state.usageType !== 'primary'
            ? { id: 'rent', label: 'Loyers' }
            : { id: 'rent', label: 'Loyers maintenus' },
          { id: 'personalLoan', label: 'Crédits personnels' },
          { id: 'mortgageLoan', label: 'Prêts immobilier' },
          { id: 'pensions', label: 'Pensions et Rentes' },
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
    id: 'initialFortuneAgreed',
    type: 'buttons',
    text1: (
      <span>
        Vous avez indiqué que vous vouliez allouer
        {' '}
        <span className="active">
          CHF {toMoney(state.initialFortune)}
        </span>
        {' '}
        de fonds propres pour ce projet. Merci de détailler votre fortune maintenant.
      </span>
    ),
    hideResult: true,
    buttons: [{ id: true, label: 'Ok' }],
  },
  {
    id: 'fortune',
    type: 'multipleInput',
    firstMultiple: true,
    text1: 'Quelle est votre épargne bancaire personnelle (cash et titres)?',
    question: true,
    money: true,
  },
  {
    id: 'insurance1Exists',
    condition: state.usageType === 'primary',
    type: 'buttons',
    text1: 'Avez-vous un 2ème pilier?',
    question: true,
    buttons: [
      { id: true, label: 'Oui' },
      {
        id: false,
        label: 'Non',
        onClick() {
          setFormState('insurance11', 0);
          setFormState('insurance12', 0);
        },
      },
    ],
  },
  {
    id: 'insurance1',
    condition: state.usageType === 'primary' && state.insurance1Exists === true,
    type: 'multipleInput',
    text1: 'Quels sont les fonds de prévoyance disponibles au sein de votre 2ème pilier?',
    money: true,
  },
  {
    id: 'insurance2Exists',
    condition: state.usageType === 'primary',
    type: 'buttons',
    text1: 'Avez-vous un 3ème pilier?',
    question: true,
    buttons: [
      { id: true, label: 'Oui' },
      {
        id: false,
        label: 'Non',
        onClick() {
          setFormState('insurance21', 0);
          setFormState('insurance22', 0);
        },
      },
    ],
  },
  {
    id: 'insurance2',
    condition: state.usageType === 'primary' && state.insurance2Exists === true,
    type: 'multipleInput',
    text1: 'Quels sont les fonds de prévoyance disponibles au sein de votre 3ème pilier?',
    money: true,
  },
  {
    id: 'realEstateExists',
    type: 'buttons',
    text1: "Êtes-vous propriétaire d'autres biens immobiliers?",
    question: true,
    deleteId: 'realEstateArray',
    buttons: [{ id: true, label: 'Oui' }, { id: false, label: 'Non' }],
  },
  {
    id: 'realEstateArray',
    condition: state.realEstateExists === true,
    existId: 'realEstateExists',
    type: 'arrayInput',
    allOptions: true,
    inputs: [
      {
        id: 'description',
        type: 'selectInput',
        label: 'Type de Propriété',
        options: [
          { id: 'primary', label: 'Propriété Principale' },
          { id: 'secondary', label: 'Propriété Secondaire' },
          { id: 'investment', label: "Bien d'investissement" },
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
];

const getErrorArray = (state, props) => [
  {
    id: 'error',
    condition: state.usageType === 'primary' &&
      (props.fortune < props.minCash && props.insuranceFortune >= 0.1 * props.propAndWork),
    type: 'buttons',
    text1: (
      <span>
        Vous devez avoir au moins
        {' '}
        <span className="body">
          CHF
          {' '}
          {toMoney(props.minCash)}
        </span>
        {' '}
        <AutoTooltip>
          de fortune (sans compter votre prévoyance) pour ce projet, vous pouvez modifier les valeurs en haut.
        </AutoTooltip>
      </span>
    ),
    buttons: [{ id: false, label: 'Pourquoi ?', noPrimary: true }],
  },
  {
    id: 'error',
    condition: props.fortune + props.insuranceFortune < props.minFortune,
    type: 'buttons',
    text1: (
      <span>
        Vous devez avoir au moins
        {' '}
        <span className="body">CHF {toMoney(props.minFortune)}</span>
        {' '}
        <AutoTooltip>
          de fonds propres pour ce projet, vous pouvez modifier les valeurs en haut.
        </AutoTooltip>
      </span>
    ),
    buttons: [{ id: false, label: 'Pourquoi ?', noPrimary: true }],
  },
];

const getFinalArray = (state, props, setFormState) => [
  {
    id: 'loanWanted',
    condition: state.type === 'acquisition',
    type: 'sliderInput',
    text1: (
      <span>
        Combien voulez-vous emprunter ?
      </span>
    ),
    child1: (
      <span className="loanWanted-slider">
        <div>
          <label htmlFor="">Emprunt</label>
          <span className="active">
            CHF {toMoney(state.loanWanted || props.maxLoan)}
          </span>
        </div>
        <div>
          <label htmlFor="">Fonds Propres</label>
          <span className="body">
            CHF {toMoney(props.fortuneNeeded || props.project - props.maxLoan)}
          </span>
        </div>
      </span>
    ),
    money: true,
    question: true,
    sliderMin: Math.max(100000, props.minLoan),
    sliderMax: props.maxLoan,
    initialValue: props.maxLoan,
    sliderLabels: ['Min', 'Max'],
    step: 10000,
    onDragStart() {
      // Make sure we reset the next sliders if this is modified afterwards
      if (state.fortuneUsed) {
        setFormState('fortuneUsed', undefined);
      }
      if (state.insuranceFortuneUsed) {
        setFormState('insuranceFortuneUsed', undefined);
      }
    },
    validation: {
      min: Math.max(100000, props.minLoan),
      max: state.usageType === 'secondary'
        ? Math.ceil(0.7 * props.propAndWork)
        : Math.ceil(0.8 * props.propAndWork),
    },
  },
  {
    id: 'fortuneRequiredAgreed',
    condition: state.type === 'acquisition' &&
      (state.usageType !== 'primary' ||
        (state.usageType === 'primary' && props.insuranceFortune <= 0)),
    type: 'buttons',
    text1: (
      <span>
        Vous devrez donc mettre
        {' '}
        <span className="active">
          CHF {toMoney(props.fortuneNeeded)}
        </span>
        {' '}
        <AutoTooltip>de fonds propres.</AutoTooltip>
      </span>
    ),
    hideResult: true,
    buttons: [
      {
        id: true,
        label: 'Continuer',
        onClick() {
          setFormState('fortuneUsed', props.fortuneNeeded);
        },
      },
    ],
  },
  {
    id: 'useInsurance',
    condition: state.type === 'acquisition' &&
      state.usageType === 'primary' &&
      props.fortune >= props.fortuneNeeded &&
      props.insuranceFortune > 0,
    type: 'buttons',
    text1: 'Voulez-vous utiliser votre fortune de prévoyance sur ce projet ?',
    buttons: [
      {
        id: true,
        label: 'Oui',
        onClick() {
          // fortuneUsed value is undefined at this point, however,
          // if the user changes his mind, set it back to undefined if it was previously set
          setFormState('fortuneUsed', undefined);
        },
      },
      {
        id: false,
        label: 'Non',
        onClick() {
          setFormState('fortuneUsed', props.fortuneNeeded);
          setFormState('insuranceFortuneUsed', 0);
        },
      },
      {
        id: undefined,
        label: 'Pourquoi?',
        noPrimary: true,
      },
    ],
    question: true,
  },
  {
    id: 'useInsurance',
    condition: state.type === 'acquisition' &&
      state.usageType === 'primary' &&
      props.fortune < props.fortuneNeeded,
    type: 'buttons',
    text1: 'Vous devrez utiliser votre fortune de prévoyance pour ce projet',
    buttons: [{ id: true, label: 'Ok' }, { id: undefined, label: 'Pourquoi?', noPrimary: true }],
    question: true,
  },
  {
    id: 'insuranceConditions',
    condition: state.useInsurance === true,
    type: 'buttons',
    text1: 'Il y a des conditions pour pouvoir utiliser sa prévoyance, est-ce que vous les passez?',
    question: true,
    buttons: [
      {
        id: true,
        label: 'Oui',
        onClick() {
          setFormState('cantUseInsurance', false);
        },
      },
      {
        id: false,
        label: 'Non',
        onClick() {
          setFormState('cantUseInsurance', true);
          setFormState('insuranceFortuneUsed', 0);
        },
      },
      {
        id: undefined,
        label: 'Conditions',
        noPrimary: true,
        secondary: true,
      },
    ],
  },
  {
    id: 'fortuneSliders',
    condition: state.type === 'acquisition' &&
      state.usageType === 'primary' &&
      state.useInsurance === true &&
      state.insuranceConditions === true,
    type: 'custom',
    component: FortuneSliders,
    validation: () =>
      state.fortuneUsed + (state.insuranceFortuneUsed || 0) >= props.minFortune &&
      state.fortuneUsed >= props.minCash,
    text1: (
      <span>
        Vous devez donc mettre
        {' '}
        <span className="active">
          CHF {toMoney(props.project - state.loanWanted)}
        </span>
        {' '}
        <AutoTooltip>
          de fonds propres, comment voulez-vous les répartir?
        </AutoTooltip>
      </span>
    ),
    sliders: [
      {
        id: 'fortuneUsed',
        sliderMin: Math.max(props.fortuneNeeded - props.insuranceFortune, props.minCash),
        sliderMax: props.fortune >= props.fortuneNeeded ? props.fortuneNeeded : props.fortune,
      },
      {
        id: 'insuranceFortuneUsed',
        sliderMin: props.fortune >= props.fortuneNeeded ? 0 : props.fortuneNeeded - props.fortune,
        sliderMax: Math.min(props.insuranceFortune, props.fortuneNeeded - props.minCash),
      },
    ],
  },
  {
    id: 'error',
    condition: (props.income && props.monthly / ((props.income - props.expenses) / 12)) > 0.38,
    type: 'buttons',
    text1: (
      <span>
        Vos revenus disponibles (
        <span className="body">
          CHF {toMoney((props.income - props.expenses) / 12)}
        </span>
        /mois) sont insuffisants pour couvrir les coûts mensuels de ce projet (
        <span className="body">CHF {toMoney(props.monthly)}</span>
        ) sans représenter plus de 38% de ces revenus, vous pouvez modifier les valeurs en haut.
      </span>
    ),
    buttons: [{ id: false, label: 'Pourquoi ?', noPrimary: true }],
  },
  {
    id: 'finalized',
    condition: state.type === 'test' ||
      state.fortuneUsed + (state.insuranceFortuneUsed || 0) >= props.minFortune,
    type: 'buttons',
    text1: 'Vous-êtes arrivé au bout, formidable!',
    hideResult: true,
    buttons: !state.hideFinalButton
      ? [
        {
          id: true,
          label: 'Afficher les résultats',
          onClick() {
              // After clicking on this button, hide it
            setFormState('hideFinalButton', true);
            const options = {
              duration: 350,
              delay: 0,
              smooth: true,
            };
            Meteor.defer(() => Scroll.scroller.scrollTo('final', options));
          },
        },
      ]
      : [],
  },
];

const getFormArray = (state, props, setFormState) =>
  getAcquisitionArray(state, props, setFormState).concat(
    state.type === 'acquisition' ? getErrorArray(state, props) : [], // these errors only for acquisitions
    getFinalArray(state, props, setFormState),
  );

export default getFormArray;
