import React from 'react';
import countries from 'i18n-iso-countries';

import {
  BORROWER_ACTIVITY_TYPES,
  CIVIL_STATUS,
  EXPENSES,
  GENDER,
  OTHER_INCOME,
  RESIDENCY_PERMIT,
} from '../api/borrowers/borrowerConstants';
import { PURCHASE_TYPE } from '../api/loans/loanConstants';
import { RESIDENCE_TYPE } from '../api/properties/propertyConstants';
import BorrowerAddPartner from '../components/BorrowerAddPartner';
import CantonField from '../components/CantonField';
import CityField from '../components/CityField';
import T, { Money } from '../components/Translation';
import Calculator from '../utils/Calculator';
import {
  COMMON_COUNTRIES,
  getSortedCountriesCodes,
} from '../utils/countriesUtils';

const shouldDisplayAddPartner = ({ b: { civilStatus }, multiple, isFirst }) =>
  civilStatus === CIVIL_STATUS.MARRIED && !multiple && isFirst;

const makeArrayOfObjectsInput = (id, required = false) => ({
  id,
  type: 'arrayInput',
  required,
  inputs: [
    { id: 'description', type: 'textInput' },
    { id: 'value', type: 'textInput', money: true },
  ],
  renderRecap: currentValue => (
    <span className="flex center-align fs-110">
      <b>
        <Money value={currentValue.reduce((t, { value: v }) => t + v, 0)} />
      </b>
      &nbsp;-&nbsp;
      <span className="secondary">{currentValue.length} éléments</span>
    </span>
  ),
});

export const getBorrowerInfoArray = ({ borrowers, borrowerId, loanId }) => {
  const b = borrowers.find(({ _id }) => _id === borrowerId);
  const multiple = borrowers.length > 1;
  // If this is the first borrower in the array of borrowers, don't ask for same address
  const isFirst = borrowers[0]._id === borrowerId;
  const isMarried = b.civilStatus === CIVIL_STATUS.MARRIED;
  const isDivorced = b.civilStatus === CIVIL_STATUS.DIVORCED;
  const isSalaried = b.activityType === BORROWER_ACTIVITY_TYPES.SALARIED;
  const isSelfEmployed =
    b.activityType === BORROWER_ACTIVITY_TYPES.SELF_EMPLOYED;
  const isAnnuitant = b.activityType === BORROWER_ACTIVITY_TYPES.ANNUITANT;

  if (!b) {
    throw new Error("couldn't find borrower");
  }

  const disableAddress = !!b.sameAddress && !isFirst;
  const addressFieldsAreNecessary = !b.sameAddress;

  return [
    { id: 'firstName', type: 'textInput' },
    { id: 'lastName', type: 'textInput' },
    {
      type: 'textInput',
      id: 'email',
      placeholder: <T id="Forms.email.placeholder" />,
    },
    {
      type: 'textInput',
      id: 'phoneNumber',
      placeholder: <T id="Forms.phoneNumber.placeholder" />,
    },
    {
      id: 'gender',
      type: 'radioInput',
      options: Object.values(GENDER),
    },
    {
      id: 'sameAddress',
      type: 'radioInput',
      intlValues: { name: borrowers[0].firstName || 'Emprunteur 1' },
      options: [true, false],
      condition: multiple && !isFirst,
    },
    // {
    //   id: 'isForeignAddress',
    //   type: 'radioInput',
    //   options: [true, false],
    //   condition: !disableAddress,
    //   required: addressFieldsAreNecessary,
    // },
    {
      id: 'address1',
      type: 'textInput',
      condition: !disableAddress,
      placeholder: disableAddress && borrowers[0].address1,
      noIntl: disableAddress,
      required: addressFieldsAreNecessary,
    },
    {
      id: 'address2',
      type: 'textInput',
      condition: !disableAddress,
      required: false,
      placeholder: disableAddress && borrowers[0].address2,
      noIntl: disableAddress,
    },
    {
      id: 'zipCode',
      type: 'textInput',
      condition: !disableAddress,
      placeholder: disableAddress && borrowers[0].address1,
      noIntl: disableAddress,
      required: addressFieldsAreNecessary,
    },
    {
      type: 'custom',
      id: 'city',
      component: <CityField doc={b} />,
      condition: !disableAddress,
      required: addressFieldsAreNecessary,
    },
    {
      type: 'custom',
      id: 'canton',
      component: <CantonField canton={b.canton} />,
      condition: !disableAddress,
      required: addressFieldsAreNecessary,
    },
    {
      id: 'country',
      type: 'selectFieldInput',
      condition: !disableAddress,
      placeholder: disableAddress && borrowers[0].address1,
      noIntl: disableAddress,
      required: addressFieldsAreNecessary,
      options: getSortedCountriesCodes(),
      defaultValue: 'CH',
      transform: code => {
        const name = countries.getName(code, 'fr');
        if (COMMON_COUNTRIES.includes(code)) {
          return <b>{name}</b>;
        }
        return countries.getName(code, 'fr');
      },
    },
    {
      type: 'conditionalInput',
      conditionalTrueValue: false,
      inputs: [
        { id: 'isSwiss', type: 'radioInput', options: [true, false] },
        {
          id: 'residencyPermit',
          type: 'selectFieldInput',
          options: Object.values(RESIDENCY_PERMIT),
        },
      ],
    },
    // {
    //   id: 'age',
    //   type: 'textInput',
    //   number: true,
    //   saveOnChange: false,
    // },
    {
      id: 'birthDate',
      type: 'dateInput',
    },
    { id: 'citizenship', type: 'textInput', condition: !b.isSwiss },
    { id: 'isUSPerson', type: 'radioInput', options: [true, false] },
    {
      id: 'civilStatus',
      type: 'radioInput',
      options: Object.values(CIVIL_STATUS).map(value => ({
        id: value,
      })),
    },
    {
      type: 'dateInput',
      id: 'marriedDate',
      condition: isMarried,
    },
    {
      type: 'dateInput',
      id: 'divorcedDate',
      condition: isDivorced,
    },
    {
      id: 'addPartner',
      type: 'custom',
      component: <BorrowerAddPartner loanId={loanId} />,
      condition: shouldDisplayAddPartner({ b, multiple, isFirst }),
      required: false,
    },
    { id: 'childrenCount', type: 'textInput', number: true },
    {
      id: 'activityType',
      type: 'radioInput',
      options: Object.values(BORROWER_ACTIVITY_TYPES),
    },
    {
      type: 'percent',
      id: 'jobActivityRate',
      condition: isSalaried,
      decimalPercent: false,
    },
    {
      id: 'job',
      type: 'textInput',
      condition: isSalaried || isSelfEmployed,
    },
    {
      id: 'company',
      type: 'textInput',
      autoComplete: 'organisation',
      condition: isSalaried,
    },
    {
      type: 'dateInput',
      id: 'jobStartDate',
      condition: isSalaried,
    },
    {
      id: 'worksInSwitzerlandSince',
      type: 'textInput',
      number: true,
      condition: isSalaried,
    },
    {
      type: 'dateInput',
      id: 'selfEmployedSince',
      condition: isSelfEmployed,
    },
    {
      type: 'dateInput',
      id: 'annuitantSince',
      condition: isAnnuitant,
    },
  ];
};

