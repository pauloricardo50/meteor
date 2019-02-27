// @flow
import React from 'react';
import cx from 'classnames';
import moment from 'moment';

import { OTHER_INCOME, OWN_FUNDS_TYPES } from 'core/api/constants';
import T from 'core/components/Translation';
import { toMoney } from 'core/utils/conversionFunctions';
import PdfTable from '../../PdfTable';
import { ROW_TYPES } from '../../PdfTable/PdfTable';
import { EXPENSE_TYPES } from '../../../../lenderRules/lenderRulesConstants';

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

const getBorrowersExpense = (borrowers, types, calculator) =>
  borrowers.map(({ expenses = [], ...borrower }) => {
    const allExpenses = [
      ...expenses,
      {
        value: calculator.getRealEstateExpenses({ borrowers: borrower }) * 12,
        description: EXPENSE_TYPES.THEORETICAL_REAL_ESTATE,
      },
    ];

    return allExpenses
      .filter(expense => types.includes(expense.description))
      .filter(({ description }) =>
        calculator.shouldSubtractExpenseFromIncome(description))
      .reduce((sum, expense) => sum + expense.value, 0);
  });

const getBorrowersExpenses = (borrowers, types, calculator) =>
  types.reduce(
    (borrowersExpenses, type) => ({
      ...borrowersExpenses,
      [type]: getBorrowersExpense(borrowers, [type], calculator),
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
  const borrowersHaveSameAddress = borrowers.some(({ sameAddress }) => sameAddress === true);
  if (borrowersHaveSameAddress) {
    const borrowerWithAddress = borrowers.find(({ city, zipCode }) => city && zipCode);
    const address = [
      borrowerWithAddress.zipCode,
      borrowerWithAddress.city,
    ].join(' ');
    return borrowers.map(() => address);
  }
  const zipCodes = getBorrowersSingleInfo(borrowers, 'zipCode');
  const cities = getBorrowersSingleInfo(borrowers, 'city');
  return zipCodes.map((zipCode, index) => `${zipCode} ${cities[index]}`);
};

const getBorrowersInfos = (borrowers, calculator) => ({
  ...getBorrowersSingleInfos(borrowers, [
    'name',
    'gender',
    'age',
    'birthDate',
    'childrenCount',
    'company',
    'civilStatus',
    'bankFortune',
    'thirdPartyFortune',
  ]),
  salary: borrowers.map(borrower =>
    calculator.getSalary({ borrowers: borrower })),
  address: getBorrowersAddress(borrowers),
  otherIncome: {
    ...getBorrowersOtherIncomes(borrowers, Object.values(OTHER_INCOME)),
    totalIncome: getBorrowersOtherIncome(
      borrowers,
      Object.values(OTHER_INCOME),
    ),
  },
  expenses: {
    ...getBorrowersExpenses(
      borrowers,
      Object.values(EXPENSE_TYPES),
      calculator,
    ),
    totalExpenses: getBorrowersExpense(
      borrowers,
      Object.values(EXPENSE_TYPES),
      calculator,
    ),
  },
  bonus: borrowers.map(borrower =>
    calculator.getBonusIncome({ borrowers: borrower })),
  otherFortune: borrowers.map(borrower =>
    calculator.getOtherFortune({ borrowers: borrower })),
  realEstateValue: borrowers.map(borrower =>
    calculator.getRealEstateValue({ borrowers: borrower })),
  realEstateDebt: borrowers.map(borrower =>
    calculator.getRealEstateDebt({ borrowers: borrower })),
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

const getBorrowersGender = borrowersInfos =>
  borrowersInfos.gender.map(gender => (
    <T id={`PDF.borrowersInfos.gender.${gender}`} />
  ));

const getBorrowersName = ({ borrowersInfos, anonymous }) =>
  (anonymous ? getBorrowersGender(borrowersInfos) : borrowersInfos.name);

const getBorrowersInfosArray = ({ borrowers, anonymous, calculator }) => {
  const borrowersInfos = getBorrowersInfos(borrowers, calculator);
  const multipleBorrowers = borrowers.length > 1;

  return [
    addTableCategoryTitle({
      title: <T id="PDF.borrowersInfos.category.general" />,
      multipleBorrowers,
    }),
    {
      label: '\u00A0',
      data: getBorrowersGender(borrowersInfos),
      style: { fontWeight: 'bold' },
    },
    {
      label: <T id="PDF.borrowersInfos.name" />,
      data: borrowersInfos.name,
      condition: !anonymous,
      style: { fontWeight: 'bold' },
    },
    {
      label: <T id="PDF.borrowersInfos.address" />,
      data: borrowersInfos.address,
    },
    {
      label: <T id="PDF.borrowersInfos.age" />,
      data: borrowersInfos.birthDate.map((date, index) => (
        <span key={index}>
          ({moment(date).format('DD.MM.YYYY')}) - {borrowersInfos.age[index]}
        </span>
      )),
    },
    {
      label: <T id="PDF.borrowersInfos.children" />,
      data: borrowersInfos.childrenCount.map(children => children || '-'),
      condition: shouldRenderArray(borrowersInfos.childrenCount),
    },
    {
      label: <T id="PDF.borrowersInfos.company" />,
      data: borrowersInfos.company.map(company => company || '-'),
      condition: shouldRenderArray(borrowersInfos.company),
    },
    {
      label: <T id="PDF.borrowersInfos.civilStatus" />,
      data: borrowersInfos.civilStatus.map(status => <T id={`PDF.borrowersInfos.civilStatus.${status}`} /> || '-'),

      condition: borrowersInfos.civilStatus.filter(x => x).length > 0,
    },
  ];
};

const getBorrowersFinanceArray = ({ borrowers, anonymous, calculator }) => {
  const multipleBorrowers = borrowers.length > 1;
  const addTableMoneyLine = makeTableMoneyLine(multipleBorrowers);
  const borrowersInfos = getBorrowersInfos(borrowers, calculator);
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
    addTableCategoryTitle({
      title: <T id="PDF.borrowersInfos.category.financialSituation" />,
      multipleBorrowers,
    }),
    {
      label: '\u00A0',
      data: multipleBorrowers
        ? [
          ...getBorrowersName({ borrowersInfos, anonymous }),
          <T id="PDF.borrowersInfos.total" key="total" />,
        ]
        : getBorrowersName({ borrowersInfos, anonymous }),
      style: { fontWeight: 'bold' },
    },
    {
      label: <T id="PDF.borrowersInfos.income" />,
      type: ROW_TYPES.SUBSECTION,
    },
    addTableMoneyLine({
      label: (
        <T
          id={
            calculator.shouldUseNetSalary()
              ? 'PDF.borrowersInfos.netSalary'
              : 'PDF.borrowersInfos.salary'
          }
        />
      ),
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
    ...Object.values(EXPENSE_TYPES).map(expense =>
      addTableMoneyLine({
        label: <T id={`PDF.borrowersInfos.expenses.${expense}`} />,
        field: expenses[expense],
        negative: true,
      })),
    {
      label: <T id="PDF.borrowersInfos.totalIncome" />,
      data: getFormattedMoneyArray({
        array: borrowers.map(borrower =>
          calculator.getTotalIncome({ borrowers: borrower })),
        negative: false,
        twoBorrowers: multipleBorrowers,
      }),
      type: ROW_TYPES.SUM,
    },
    addTableEmptyLine(),
    {
      label: <T id="PDF.borrowersInfos.category.fortune" />,
      type: ROW_TYPES.SUBSECTION,
    },
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
          calculator.getTotalFunds({ borrowers: borrower })),
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
  calculator,
}: BorrowersRecapProps) => (
  <div className="borrowers-recap">
    <PdfTable
      className={cx('borrowers-recap info', { twoBorrowers })}
      rows={getBorrowersInfosArray({ borrowers, anonymous, calculator })}
    />
    <PdfTable
      className={cx('borrowers-recap finance', { twoBorrowers })}
      rows={getBorrowersFinanceArray({ borrowers, anonymous, calculator })}
    />
  </div>
);

export default BorrowersRecap;
