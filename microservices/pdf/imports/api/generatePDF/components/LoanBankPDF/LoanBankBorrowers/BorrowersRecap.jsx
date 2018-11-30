// @flow
import React from 'react';
import cx from 'classnames';

import { OTHER_INCOME, EXPENSES, OWN_FUNDS_TYPES } from 'core/api/constants';
import T from 'core/components/Translation';
import Calculator from 'core/utils/Calculator';
import { toMoney } from 'core/utils/conversionFunctions';
import PdfTable from '../../PdfTable';
import { ROW_TYPES } from '../../PdfTable/PdfTable';
import { BORDER_BLUE } from '../../cssConstants';

type BorrowersRecapProps = {
  borrowers: Array<Object>,
};

const getBorrowersSingleInfo = (borrowers, info) =>
  borrowers.map(borrower => borrower[info] || 0);

const getBorrowersSingleInfos = (borrowers, infos) =>
  infos.reduce(
    (borrowersInfos, info) => ({
      ...borrowersInfos,
      [info]: getBorrowersSingleInfo(borrowers, info),
    }),
    {},
  );

const getBorrowersOtherIncome = (borrowers, type) =>
  borrowers.map(({ otherIncome }) =>
    otherIncome
      && otherIncome
        .filter(income => type.includes(income.description))
        .reduce((sum, income) => sum + income.value, 0));

const getBorrowersOtherIncomes = (borrowers, types) =>
  types.reduce(
    (borrowersOtherIncomes, type) => ({
      ...borrowersOtherIncomes,
      [type]: getBorrowersOtherIncome(borrowers, [type]),
    }),
    {},
  );

const getBorrowersOtherFortune = borrowers =>
  borrowers.map(({ otherFortune }) =>
    otherFortune
      && otherFortune.reduce((sum, fortune) => sum + fortune.value, 0));

const getBorrowersExpense = (borrowers, type) =>
  borrowers.map(({ expenses }) =>
    expenses
      && expenses
        .filter(expense => type.includes(expense.description))
        .reduce((sum, expense) => sum + expense.value, 0));

const getBorrowersExpenses = (borrowers, types) =>
  types.reduce(
    (borrowersExpenses, type) => ({
      ...borrowersExpenses,
      [type]: getBorrowersExpense(borrowers, [type]),
    }),
    {},
  );

const getBorrowersOwnFunds = (borrowers, types) =>
  types.reduce(
    (ownFunds, type) => ({
      ...ownFunds,
      [type]: borrowers.map(borrower =>
        borrower[type]
          && borrower[type].reduce((sum, ownFund) => sum + ownFund.value, 0)),
    }),
    {},
  );

const getBorrowersAddress = (borrowers) => {
  if (borrowers.some(({ sameAddress }) => sameAddress === true)) {
    const borrowerWithAddress = borrowers.find(({ city, zipCode }) => city && zipCode);
    const address = [
      borrowerWithAddress.zipCode,
      borrowerWithAddress.city,
    ].join(' ');
    return [address, address];
  }
  const zipCodes = getBorrowersSingleInfo(borrowers, 'zipCode');
  const cities = getBorrowersSingleInfo(borrowers, 'city');
  return zipCodes.map((zipCode, index) => `${zipCode} ${cities[index]}`);
};

