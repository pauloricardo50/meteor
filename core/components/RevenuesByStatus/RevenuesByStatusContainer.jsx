import React from 'react';
import { withProps } from 'recompose';

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
    .reduce((arr, { revenues }) => [...arr, ...revenues], [])
    .filter(({ status }) => status === revenueStatus)
    .reduce((sum, { amount = 0 }) => sum + amount, 0);

const rows = [
  { id: 'loanCount', func: loans => loans.length },
  {
    id: 'estimatedRevenues',
    func: (loans) => {
      const total = loans.reduce(
        (sum, { estimatedRevenues = 0 }) => sum + estimatedRevenues,
        0,
      );
      return <Money value={total} />;
    },
  },
  {
    id: 'expectedRevenues',
    func: (loans) => {
      const expectedRevenues = getRevenuesByStatus(
        REVENUE_STATUS.EXPECTED,
        loans,
      );
      return <Money value={expectedRevenues} />;
    },
  },
  {
    id: 'cashedRevenues',
    func: (loans) => {
      const expectedRevenues = getRevenuesByStatus(
        REVENUE_STATUS.CASHED,
        loans,
      );
      return <Money value={expectedRevenues} />;
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

export default withProps(({ loans = [] }) => {
  const loansByStatus = loans.reduce(
    (obj, loan) => ({ ...obj, [loan.status]: [...obj[loan.status], loan] }),
    {},
  );

  return {
    rows: rows.map(makeRow(loansByStatus)),
    columnOptions,
  };
});
