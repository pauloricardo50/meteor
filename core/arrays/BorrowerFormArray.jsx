import * as constants from 'core/api/constants';
import React from 'react';

import CantonField from 'core/components/CantonField/CantonField';
import BorrowerAddPartner from '../components/BorrowerAddPartner';

const shouldDisplayAddPartner = ({ b: { civilStatus }, multiple, isFirst }) =>
  civilStatus === constants.CIVIL_STATUS.MARRIED && !multiple && isFirst;

const makeArrayOfObjectsInput = id => ({
  id,
  type: 'arrayInput',
  required: false,
  inputs: [
    { id: 'description', type: 'textInput' },
    { id: 'value', type: 'textInput', money: true },
  ],
});

export const getBorrowerInfoArray = ({ borrowers, borrowerId, loanId }) => {
  const b = borrowers.find(({ _id }) => _id === borrowerId);
  const multiple = borrowers.length > 1;
  // If this is the first borrower in the array of borrowers, don't ask for same address
  const isFirst = borrowers[0]._id === borrowerId;

  if (!b) {
    throw new Error("couldn't find borrower");
  }

  const disableAddress = !!b.sameAddress && !isFirst;
  const addressFieldsAreNecessary = !b.sameAddress;

  return [
    { id: 'firstName', type: 'textInput' },
    { id: 'lastName', type: 'textInput' },
    {
      id: 'gender',
      type: 'radioInput',
      options: Object.values(constants.GENDER),
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
      id: 'city',
      type: 'textInput',
      condition: !disableAddress,
      placeholder: disableAddress && borrowers[0].address1,
      noIntl: disableAddress,
      required: addressFieldsAreNecessary,
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
      id: 'canton',
      component: <CantonField canton={b.canton} />,
      condition: !disableAddress,
      required: addressFieldsAreNecessary,
    },
    {
      type: 'conditionalInput',
      conditionalTrueValue: false,
      inputs: [
        { id: 'isSwiss', type: 'radioInput', options: [true, false] },
        {
          id: 'residencyPermit',
          type: 'selectFieldInput',
          options: Object.values(constants.RESIDENCY_PERMIT),
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
      options: Object.values(constants.CIVIL_STATUS).map(value => ({
        id: value,
      })),
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
      id: 'company',
      type: 'textInput',
      required: false,
      autoComplete: 'organisation',
    },
  ];
};

export const getBorrowerFinanceArray = ({ borrowers, borrowerId }) => {
  const b = borrowers.find(({ _id }) => _id === borrowerId);

  if (!b) {
    throw new Error("couldn't find borrower");
  }

  const incomeArray = [
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
          condition: year === 2015 ? !!b.bonus2015 : true,
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
          options: Object.values(constants.OTHER_INCOME),
        },
        { id: 'value', type: 'textInput', money: true },
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
          options: Object.values(constants.EXPENSES),
        },
        { id: 'value', type: 'textInput', money: true },
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
            { id: 'ownership', type: 'textInput', percent: true },
            { id: 'netIncome2018', type: 'textInput', money: true },
            { id: 'netIncome2017', type: 'textInput', money: true },
            { id: 'netIncome2016', type: 'textInput', money: true },
          ],
        },
      ],
    },
  ];

  const fortuneArray = [
    {
      type: 'h3',
      id: 'fortune',
      ignore: true,
      required: false,
      className: 'v-align-fortune',
    },
    { id: 'bankFortune', type: 'textInput', money: true },
    {
      id: 'thirdPartyFortune',
      type: 'textInput',
      money: true,
      required: false,
    },
    {
      id: 'realEstate',
      type: 'arrayInput',
      required: false,
      inputs: [
        { id: 'name', type: 'textInput' },
        {
          id: 'description',
          type: 'selectInput',
          options: Object.values(constants.RESIDENCE_TYPE),
        },
        { id: 'value', type: 'textInput', money: true },
        { id: 'loan', type: 'textInput', money: true },
        { id: 'income', type: 'textInput', money: true, required: false },
      ],
    },
    makeArrayOfObjectsInput('otherFortune'),
  ];

  const insuranceArray = [
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
      className: 'v-align-financeInformations',
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

  const fortuneArray = [{ id: 'bankFortune', type: 'textInput', money: true }];

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
    { id: 'birthDate', type: 'dateInput', condition: !loan.anonymous },
    ...(simple
      ? getSimpleBorrowerFinanceArray({ borrowers, borrowerId })
      : getBorrowerFinanceArray({ borrowers, borrowerId })),
  ];
};