export const getBorrowerIncomeArray = ({ borrower }) => [
  {
    type: 'h3',
    id: 'incomeAndExpenses',
    ignore: true,
    required: false,
    className: 'v-align-incomeAndExpenses',
  },
  { id: 'salary', type: 'textInput', money: true },
  { id: 'netSalary', type: 'textInput', money: true },
  {
    type: 'conditionalInput',
    conditionalTrueValue: true,
    inputs: [
      {
        id: 'bonusExists',
        type: 'radioInput',
        options: [true, false],
      },
      ...[2019, 2018, 2017, 2016, 2015].map(year => ({
        id: `bonus${year}`,
        type: 'textInput',
        money: true,
        condition:
          year === 2015
            ? !!borrower.bonus2015
            : year === 2016
            ? !!borrower.bonus2016
            : true,
      })),
    ],
  },
  {
    id: 'otherIncome',
    type: 'arrayInput',
    required: false,
    inputs: [
      {
        id: 'description',
        type: 'selectInput',
        options: Object.values(OTHER_INCOME),
      },
      { id: 'value', type: 'textInput', money: true },
      { id: 'comment', type: 'textInput', adminOnly: true },
    ],
  },
  {
    id: 'expenses',
    type: 'arrayInput',
    required: false,
    inputs: [
      {
        id: 'description',
        type: 'selectInput',
        options: Object.values(EXPENSES),
      },
      { id: 'value', type: 'textInput', money: true },
      { id: 'comment', type: 'textInput', adminOnly: true },
    ],
  },
  {
    type: 'conditionalInput',
    conditionalTrueValue: true,
    inputs: [
      {
        id: 'hasOwnCompany',
        type: 'radioInput',
        options: [true, false],
      },
      {
        id: 'ownCompanies',
        type: 'arrayInput',
        inputs: [
          { id: 'description', type: 'textInput' },
          {
            id: 'ownership',
            type: 'textInput',
            percent: true,
            decimalPercent: true,
          },
          {
            id: 'netIncome2019',
            type: 'textInput',
            money: true,
            negative: true,
          },
          {
            id: 'netIncome2018',
            type: 'textInput',
            money: true,
            negative: true,
          },
          {
            id: 'netIncome2017',
            type: 'textInput',
            money: true,
            negative: true,
          },
          {
            id: 'netIncome2016',
            type: 'textInput',
            money: true,
            negative: true,
          },
        ],
      },
    ],
  },
];