const getBorrowersInfos = borrowers => ({
  ...getBorrowersSingleInfos(borrowers, [
    'name',
    'gender',
    'age',
    'childrenCount',
    'company',
    'civilStatus',
    'salary',
    'bankFortune',
    'thirdPartyFortune',
  ]),
  address: getBorrowersAddress(borrowers),
  otherIncome: {
    ...getBorrowersOtherIncomes(borrowers, Object.values(OTHER_INCOME)),
    totalIncome: getBorrowersOtherIncome(
      borrowers,
      Object.values(OTHER_INCOME),
    ),
  },
  expenses: {
    ...getBorrowersExpenses(borrowers, Object.values(EXPENSES)),
    totalExpenses: getBorrowersExpense(borrowers, Object.values(EXPENSES)),
  },
  bonus: borrowers.map(borrower =>
    Calculator.getBonusIncome({ borrowers: borrower })),
  otherFortune: getBorrowersOtherFortune(borrowers),
  realEstateValue: borrowers.map(borrower =>
    Calculator.getRealEstateValue({ borrowers: borrower })),
  realEstateDebt: borrowers.map(borrower =>
    Calculator.getRealEstateDebt({ borrowers: borrower })),
  ...getBorrowersOwnFunds(borrowers, [
    OWN_FUNDS_TYPES.INSURANCE_2,
    OWN_FUNDS_TYPES.INSURANCE_3A,
    OWN_FUNDS_TYPES.BANK_3A,
    OWN_FUNDS_TYPES.INSURANCE_3B,
  ]),
});

const getArraySum = array => array.reduce((sum, val) => sum + val, 0);

const getFormattedMoneyArray = ({ array, negative = false, twoBorrowers }) => {
  if (!twoBorrowers) {
    return [
      ...array.map((x, index) => (
        <div className="money-amount" key={index}>
          {toMoney(negative ? -x : x || 0)}
        </div>
      )),
    ];
  }

  return [
    ...array.map((x, index) => (
      <div className="money-amount" key={index}>
        {toMoney(negative ? -x : x || 0)}
      </div>
    )),

    <div className="money-amount" key="last">
      {toMoney(negative ? -getArraySum(array) : getArraySum(array))}
    </div>,
  ];
};

const shouldRenderArray = array => array.filter(x => x).length > 0;

const makeTableMoneyLine = twoBorrowers => ({
  label,
  field,
  negative,
  condition,
}) => ({
  label,
  data: getFormattedMoneyArray({
    array: field,
    negative: negative || false,
    twoBorrowers,
  }),
  condition: condition || shouldRenderArray(field),
});

const addTableEmptyLine = () => ({
  label: '\u00A0',
  type: ROW_TYPES.EMPTY,
});

const addTableCategoryTitle = ({ title, multipleBorrowers }) => ({
  label: title,
  type: ROW_TYPES.TITLE_NO_PADDING,
  colspan: multipleBorrowers ? 4 : 2,
});

const getBorrowersName = ({ borrowersInfos, anonymous }) => (anonymous
  ? [
    ...borrowersInfos.gender.map(gender => (
      <T id={`PDF.borrowersInfos.gender.${gender}`} />
    )),
  ]
  : borrowersInfos.name);

const getBorrowersInfosArray = ({ borrowers, anonymous }) => {
  const borrowersInfos = getBorrowersInfos(borrowers);
  return [
    {
      label: '\u00A0',
      data: getBorrowersName({borrowersInfos, anonymous}),
      style: { fontWeight: 'bold', color: BORDER_BLUE },
    },
    {
      label: <T id="PDF.borrowersInfo.address" />,
      data: borrowersInfos.address,
    },
    {
      label: <T id="PDF.borrowersInfos.age" />,
      data: borrowersInfos.age,
    },
    {
      label: <T id="PDF.borrowersInfos.children" />,
      data: [...borrowersInfos.childrenCount.map(children => children || '-')],
      condition: shouldRenderArray(borrowersInfos.childrenCount),
    },
    {
      label: <T id="PDF.borrowersInfos.company" />,
      data: [...borrowersInfos.company.map(company => company || '-')],
      condition: shouldRenderArray(borrowersInfos.company),
    },
    {
      label: <T id="PDF.borrowersInfos.civilStatus" />,
      data: [
        ...borrowersInfos.civilStatus.map(status =>
          <T id={`PDF.borrowersInfos.civilStatus.${status}`} /> || '-'),
      ],
      condition: borrowersInfos.civilStatus.filter(x => x).length > 0,
    },
  ];
};

