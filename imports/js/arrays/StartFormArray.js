import React from 'react';
import { Meteor } from 'meteor/meteor';
import Scroll from 'react-scroll';

import FortuneSliders from '/imports/ui/pages/public/startPage/FortuneSliders.jsx';
import DialogSimple from '/imports/ui/components/general/DialogSimple.jsx';
import { T, IntlNumber } from '/imports/ui/components/general/Translation.jsx';

import constants from '/imports/js/config/constants';

export const getAcquisitionArray = (state, props, setFormState) => [
  {
    id: 'propertyValue',
    condition: state.knowsProperty === true,
    type: 'textInput',
    money: true,
  },
  {
    id: 'notaryFeesAgreed',
    condition: state.knowsProperty === true,
    type: 'buttons',
    intlValues: {
      value: (
        <span className="active">
          <IntlNumber value={0.05 * state.propertyValue} format="money" />
        </span>
      ),
    },
    hideResult: true,
    buttons: [
      {
        id: true,
        noPrimary: true,
        secondary: true,
        className: 'animated infinite pulse',
        label: <T id="general.continue" />,
      },
    ],
  },
  {
    id: 'propertyWorkExists',
    condition: state.knowsProperty === true,
    type: 'buttons',
    question: true,
    buttons: [
      { id: true, label: <T id="general.yes" /> },
      { id: false, label: <T id="general.no" /> },
    ],
    deleteId: 'propertyWork',
  },
  {
    id: 'propertyWork',
    condition: state.propertyWorkExists === true,
    type: 'textInput',
    money: true,
  },
  {
    id: 'projectAgreed',
    condition: state.propertyWork !== undefined && state.propertyWork !== 0,
    type: 'buttons',
    intlValues: {
      value: (
        <span className="active">
          <IntlNumber
            value={1.05 * state.propertyValue + (state.propertyWork || 0)}
            format="money"
          />
        </span>
      ),
    },
    hideResult: true,
    buttons: [{ id: true, label: 'Continuer' }],
  },
  {
    id: 'usageType',
    type: 'buttons',
    question: true,
    buttons: [
      { id: 'primary', label: <T id="Start2Form.usageTypeButtonPrincipal" /> },
      {
        id: 'secondary',
        label: <T id="Start2Form.usageTypeButtonSecondary" />,
      },
      {
        id: 'investment',
        label: <T id="Start2Form.usageTypeButtonInvestment" />,
      },
    ],
  },
  {
    id: 'propertyRent',
    condition: state.usageType === 'investment',
    type: 'textInput',
    money: true,
  },
  {
    id: 'borrowerCount',
    type: 'buttons',
    question: true,
    buttons: [
      { id: 1, label: <T id="general.1" /> },
      { id: 2, label: <T id="general.2" /> },
    ],
  },
  {
    id: 'age',
    condition: state.borrowerCount === 1,
    type: 'textInput',
    text2: true,
    placeholder: '18',
    number: true,
    width: 50,
    validation: { min: 18, max: 120 },
  },
  {
    id: 'oldestAge',
    condition: state.borrowerCount > 1,
    type: 'textInput',
    text2: true,
    placeholder: '18',
    number: true,
    width: 50,
    validation: { min: 18, max: 120 },
  },
  {
    id: 'gender',
    condition: state.borrowerCount === 1 && state.age >= 50,
    type: 'buttons',
    text2: true,
    buttons: [
      { id: 'f', label: <T id="Start2Form.gender.woman" /> },
      { id: 'm', label: <T id="Start2Form.gender.man" /> },
    ],
  },
  {
    id: 'oldestGender',
    condition: state.borrowerCount > 1 && state.oldestAge >= 50,
    type: 'buttons',
    buttons: [
      { id: 'f', label: <T id="Start2Form.gender.woman" /> },
      { id: 'm', label: <T id="Start2Form.gender.man" /> },
    ],
  },
  {
    id: 'initialIncomeAgreed',
    type: 'buttons',
    intlValues: {
      value: (
        <span className="active">
          <IntlNumber value={state.initialIncome} format="money" />
        </span>
      ),
    },
    hideResult: true,
    buttons: [{ id: true, label: 'Ok' }],
  },
  {
    id: 'income',
    type: 'multipleInput',
    firstMultiple: true,
    money: true,
    zeroAllowed: true,
  },
  {
    id: 'bonusExists',
    type: 'buttons',
    question: true,
    buttons: [
      { id: true, label: <T id="general.yes" /> },
      { id: false, label: <T id="general.no" /> },
    ],
  },
  {
    id: 'bonus4',
    condition: state.bonusExists === true,
    type: 'multipleInput',
    money: true,
    zeroAllowed: true,
  },
  {
    id: 'bonus3',
    condition: state.bonusExists === true,
    type: 'multipleInput',
    money: true,
    zeroAllowed: true,
  },
  {
    id: 'bonus2',
    condition: state.bonusExists === true,
    type: 'multipleInput',
    money: true,
    zeroAllowed: true,
  },
  {
    id: 'bonus1',
    condition: state.bonusExists === true,
    type: 'multipleInput',
    money: true,
    zeroAllowed: true,
  },
  {
    id: 'otherIncome',
    type: 'buttons',
    question: true,
    deleteId: 'otherIncomeArray',
    buttons: [
      { id: true, label: <T id="general.yes" /> },
      { id: false, label: <T id="general.no" /> },
    ],
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
      },
    ],
  },
  {
    id: 'expensesExist',
    type: 'buttons',
    intlValues: {
      optional: state.usageType !== 'primary' ? 'rentes, ' : '',
    },
    question: true,
    deleteId: 'expensesArray',
    buttons: [
      { id: true, label: <T id="general.yes" /> },
      { id: false, label: <T id="general.no" /> },
    ],
  },
  {
    id: 'expensesArray',
    condition: state.expensesExist === true,
    existId: 'expensesExist',
    type: 'arrayInput',
    inputs: [
      {
        id: 'description',
        type: 'selectInput',
        options: [
          { id: 'leasing' },
          { id: 'rent' },
          { id: 'personalLoan' },
          { id: 'mortgageLoan' },
          { id: 'pensions' },
          { id: 'other' },
        ],
      },
      {
        id: 'value',
        type: 'textInput',
        money: true,
        zeroAllowed: true,
      },
    ],
  },
  {
    id: 'initialFortuneAgreed',
    type: 'buttons',
    intlValues: {
      value: (
        <span className="active">
          <IntlNumber value={state.initialFortune} format="money" />
        </span>
      ),
    },
    hideResult: true,
    buttons: [{ id: true, label: 'Ok' }],
  },
  {
    id: 'fortune',
    type: 'multipleInput',
    firstMultiple: true,
    question: true,
    money: true,
    zeroAllowed: state.borrowerCount > 1,
  },
  {
    id: 'insurance1Exists',
    condition: state.usageType === 'primary',
    type: 'buttons',
    question: true,
    buttons: [
      { id: true, label: <T id="general.yes" /> },
      {
        id: false,
        label: <T id="general.no" />,
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
    money: true,
  },
  {
    id: 'insurance2Exists',
    condition: state.usageType === 'primary',
    type: 'buttons',
    question: true,
    buttons: [
      { id: true, label: <T id="general.yes" /> },
      {
        id: false,
        label: <T id="general.no" />,
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
    money: true,
  },
  {
    id: 'realEstateExists',
    type: 'buttons',
    question: true,
    deleteId: 'realEstateArray',
    buttons: [
      { id: true, label: <T id="general.yes" /> },
      { id: false, label: <T id="general.no" /> },
    ],
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
        options: [{ id: 'primary' }, { id: 'secondary' }, { id: 'investment' }],
      },
      {
        id: 'value',
        type: 'textInput',
        money: true,
      },
      {
        id: 'loan',
        type: 'textInput',
        money: true,
        zeroAllowed: true,
      },
    ],
  },
];

export const getErrorArray = (state, props, setFormState) => [
  {
    id: 'notEnoughCash',
    error: true,
    condition:
      state.usageType === 'primary' &&
      (props.fortune < props.minCash &&
        props.insuranceFortune >= 0.1 * props.propAndWork),
    type: 'buttons',
    intlValues: {
      value: (
        <span className="body">
          <IntlNumber value={props.minCash} format="money" />
        </span>
      ),
    },
    buttons: [
      {
        id: false,
        label: <T id="general.modify" />,
        onClick() {
          setFormState('activeLine', 'fortune', () => {
            const options = {
              duration: 350,
              delay: 0,
              smooth: true,
              offset: -86,
            };
            Meteor.defer(() => {
              Scroll.scroller.scrollTo('fortune', options);
            });
          });
        },
      },
      {
        id: undefined,
        component: (
          <DialogSimple
            label={<T id="Start2Form.whyButton" />}
            title={<T id="Start2Form.notEnoughCash.dialogTitle" />}
            key={2}
            rootStyle={{
              display: 'inline-block',
              marginRight: 8,
              marginBottom: 8,
            }}
          >
            <T id="Start2Form.notEnoughCash.description" />
          </DialogSimple>
        ),
      },
    ],
  },
  {
    id: 'notEnoughOwnFunds',
    error: true,
    condition: props.fortune + props.insuranceFortune < props.minFortune,
    type: 'buttons',
    intlValues: {
      value: (
        <span className="body">
          <IntlNumber value={props.minFortune} format="money" />
        </span>
      ),
    },
    buttons: [
      {
        id: false,
        label: <T id="general.modify" />,
        onClick() {
          setFormState('activeLine', 'fortune', () => {
            const options = {
              duration: 350,
              delay: 0,
              smooth: true,
              offset: -86,
            };
            Meteor.defer(() => {
              Scroll.scroller.scrollTo('fortune', options);
            });
          });
        },
      },
      {
        id: undefined,
        component: (
          <DialogSimple
            label={<T id="Start2Form.whyButton" />}
            title={<T id="Start2Form.notEnoughOwnFunds.dialogTitle" />}
            key={2}
            rootStyle={{
              display: 'inline-block',
              marginRight: 8,
              marginBottom: 8,
            }}
          >
            <T id="Start2Form.notEnoughOwnFunds.description" />
          </DialogSimple>
        ),
      },
    ],
  },
];

export const getFinalArray = (state, props, setFormState) => [
  {
    id: 'acceptedLoan',
    condition: state.type === 'acquisition',
    type: 'buttons',
    intlValues: {
      value: (
        <span className="active">
          <IntlNumber value={props.maxLoan} format="money" />
        </span>
      ),
    },
    hideResult: true,
    buttons: [
      {
        id: true,
        label: 'Ok',
        onClick() {
          setFormState('loanWanted', props.maxLoan);
        },
      },
      {
        id: false,
        label: <T id="general.modify" />,
        onClick() {
          setFormState('loanWanted', undefined);
        },
      },
    ],
  },
  {
    id: 'loanWanted',
    condition: state.type === 'acquisition' && state.acceptedLoan === false,
    type: 'sliderInput',
    child1: (
      <span className="loanWanted-slider">
        <div>
          <label htmlFor="">
            <T id="general.mortgageLoan" />
          </label>
          <span className="active">
            <IntlNumber
              value={state.loanWanted || props.maxLoan}
              format="money"
            />
          </span>
        </div>
        <div>
          <label htmlFor="">
            <T id="general.ownFunds" />
          </label>
          <span className="body">
            <IntlNumber
              value={props.fortuneNeeded || props.project - props.maxLoan}
              format="money"
            />
          </span>
        </div>
      </span>
    ),
    money: true,
    question: true,
    sliderMin: Math.max(100000, props.minLoan),
    sliderMax: props.maxLoan,
    initialValue: props.maxLoan,
    sliderLabels: [
      <T id="Start2Form.loanWanted.sliderMin" />,
      <T id="Start2Form.loanWanted.sliderMax" />,
    ],
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
      max:
        state.usageType === 'secondary'
          ? Math.ceil(0.7 * props.propAndWork)
          : Math.ceil(0.8 * props.propAndWork),
    },
  },
  {
    id: 'fortuneRequiredAgreed',
    condition:
      state.type === 'acquisition' &&
      (state.usageType !== 'primary' ||
        (state.usageType === 'primary' && props.insuranceFortune <= 0)),
    type: 'buttons',
    intlValues: {
      value: (
        <span className="active">
          <IntlNumber value={props.fortuneNeeded} format="money" />
        </span>
      ),
    },
    hideResult: true,
    buttons: [
      {
        id: true,
        label: <T id="general.continue" />,
        onClick() {
          setFormState('fortuneUsed', props.fortuneNeeded);
        },
      },
    ],
  },
  {
    id: 'useInsurance1',
    condition:
      state.type === 'acquisition' &&
      state.usageType === 'primary' &&
      props.fortune >= props.fortuneNeeded &&
      props.insuranceFortune > 0,
    type: 'buttons',
    buttons: [
      {
        id: true,
        label: <T id="general.yes" />,
        onClick() {
          // fortuneUsed value is undefined at this point, however,
          // if the user changes his mind, set it back to undefined if it was previously set
          setFormState('fortuneUsed', undefined);
        },
      },
      {
        id: false,
        label: <T id="general.no" />,
        onClick() {
          setFormState('fortuneUsed', props.fortuneNeeded);
          setFormState('insuranceFortuneUsed', 0);
        },
      },
      {
        id: undefined,
        component: (
          <DialogSimple
            label={<T id="Start2Form.whyButton" />}
            title={<T id="Start2Form.useInsurance1.dialogTitle" />}
            key={2}
            rootStyle={{
              display: 'inline-block',
              marginRight: 8,
              marginBottom: 8,
            }}
          >
            <T id="Start2Form.useInsurance1.description" />
          </DialogSimple>
        ),
      },
    ],
    question: true,
  },
  {
    id: 'useInsurance2',
    condition:
      state.type === 'acquisition' &&
      state.usageType === 'primary' &&
      props.fortune < props.fortuneNeeded,
    type: 'buttons',
    buttons: [
      { id: true, label: 'Ok' },
      {
        id: undefined,
        component: (
          <DialogSimple
            label={<T id="Start2Form.whyButton" />}
            title={<T id="Start2Form.useInsurance1.dialogTitle" />}
            key={2}
            rootStyle={{
              display: 'inline-block',
              marginRight: 8,
              marginBottom: 8,
            }}
          >
            <T id="Start2Form.useInsurance2.description" />
          </DialogSimple>
        ),
      },
    ],
    question: true,
  },
  {
    id: 'insuranceConditions',
    condition: state.useInsurance1 === true || state.useInsurance2 === true,
    type: 'buttons',
    question: true,
    buttons: [
      {
        id: true,
        label: <T id="general.yes" />,
        onClick() {
          setFormState('cantUseInsurance', false);
        },
      },
      {
        id: false,
        label: <T id="general.no" />,
        onClick() {
          setFormState('cantUseInsurance', true);
          setFormState('insuranceFortuneUsed', 0);
        },
      },
      {
        id: undefined,
        component: (
          <DialogSimple
            secondary
            label={<T id="Start2Form.insuranceConditions.button" />}
            title={<T id="Start2Form.insuranceConditions.title" />}
            key={2}
            rootStyle={{
              display: 'inline-block',
              marginRight: 8,
              marginBottom: 8,
            }}
          >
            <T id="Start2Form.insuranceConditions.description" />
            <br />
            <br />
            <ul>
              <li>
                <T id="Start2Form.insuranceConditions.1" />
              </li>
              <li>
                <T id="Start2Form.insuranceConditions.2" />
              </li>
            </ul>
          </DialogSimple>
        ),
      },
    ],
  },
  {
    id: 'fortuneSliders',
    condition:
      state.type === 'acquisition' &&
      state.usageType === 'primary' &&
      (state.useInsurance1 === true || state.useInsurance2 === true) &&
      state.insuranceConditions === true,
    type: 'custom',
    component: FortuneSliders,
    // minFortune is required to do math in the FortuneSliders component
    minFortune: props.minFortune,
    fortune: props.fortune,
    validation: () =>
      state.fortuneUsed + (state.insuranceFortuneUsed || 0) >=
        props.minFortune && state.fortuneUsed >= props.minCash,
    intlValues: {
      value: (
        <span className="active">
          <IntlNumber value={props.project - state.loanWanted} format="money" />
        </span>
      ),
    },
    sliders: [
      {
        id: 'fortuneUsed',
        sliderMin: Math.max(
          props.fortuneNeeded - props.insuranceFortune,
          props.minCash,
        ),
        sliderMax:
          props.fortune >= props.fortuneNeeded
            ? props.fortuneNeeded
            : props.fortune,
      },
      {
        id: 'insuranceFortuneUsed',
        sliderMin:
          props.fortune >= props.fortuneNeeded
            ? 0
            : props.fortuneNeeded - props.fortune,
        sliderMax: Math.min(
          props.insuranceFortune,
          props.fortuneNeeded - props.minCash,
        ),
      },
    ],
  },
  {
    id: 'notEnoughIncome',
    error: true,
    condition:
      (props.income && props.monthly / ((props.income - props.expenses) / 12)) >
      0.38,
    type: 'buttons',
    intlValues: {
      value: (
        <span className="body">
          <IntlNumber
            // props.monthly represents 38% of the monthly cost,
            // then convert it to yearly, and round it up to avoid errors.
            value={
              Math.round(props.monthly / constants.maxRatio * 12 / 1000) * 1000
            }
            format="money"
          />
        </span>
      ),
    },
    buttons: [
      {
        id: false,
        label: <T id="general.modify" />,
        onClick() {
          setFormState('activeLine', 'income', () => {
            const options = {
              duration: 350,
              delay: 0,
              smooth: true,
              offset: -86,
            };
            Meteor.defer(() => {
              Scroll.scroller.scrollTo('income', options);
            });
          });
        },
      },
      {
        id: undefined,
        component: (
          <DialogSimple
            label={<T id="Start2Form.whyButton" />}
            title={<T id="Start2Form.notEnoughIncome.dialogTitle" />}
            key={2}
            rootStyle={{
              display: 'inline-block',
              marginRight: 8,
              marginBottom: 8,
            }}
          >
            <T id="Start2Form.notEnoughIncome.description" />
          </DialogSimple>
        ),
      },
    ],
  },
  {
    id: 'finalized',
    condition:
      state.type === 'test' ||
      state.fortuneUsed + (state.insuranceFortuneUsed || 0) >= props.minFortune,
    type: 'buttons',
    hideResult: true,
    buttons: !state.hideFinalButton
      ? [
        {
          id: true,
          label: <T id="Start2Form.finalized.button" />,
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
    state.type === 'acquisition'
      ? getErrorArray(state, props, setFormState)
      : [], // these errors only for acquisitions
    getFinalArray(state, props, setFormState),
  );

export default getFormArray;
