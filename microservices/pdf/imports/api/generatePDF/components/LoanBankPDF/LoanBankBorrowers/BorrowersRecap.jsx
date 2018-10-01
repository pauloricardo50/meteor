// @flow
import React from 'react';
import {
  GENDER,
  OTHER_INCOME,
  EXPENSES,
  OWN_FUNDS_TYPES,
} from 'core/api/constants';
import { T } from 'core/components/Translation/Translation';
import BorrowerCalculator from 'core/utils/Calculator/BorrowerCalculator';
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
    BorrowerCalculator.getBonusIncome({ borrowers: borrower })),
  otherFortune: getBorrowersOtherFortune(borrowers),
  realEstateValue: borrowers.map(borrower =>
    BorrowerCalculator.getRealEstateValue({ borrowers: borrower })),
  realEstateDebt: borrowers.map(borrower =>
    BorrowerCalculator.getRealEstateDebt({ borrowers: borrower })),
  ...getBorrowersOwnFunds(borrowers, [
    OWN_FUNDS_TYPES.INSURANCE_2,
    OWN_FUNDS_TYPES.INSURANCE_3A,
    OWN_FUNDS_TYPES.BANK_3A,
    OWN_FUNDS_TYPES.INSURANCE_3B,
  ]),
});

const getArraySum = array => array.reduce((sum, val) => sum + val, 0);

const getFormatedMoneyArray = (array, negative = false) => [
  ...array.map(x => (
    <div className="money-amount">
      {`${negative && x ? '-' : ''}${toMoney(x || 0)}`}
    </div>
  )),
  <div className="money-amount">
    {`${negative ? '-' : ''}${toMoney(getArraySum(array))}`}
  </div>,
];

const shouldRenderArray = array => array.filter(x => x).length > 0;

const addTableMoneyLine = ({ label, field, negative, condition }) => ({
  label,
  data: getFormatedMoneyArray(field, negative || false),
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
        <T id="PDF.borrowersInfos.total" />,
      ],
      style: { fontWeight: 'bold', textAlign: 'center' },
    },
    {
      label: <T id="PDF.borrowersInfos.age" />,
      data: borrowersInfos.age,
      style: { textAlign: 'center' },
    },
    {
      label: <T id="PDF.borrowersInfos.children" />,
      data: [
        ...borrowersInfos.childrenCount.map(children => children || '-'),
        '-',
      ],
      condition: shouldRenderArray(borrowersInfos.childrenCount),
      style: { textAlign: 'center' },
    },
    {
      label: <T id="PDF.borrowersInfos.company" />,
      data: [...borrowersInfos.company.map(company => company || '-'), '-'],
      condition: shouldRenderArray(borrowersInfos.company),
      style: { textAlign: 'center' },
    },
    {
      label: <T id="PDF.borrowersInfos.civilStatus" />,
      data: [
        ...borrowersInfos.civilStatus.map(status =>
          <T id={`PDF.borrowersInfos.civilStatus.${status}`} /> || '-'),
        '-',
      ],
      condition: borrowersInfos.civilStatus.filter(x => x).length > 0,
      style: { textAlign: 'center' },
    },
    addTableEmptyLine(),
    addTableCategoryTitle(<T id="PDF.borrowersInfos.category.income" />),
    addTableMoneyLine({
      label: <T id="PDF.borrowersInfos.salary" />,
      field: borrowersInfos.salary,
      condition: true,
    }),
    addTableMoneyLine({
      label: <T id="PDF.borrowersInfos.bonus" />,
      field: borrowersInfos.bonus,
    }),
    ...Object.values(OTHER_INCOME).map(income =>
      addTableMoneyLine({
        label: <T id={`PDF.borrowersInfos.otherIncome.${income}`} />,
        field: borrowersInfos.otherIncome[income],
      })),
    ...Object.values(EXPENSES).map(expense =>
      addTableMoneyLine({
        label: <T id={`PDF.borrowersInfos.expenses.${expense}`} />,
        field: borrowersInfos.expenses[expense],
        negative: true,
      })),
    addTableEmptyLine(),
    {
      label: (
        <p style={{ fontWeight: 'bold' }}>
          <T id="PDF.borrowersInfos.totalIncome" />
        </p>
      ),
      data: getFormatedMoneyArray(borrowers.map((_, index) =>
        borrowersInfos.otherIncome.totalIncome[index]
            + borrowersInfos.salary[index]
            + borrowersInfos.bonus[index]
            - borrowersInfos.expenses.totalExpenses[index])),
      style: { fontWeight: 'bold' },
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
      field: borrowersInfos.realEstateValue,
    }),
    addTableMoneyLine({
      label: <T id="PDF.borrowersInfos.realEstateDebt" />,
      field: borrowersInfos.realEstateDebt,
      condition: shouldRenderArray(borrowersInfos.realEstateValue),
      negative: true,
    }),
    addTableMoneyLine({
      label: <T id="PDF.borrowersInfos.otherFortune" />,
      field: borrowersInfos.otherFortune,
    }),
    addTableEmptyLine(),
    {
      label: (
        <p style={{ fontWeight: 'bold' }}>
          <T id="PDF.borrowersInfos.totalFortune" />
        </p>
      ),
      data: getFormatedMoneyArray(borrowers.map((_, index) =>
        borrowersInfos.bankFortune[index]
            + borrowersInfos.insurance2[index]
            + borrowersInfos.bank3A[index]
            + borrowersInfos.insurance3A[index]
            + borrowersInfos.insurance3B[index]
            + borrowersInfos.realEstateValue[index]
            - borrowersInfos.realEstateDebt[index]
            + borrowersInfos.thirdPartyFortune[index]
            + borrowersInfos.otherFortune[index])),
      style: { fontWeight: 'bold' },
    },
  ];
};

const BorrowersRecap = ({ borrowers }: BorrowersRecapProps) => (
  <PDFTable
    className="borrowers-recap"
    array={getBorrowersInfosArray(borrowers)}
  />
);

export default BorrowersRecap;