const getBorrowersFinanceArray = ({borrowers, anonymous}) => {
  const multipleBorrowers = borrowers.length > 1;
  const addTableMoneyLine = makeTableMoneyLine(multipleBorrowers);
  const borrowersInfos = getBorrowersInfos(borrowers);
  const {
    gender: genders,
    salary,
    bonus,
    otherIncome,
    expenses,
    realEstateValue,
    realEstateDebt,
    otherFortune,
  } = borrowersInfos;

  return [
    {
      label: '\u00A0',
      data: multipleBorrowers
        ? [
          ...getBorrowersName({ borrowersInfos, anonymous }),
          <T id="PDF.borrowersInfos.total" key="total" />,
        ]
        : getBorrowersName({ borrowersInfos, anonymous }),
      style: { fontWeight: 'bold', color: BORDER_BLUE },
    },
    addTableCategoryTitle({
      title: <T id="PDF.borrowersInfos.category.income" />,
      multipleBorrowers,
    }),
    addTableMoneyLine({
      label: <T id="PDF.borrowersInfos.salary" />,
      field: salary,
      condition: true,
    }),
    addTableMoneyLine({
      label: <T id="PDF.borrowersInfos.bonus" />,
      field: bonus,
    }),
    ...Object.values(OTHER_INCOME).map(income =>
      addTableMoneyLine({
        label: <T id={`PDF.borrowersInfos.otherIncome.${income}`} />,
        field: otherIncome[income],
      })),
    ...Object.values(EXPENSES).map(expense =>
      addTableMoneyLine({
        label: <T id={`PDF.borrowersInfos.expenses.${expense}`} />,
        field: expenses[expense],
        negative: true,
      })),
    {
      label: <T id="PDF.borrowersInfos.totalIncome" />,
      data: getFormattedMoneyArray({
        array: borrowers.map(borrower =>
          Calculator.getTotalIncome({ borrowers: borrower })),
        negative: false,
        twoBorrowers: multipleBorrowers,
      }),
      type: ROW_TYPES.SUM,
    },
    addTableEmptyLine(),
    addTableCategoryTitle({
      title: <T id="PDF.borrowersInfos.category.fortune" />,
      multipleBorrowers,
    }),
    ...Object.values(OWN_FUNDS_TYPES).map(ownFund =>
      addTableMoneyLine({
        label: <T id={`PDF.borrowersInfos.ownFund.${ownFund}`} />,
        field: borrowersInfos[ownFund],
      })),
    addTableMoneyLine({
      label: <T id="PDF.borrowersInfos.realEstateValue" />,
      field: realEstateValue,
    }),
    addTableMoneyLine({
      label: <T id="PDF.borrowersInfos.realEstateDebt" />,
      field: realEstateDebt,
      condition: shouldRenderArray(realEstateValue),
      negative: true,
    }),
    addTableMoneyLine({
      label: <T id="PDF.borrowersInfos.otherFortune" />,
      field: otherFortune,
    }),
    {
      label: <T id="PDF.borrowersInfos.totalFortune" />,
      data: getFormattedMoneyArray({
        array: borrowers.map(borrower =>
          Calculator.getTotalFunds({ borrowers: borrower })),
        negative: false,
        twoBorrowers: multipleBorrowers,
      }),
      type: ROW_TYPES.SUM,
    },
  ];
};

const BorrowersRecap = ({
  borrowers,
  twoBorrowers,
  anonymous = false,
}: BorrowersRecapProps) => (
  <>
    <h2>Informations générales</h2>
    <PdfTable
      className={cx('borrowers-recap info', { twoBorrowers })}
      rows={getBorrowersInfosArray({ borrowers, anonymous })}
    />
    <h2>Situation financière</h2>
    <PdfTable
      className={cx('borrowers-recap finance', { twoBorrowers })}
      rows={getBorrowersFinanceArray({borrowers, anonymous })}
    />
  </>
);

export default BorrowersRecap;
