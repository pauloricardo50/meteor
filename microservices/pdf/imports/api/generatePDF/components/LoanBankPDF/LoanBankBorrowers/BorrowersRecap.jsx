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
  borrowers.map(borrower => borrower[info]);

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
  ...array.map(x => `CHF ${negative && x ? '-' : ''}${toMoney(x)}`),
  `CHF ${negative ? '-' : ''}${toMoney(getArraySum(array))}`,
];

const shouldRenderArray = array => array.filter(x => x).length > 0;

const getBorrowersInfosArray = (borrowers) => {
  const borrowersInfos = getBorrowersInfos(borrowers);
  console.log(borrowersInfos);
  return [
    {
      label: '\u00A0',
      data: [
        ...borrowersInfos.gender.map((gender, index) => (
          <span>
            <T id={`PDF.gender.${gender}`} />
            {` ${borrowersInfos.age[index]} ans`}
          </span>
        )),
        'Total considéré',
      ],
    },
    {
      label: 'Enfants',
      data: borrowersInfos.childrenCount.map(children => children || '-'),
      condition: shouldRenderArray(borrowersInfos.childrenCount),
    },
    {
      label: 'Employeur',
      data: borrowersInfos.company.map(company => company || '-'),
      condition: shouldRenderArray(borrowersInfos.company),
    },
    {
      label: 'Status matrimonial',
      data: borrowersInfos.civilStatus.map(status => status || '-'),
      condition: borrowersInfos.civilStatus.filter(x => x).length > 0,
    },
    {
      label: <p style={{ fontWeight: 'bold',  textTransform:'uppercase'}}>Revenus</p>,
    },
    {
      label: 'Salaire annuel brut',
      data: getFormatedMoneyArray(borrowersInfos.salary),
    },
    {
      label: 'Bonus considéré',
      data: getFormatedMoneyArray(borrowersInfos.bonus),
      condition: shouldRenderArray(borrowersInfos.bonus),
    },
    {
      label: 'Allocations familiales',
      data: getFormatedMoneyArray(borrowersInfos.otherIncome[OTHER_INCOME.WELFARE]),
      condition: shouldRenderArray(borrowersInfos.otherIncome[OTHER_INCOME.WELFARE]),
    },
    {
      label: 'Rentes reçues',
      data: getFormatedMoneyArray(borrowersInfos.otherIncome[OTHER_INCOME.PENSIONS]),
      condition: shouldRenderArray(borrowersInfos.otherIncome[OTHER_INCOME.PENSIONS]),
    },
    {
      label: 'Revenus immobiliers',
      data: getFormatedMoneyArray(borrowersInfos.otherIncome[OTHER_INCOME.REAL_ESTATE]),
      condition: shouldRenderArray(borrowersInfos.otherIncome[OTHER_INCOME.REAL_ESTATE]),
    },
    {
      label: 'Revenus de titres',
      data: getFormatedMoneyArray(borrowersInfos.otherIncome[OTHER_INCOME.INVESTMENT]),
      condition: shouldRenderArray(borrowersInfos.otherIncome[OTHER_INCOME.INVESTMENT]),
    },
    {
      label: 'Autres revenus',
      data: getFormatedMoneyArray(borrowersInfos.otherIncome[OTHER_INCOME.OTHER]),
      condition: shouldRenderArray(borrowersInfos.otherIncome[OTHER_INCOME.OTHER]),
    },
    {
      label: 'Pensions perçues',
      data: getFormatedMoneyArray(
        borrowersInfos.expenses[EXPENSES.PENSIONS],
        true,
      ),
      condition: shouldRenderArray(borrowersInfos.expenses[EXPENSES.PENSIONS]),
    },
    {
      label: 'Leasings',
      data: getFormatedMoneyArray(
        borrowersInfos.expenses[EXPENSES.LEASING],
        true,
      ),
      condition: shouldRenderArray(borrowersInfos.expenses[EXPENSES.LEASING]),
    },
    {
      label: 'Crédits personnels',
      data: getFormatedMoneyArray(
        borrowersInfos.expenses[EXPENSES.PERSONAL_LOAN],
        true,
      ),
      condition: shouldRenderArray(borrowersInfos.expenses[EXPENSES.PERSONAL_LOAN]),
    },
    {
      label: 'Prêts hypothécaires',
      data: getFormatedMoneyArray(
        borrowersInfos.expenses[EXPENSES.MORTGAGE_LOAN],
        true,
      ),
      condition: shouldRenderArray(borrowersInfos.expenses[EXPENSES.MORTGAGE_LOAN]),
    },
    {
      label: 'Autres dépenses',
      data: getFormatedMoneyArray(
        borrowersInfos.expenses[EXPENSES.OTHER],
        true,
      ),
      condition: shouldRenderArray(borrowersInfos.expenses[EXPENSES.OTHER]),
    },
    {
      label: '\u00A0',
    },
    {
      label: <p style={{fontWeight: 'bold'}}>Total des revenus considérés</p>,
      data: getFormatedMoneyArray(borrowersInfos.otherIncome.totalIncome.map((totalIncome, index) =>
        totalIncome
            + borrowersInfos.salary[index]
            + borrowersInfos.bonus[index]
            - borrowersInfos.expenses.totalExpenses[index])),
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
