// @flow
import React from 'react';
import cx from 'classnames';

import { OTHER_INCOME, EXPENSES, OWN_FUNDS_TYPES } from 'core/api/constants';
import { T } from 'core/components/Translation/Translation';
import Calculator from 'core/utils/Calculator';
import { toMoney } from 'core/utils/conversionFunctions';
import PDFTable from '../utils/PDFTable';

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

const getBorrowersInfos = borrowers => ({
  ...getBorrowersSingleInfos(borrowers, [
    'gender',
    'age',
    'childrenCount',
    'company',
    'civilStatus',
    'salary',
    'bankFortune',
    'thirdPartyFortune',
  ]),
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

const getFormattedMoneyArray = (array, negative = false, twoBorrowers) => {
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
  data: getFormattedMoneyArray(field, negative || false, twoBorrowers),
  condition: condition || shouldRenderArray(field),
});

const addTableEmptyLine = () => ({
  label: '\u00A0',
});

const addTableCategoryTitle = title => ({
  label: (
    <p style={{ fontWeight: 'bold', textTransform: 'uppercase' }}>{title}</p>
  ),
});

const getBorrowersInfosArray = (borrowers) => {
  const borrowersInfos = getBorrowersInfos(borrowers);
  return [
    {
      label: '\u00A0',
      data: [
        ...borrowersInfos.gender.map(gender => (
          <T id={`PDF.borrowersInfos.gender.${gender}`} />
        )),
      ],
      style: { fontWeight: 'bold' },
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

const getBorrowersFinanceArray = (borrowers) => {
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
          ...genders.map(gender => (
            <T id={`PDF.borrowersInfos.gender.${gender}`} key="gender" />
          )),
          <T id="PDF.borrowersInfos.total" key="total" />,
        ]
        : [
          ...genders.map(gender => (
            <T id={`PDF.borrowersInfos.gender.${gender}`} key="gender" />
          )),
        ],
      style: { fontWeight: 'bold' },
    },
    addTableCategoryTitle(<T id="PDF.borrowersInfos.category.income" />),
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
    addTableEmptyLine(),
    {
      label: (
        <p style={{ fontWeight: 'bold' }}>
          <T id="PDF.borrowersInfos.totalIncome" />
        </p>
      ),
      data: getFormattedMoneyArray(borrowers.map(borrower =>
        Calculator.getTotalIncome({ borrowers: borrower }))),
      style: { fontWeight: 'bold' },
      condition: false,
    },
    addTableEmptyLine(),
    addTableCategoryTitle(<T id="PDF.borrowersInfos.category.fortune" />),
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
    addTableEmptyLine(),
    {
      label: (
        <p style={{ fontWeight: 'bold' }}>
          <T id="PDF.borrowersInfos.totalFortune" />
        </p>
      ),
      data: getFormattedMoneyArray(borrowers.map(borrower =>
        Calculator.getTotalFunds({ borrowers: borrower }))),
      style: { fontWeight: 'bold' },
    },
  ];
};

const BorrowersRecap = ({ borrowers, twoBorrowers }: BorrowersRecapProps) => (
  <>
    <h2>Informations générales</h2>
    <PDFTable
      className={cx('borrowers-recap info', { twoBorrowers })}
      rows={getBorrowersInfosArray(borrowers)}
    />
    <h2>Situation financière</h2>
    <PDFTable
      className={cx('borrowers-recap finance', { twoBorrowers })}
      rows={getBorrowersFinanceArray(borrowers)}
    />
  </>
);

export default BorrowersRecap;
