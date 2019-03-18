import React from 'react';
import { withProps } from 'recompose';

import Calculator from '../../utils/Calculator/index';
import { LOAN_STATUS, REVENUE_STATUS } from '../../api/constants';
import T, { Money } from '../Translation';

const statuses = Object.values(LOAN_STATUS).filter(status => status !== LOAN_STATUS.TEST);

const columnOptions = [
  {
    id: 'x',
    label: <span />,
  },
  ...statuses.map(status => ({
    id: status,
    label: <T id={`Forms.status.${status}`} />,
  })),
];

const getRevenuesByStatus = (revenueStatus, loans) =>
  loans
    .reduce((arr, { revenues = [] }) => [...arr, ...revenues], [])
    .filter(({ status }) => status === revenueStatus)
    .reduce((sum, { amount = 0 }) => sum + amount, 0);

const rows = multiplier => [
  { id: 'loanCount', func: loans => loans.length },
  {
    id: 'estimatedRevenues',
    func: (loans) => {
      const loansWithoutExplicitRevenues = loans.filter(({ revenues = [] }) => revenues.length === 0);
      const total = loansWithoutExplicitRevenues.reduce(
        (sum, loan) => sum + Calculator.getEstimatedRevenues({ loan }),
        0,
      );
      return (
        <span>
          {total > 0 && '~'}
          <Money value={total * multiplier} displayZero={false} />
        </span>
      );
    },
  },
  {
    id: 'expectedRevenues',
    func: (loans) => {
      const expectedRevenues = getRevenuesByStatus(
        REVENUE_STATUS.EXPECTED,
        loans,
      );
      return (
        <span>
          {expectedRevenues > 0 && '~'}
          <Money value={expectedRevenues * multiplier} displayZero={false} />
        </span>
      );
    },
  },
  {
    id: 'cashedRevenues',
    func: (loans) => {
      const cashedRevenues = getRevenuesByStatus(REVENUE_STATUS.CASHED, loans);
      return <Money value={cashedRevenues * multiplier} displayZero={false} />;
    },
  },
];

const makeRow = loansByStatus => ({ id, func }) => ({
  id,
  columns: [
    <T key="id" id={`RevenuesByStatus.${id}`} />,
    ...statuses.map((status) => {
      const loans = loansByStatus[status] || [];
      return func(loans);
    }),
  ],
});

export default withProps(({ loans = [], multiplier = 1 }) => {
  const loansByStatus = loans.reduce(
    (obj, loan) => ({
      ...obj,
      [loan.status]: [...(obj[loan.status] || []), loan],
    }),
    {},
  );

  return {
    rows: rows(multiplier).map(makeRow(loansByStatus)),
    columnOptions,
  };
});