export const getBorrowerFortuneArray = ({ purchaseType } = {}) => {
  const isRefinancing = purchaseType === PURCHASE_TYPE.REFINANCING;
  return [
    {
      type: 'h3',
      id: 'fortune',
      ignore: true,
      required: false,
      className: 'v-align-fortune',
    },
    makeArrayOfObjectsInput('bankFortune', true),
    makeArrayOfObjectsInput('donation'),
    {
      id: 'realEstate',
      description: isRefinancing && (
        <span className="secondary">
          <T id="Forms.realEstate.refinancingDescription" />
        </span>
      ),
      type: 'arrayInput',
      required: false,
      inputs: [
        { id: 'name', type: 'textInput' },
        {
          id: 'description',
          type: 'selectInput',
          options: Object.values(RESIDENCE_TYPE),
        },
        { id: 'value', type: 'textInput', money: true },
        { id: 'loan', type: 'textInput', money: true },
        { id: 'income', type: 'textInput', money: true, required: false },
        {
          id: 'theoreticalExpenses',
          intlId: 'adminTheoreticalExpenses',
          type: 'textInput',
          money: true,
          adminOnly: true,
        },
        {
          id: 'theoreticalExpenses',
          type: 'custom',
          Component: ({
            InputProps: { currentValue, label, itemValue = {} },
          }) => (
            <div className="flex-col" style={{ paddingLeft: 12 }}>
              <label htmlFor="theoreticalExpenses" style={{ marginBottom: 4 }}>
                {label}
              </label>
              <b>
                <Money
                  id="theoreticalExpenses"
                  value={Calculator.getRealEstateCost(itemValue)}
                  tooltip={
                    currentValue ? undefined : (
                      <T id="Forms.theoreticalExpenses.tooltip" />
                    )
                  }
                />
                <span>
                  &nbsp;/
                  <T id="general.month" />
                </span>
              </b>
            </div>
          ),
        },
      ],
    },
    makeArrayOfObjectsInput('otherFortune'),
  ];
};
export const getBorrowerInsuranceArray = () => [
  {
    type: 'h3',
    id: 'insurance',
    required: false,
    ignore: true,
    className: 'v-align-insurance',
  },
  makeArrayOfObjectsInput('insurance2'),
  makeArrayOfObjectsInput('bank3A'),
  makeArrayOfObjectsInput('insurance3A'),
  makeArrayOfObjectsInput('insurance3B'),
];

export const getBorrowerFinanceArray = ({
  borrowers,
  borrowerId,
  purchaseType,
}) => {
  const b = borrowers.find(({ _id }) => _id === borrowerId);

  if (!b) {
    throw new Error("couldn't find borrower");
  }

  const incomeArray = getBorrowerIncomeArray({ borrower: b });

  const fortuneArray = getBorrowerFortuneArray({ purchaseType });

  const insuranceArray = getBorrowerInsuranceArray();

  return incomeArray.concat([...fortuneArray, ...insuranceArray]);
};

export const getSimpleBorrowerFinanceArray = ({ borrowers, borrowerId }) => {
  const b = borrowers.find(({ _id }) => _id === borrowerId);

  if (!b) {
    throw new Error("couldn't find borrower");
  }

  const incomeArray = [
    {
      type: 'h3',
      id: 'financeInformations',
      ignore: true,
      required: false,
    },
    { id: 'salary', type: 'textInput', money: true },
    { id: 'netSalary', type: 'textInput', money: true },
    {
      type: 'conditionalInput',
      conditionalTrueValue: true,
      inputs: [
        {
          id: 'bonusExists',
          type: 'radioInput',
          options: [true, false],
        },
        ...[2019, 2018, 2017, 2016, 2015].map(year => ({
          id: `bonus${year}`,
          type: 'textInput',
          money: true,
          condition: year === 2015 ? !!b.bonus2015 : true,
        })),
      ],
    },
  ];

  const fortuneArray = [
    {
      id: 'bankFortuneSimple',
      type: 'textInput',
      money: true,
      progressReplacementId: 'bankFortune',
    },
  ];

  const insuranceArray = [
    { id: 'insurance2Simple', type: 'textInput', money: true, required: false },
    { id: 'bank3ASimple', type: 'textInput', money: true, required: false },
    {
      id: 'insurance3ASimple',
      type: 'textInput',
      money: true,
      required: false,
    },
    {
      id: 'insurance3BSimple',
      type: 'textInput',
      money: true,
      required: false,
    },
  ];

  return incomeArray.concat([...fortuneArray, ...insuranceArray]);
};

export const getBorrowerSimpleArray = ({
  borrowers,
  borrowerId,
  loan = {},
}) => {
  const b = borrowers.find(borrower => borrower._id === borrowerId);
  const { simpleBorrowersForm: simple = true } = loan;

  if (!b) {
    throw new Error("couldn't find borrower");
  }

  return [
    { id: 'firstName', type: 'textInput', condition: !loan.anonymous },
    { id: 'lastName', type: 'textInput', condition: !loan.anonymous },
    {
      type: 'h3',
      id: 'personalInformations',
      ignore: true,
      required: false,
    },
    { id: 'birthDate', type: 'dateInput' },
    ...(simple
      ? getSimpleBorrowerFinanceArray({ borrowers, borrowerId })
      : getBorrowerFinanceArray({ borrowers, borrowerId })),
  ];
};
