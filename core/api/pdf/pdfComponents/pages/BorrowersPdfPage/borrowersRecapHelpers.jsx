import React from 'react';
import { toMoney } from 'core/utils/conversionFunctions';
import { ROW_TYPES } from '../../PdfTable/PdfTable';
import { EXPENSE_TYPES } from '../../../../lenderRules/lenderRulesConstants';
import {
  OTHER_INCOME,
  OWN_FUNDS_TYPES,
} from '../../../../borrowers/borrowerConstants';

const renderWithComments = (value, comments = []) => {
  if (comments.length === 0) {
    return value;
  }

  const func = ({ negative }) => (
    <div>
      <div>{negative ? `-${toMoney(value)}` : toMoney(value)}</div>
      <div className="secondary finance-comment">
        {/* Make sure we can "join" strings or JSX */}
        {comments.map((comment, i) => [i !== 0 && ', ', comment])}
      </div>
    </div>
  );
  func.rawValue = value;

  return func;
};

export const getBorrowersSingleInfo = (borrowers, info) =>
  borrowers.map(borrower => borrower[info] || 0);

export const getBorrowersSingleInfos = (borrowers, infos) =>
  infos.reduce(
    (borrowersInfos, info) => ({
      ...borrowersInfos,
      [info]: getBorrowersSingleInfo(borrowers, info),
    }),
    {},
  );

export const getBorrowersOtherIncome = (borrowers, types, calculator) =>
  borrowers.map((borrower) => {
    const { otherIncome = [] } = borrower;
    const otherIncomeValue = otherIncome
      .filter(income => types.includes(income.description))
      .reduce((sum, income) => sum + income.value, 0);

    // Only render comments if this is for one single expense type
    const otherIncomeComments = types.length === 1
      && calculator.getCommentsForOtherIncomeType({
        borrowers: borrower,
        type: types[0],
      });

    return renderWithComments(otherIncomeValue, otherIncomeComments);
  });

export const getBorrowersOtherIncomes = (borrowers, types, calculator) =>
  types.reduce(
    (borrowersOtherIncomes, type) => ({
      ...borrowersOtherIncomes,
      [type]: getBorrowersOtherIncome(borrowers, [type], calculator),
    }),
    {},
  );

export const getBorrowersExpense = (borrowers, types, calculator) =>
  borrowers.map((borrower) => {
    const { expenses } = borrower;
    const allExpenses = [
      ...expenses,
      {
        value: calculator.getRealEstateExpenses({ borrowers: borrower }) * 12,
        description: EXPENSE_TYPES.THEORETICAL_REAL_ESTATE,
      },
    ];

    const expenseValue = allExpenses
      .filter(expense => types.includes(expense.description))
      .filter(({ description }) =>
        calculator.shouldSubtractExpenseFromIncome(description))
      .reduce((sum, expense) => sum + expense.value, 0);

    // Only render comments if this is for one single expense type
    const expenseComments = types.length === 1
      && calculator.getCommentsForExpenseType({
        borrowers: borrower,
        type: types[0],
      });

    return renderWithComments(expenseValue, expenseComments);
  });

export const getBorrowersExpenses = (borrowers, types, calculator) =>
  types.reduce(
    (borrowersExpenses, type) => ({
      ...borrowersExpenses,
      [type]: getBorrowersExpense(borrowers, [type], calculator),
    }),
    {},
  );

export const getBorrowersOwnFunds = (borrowers, types) =>
  types.reduce(
    (ownFunds, type) => ({
      ...ownFunds,
      [type]: borrowers.map(borrower =>
        borrower[type]
          && borrower[type].reduce((sum, ownFund) => sum + ownFund.value, 0)),
    }),
    {},
  );

export const getBorrowersAddress = (borrowers) => {
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

export const getBonus = (borrowers, calculator) =>
  borrowers.map((borrower) => {
    const bonus = calculator.getBonusIncome({ borrowers: borrower });
    const bonuses = calculator.getBonuses({ borrowers: borrower });
    const comments = Object.keys(bonuses).map((key) => {
      const value = bonuses[key];
      const year = key.slice(7);
      return (
        <span key={borrower._id} style={{ whiteSpace: 'nowrap' }}>
          '{year}: {toMoney(value)}
        </span>
      );
      return `'${year}: ${toMoney(value)}`;
    });

    return renderWithComments(bonus, comments);
  });

export const getBorrowersInfos = (borrowers, calculator) => ({
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
  realEstateIncome: borrowers.map(borrower =>
    calculator.getRealEstateIncome({ borrowers: borrower })),
  salary: borrowers.map(borrower =>
    calculator.getSalary({ borrowers: borrower })),
  address: getBorrowersAddress(borrowers),
  otherIncome: {
    ...getBorrowersOtherIncomes(
      borrowers,
      Object.values(OTHER_INCOME),
      calculator,
    ),
    totalIncome: getBorrowersOtherIncome(
      borrowers,
      Object.values(OTHER_INCOME),
      calculator,
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
  bonus: getBonus(borrowers, calculator),
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

export const getArraySum = array =>
  array.reduce((sum, val) => {
    if (val && val.rawValue) {
      return sum + val.rawValue;
    }

    return sum + val;
  }, 0);

export const getFormattedMoneyArray = ({
  array,
  negative = false,
  twoBorrowers,
}) => {
  if (!twoBorrowers) {
    return [
      ...array.map((x, index) => (
        <div className="money-amount" key={index}>
          {typeof x === 'function'
            ? x({ negative })
            : toMoney(negative ? -x : x || 0)}
        </div>
      )),
    ];
  }

  return [
    ...array.map((x, index) => (
      <div className="money-amount" key={index}>
        {typeof x === 'function'
          ? x({ negative })
          : toMoney(negative ? -x : x || 0)}
      </div>
    )),

    <div className="money-amount" key="last">
      {toMoney(negative ? -getArraySum(array) : getArraySum(array))}
    </div>,
  ];
};

export const shouldRenderArray = array => array.filter(x => x).length > 0;

export const makeTableMoneyLine = twoBorrowers => ({
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

export const addTableEmptyLine = () => ({
  label: '\u00A0',
  type: ROW_TYPES.EMPTY,
});
