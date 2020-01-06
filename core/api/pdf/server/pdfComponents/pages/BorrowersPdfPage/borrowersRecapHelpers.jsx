import React from 'react';
import moment from 'moment';

import { toMoney } from 'core/utils/conversionFunctions';
import T from 'core/components/Translation';
import { ROW_TYPES } from '../../PdfTable/PdfTable';
import { EXPENSE_TYPES } from '../../../../../lenderRules/lenderRulesConstants';
import {
  OTHER_INCOME,
  OWN_FUNDS_TYPES,
  CIVIL_STATUS,
  BORROWER_ACTIVITY_TYPES,
} from '../../../../../borrowers/borrowerConstants';

const renderWithComments = (value, comments = []) => {
  if (comments.length === 0) {
    return value;
  }

  const func = ({ negative }) => (
    <div>
      <div>{negative ? `-${toMoney(value)}` : toMoney(value)}</div>
      <div className="secondary finance-comment">
        {/* Make sure we can "join" strings or JSX */}
        {comments
          .filter(x => x)
          .map((comment, i) => [i !== 0 && ', ', comment])}
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
  borrowers.map(borrower => {
    const { otherIncome = [] } = borrower;
    const otherIncomeValue = otherIncome
      .filter(income => types.includes(income.description))
      .reduce((sum, income) => sum + income.value, 0);

    // Only render comments if this is for one single expense type
    const otherIncomeComments =
      types.length === 1 &&
      calculator.getCommentsForOtherIncomeType({
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
  borrowers.map(borrower => {
    let allExpenses = calculator.getGroupedExpensesBySide({
      borrowers: borrower,
    });
    allExpenses = Object.keys(allExpenses).map(key => ({
      description: key,
      value: allExpenses[key],
    }));

    const expenseValue = allExpenses
      .filter(expense => types.includes(expense.description))
      .reduce((sum, expense) => sum + expense.value, 0);

    // Only render comments if this is for one single expense type
    const expenseComments =
      types.length === 1 &&
      calculator.getCommentsForExpenseType({
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
      [type]: borrowers.map(
        borrower =>
          borrower[type] &&
          renderWithComments(
            borrower[type].reduce((sum, ownFund) => sum + ownFund.value, 0),
            borrower[type].map(
              ({ description, value }) => `${description} (${toMoney(value)})`,
            ),
          ),
      ),
    }),
    {},
  );

export const getBorrowersAddress = borrowers => {
  const borrowersHaveSameAddress = borrowers.some(
    ({ sameAddress }) => sameAddress === true,
  );
  if (borrowersHaveSameAddress) {
    const { address } = borrowers.find(({ city, zipCode }) => city && zipCode);

    return borrowers.map(() => address);
  }
  return borrowers.map(({ address }) => address);
};

export const getBonus = (borrowers, calculator) =>
  borrowers.map(borrower => {
    const bonus = calculator.getBonusIncome({ borrowers: borrower });
    const bonuses = calculator.getBonuses({ borrowers: borrower });
    const comments = Object.keys(bonuses).map(key => {
      const value = bonuses[key];

      if (!value) {
        // Filter out bonuses that are 0 to shorten the comments
        return null;
      }

      const year = key.slice(7);
      return (
        <span key={borrower._id} style={{ whiteSpace: 'nowrap' }}>
          {`${year}: ${toMoney(value)}`}
        </span>
      );
    });

    return renderWithComments(bonus, comments);
  });

const getBorrowersCitizenship = borrowers =>
  borrowers.map(borrower => {
    const { isSwiss, citizenship, residencyPermit } = borrower;
    if (isSwiss) {
      return <T id="Forms.switzerland" />;
    }

    return residencyPermit ? (
      <span>
        {citizenship}&nbsp;(
        <T id={`Forms.residencyPermit.${residencyPermit}`} />)
      </span>
    ) : (
        citizenship
      );
  });

const getBorrowerCivilStatusAndDate = borrower => {
  const { civilStatus, marriedDate, divorcedDate } = borrower;
  if (civilStatus === CIVIL_STATUS.MARRIED) {
    return (
      <span>
        <T id={`PDF.borrowersInfos.civilStatus.${civilStatus}`} />
        {marriedDate ? ` (${moment(marriedDate).format('DD.MM.YYYY')})` : ''}
      </span>
    );
  }
  if (civilStatus === CIVIL_STATUS.DIVORCED) {
    return (
      <span>
        <T id={`PDF.borrowersInfos.civilStatus.${civilStatus}`} />
        {divorcedDate ? ` (${moment(divorcedDate).format('DD.MM.YYYY')})` : ''}
      </span>
    );
  }

  return <T id={`PDF.borrowersInfos.civilStatus.${civilStatus}`} />;
};

const getBorrowerCompany = borrower => {
  const { company, jobStartDate } = borrower;

  return jobStartDate
    ? `${company} (${moment(jobStartDate).format('DD.MM.YYYY')})`
    : company;
};

const getBorrowerJob = borrower => {
  const { job, jobActivityRate } = borrower;

  return jobActivityRate
    ? `${job} (${Math.round(100 * jobActivityRate)}%)`
    : job;
};

const getBorrowerActivityType = borrower => {
  const { activityType, selfEmployedSince, annuitantSince } = borrower;

  if (activityType === BORROWER_ACTIVITY_TYPES.SELF_EMPLOYED) {
    return (
      <span>
        <T id={`Forms.activityType.${activityType}`} />
        &nbsp;({moment(selfEmployedSince).format('DD.MM.YYYY')})
      </span>
    );
  }

  if (activityType === BORROWER_ACTIVITY_TYPES.ANNUITANT) {
    return (
      <span>
        <T id={`Forms.activityType.${activityType}`} />
        &nbsp;({moment(annuitantSince).format('DD.MM.YYYY')})
      </span>
    );
  }

  return <T id={`Forms.activityType.${activityType}`} />;
};

export const getBorrowersInfos = (borrowers, calculator) => ({
  ...getBorrowersSingleInfos(borrowers, [
    'name',
    'gender',
    'age',
    'birthDate',
    'childrenCount',
    'civilStatus',
    'email',
    'phoneNumber',
  ]),
  activityType: borrowers.map(getBorrowerActivityType),
  company: borrowers.map(getBorrowerCompany),
  job: borrowers.map(getBorrowerJob),
  civilStatus: borrowers.map(getBorrowerCivilStatusAndDate),
  realEstateIncome: borrowers.map(borrower =>
    calculator.getRealEstateIncomeTotal({ borrowers: borrower }),
  ),
  salary: borrowers.map(borrower =>
    calculator.getSalary({ borrowers: borrower }),
  ),
  address: getBorrowersAddress(borrowers),
  citizenship: getBorrowersCitizenship(borrowers),
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
    calculator.getOtherFortune({ borrowers: borrower }),
  ),
  realEstateValue: borrowers.map(borrower =>
    calculator.getRealEstateValue({ borrowers: borrower }),
  ),
  realEstateDebt: borrowers.map(borrower =>
    calculator.getRealEstateDebt({ borrowers: borrower }),
  ),
  ...getBorrowersOwnFunds(borrowers, [
    OWN_FUNDS_TYPES.BANK_FORTUNE,
    OWN_FUNDS_TYPES.INSURANCE_2,
    OWN_FUNDS_TYPES.INSURANCE_3A,
    OWN_FUNDS_TYPES.BANK_3A,
    OWN_FUNDS_TYPES.INSURANCE_3B,
    OWN_FUNDS_TYPES.DONATION,
  ]),
});

export const getArraySum = array =>
  array.reduce((sum, val) => {
    if (val && val.rawValue >= 0) {
      // Avoid null values
      return sum + Number(val.rawValue);
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
  negative = false,
  condition = shouldRenderArray(field),
}) => ({
  label,
  data: getFormattedMoneyArray({
    array: field,
    negative,
    twoBorrowers,
  }),
  condition,
});

export const addTableEmptyLine = () => ({
  label: '\u00A0',
  type: ROW_TYPES.EMPTY,
});
