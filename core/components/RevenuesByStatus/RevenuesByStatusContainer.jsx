import React from 'react';
import { withProps } from 'recompose';

import Calculator from '../../utils/Calculator/index';
import { LOAN_STATUS, REVENUE_STATUS } from '../../api/constants';
import T, { Money } from '../Translation';

const statuses = Object.values(LOAN_STATUS).filter(status => status !== LOAN_STATUS.TEST);

const isEstimationStatus = status =>
  [LOAN_STATUS.LEAD, LOAN_STATUS.LEAD].includes(status);

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

const calculateRevenuesByStatus = (loans = [], status, multiplier = 1) =>
  loans.reduce((tot, loan) => {
    const { revenues = [] } = loan;

    if (revenues.length) {
      return tot + revenues.reduce((tot2, { amount = 0 }) => tot2 + amount, 0);
    }

    if (isEstimationStatus(status)) {
      const estimatedRevenues = Calculator.getEstimatedRevenues({ loan });
      return tot + estimatedRevenues;
    }

    return tot;
  }, 0) * multiplier;

const makeRow = (loansByStatus, multiplier) => ({
  id: 'revenues',
  columns: [
    <T key="id" id="RevenuesByStatus.revenues" />,
    ...statuses
      .map(status =>
        calculateRevenuesByStatus(loansByStatus[status], status, multiplier))
      .map((amount, i) => {
        const status = statuses[i];

        if (isEstimationStatus(status)) {
          return (
            <span key={status}>
              ~<Money value={amount} displayZero={false} />
            </span>
          );
        }
        return <Money value={amount} displayZero={false} key={status} />;
      }),
  ],
});

const makeCountRow = loansByStatus => ({
  id: 'count',
  columns: [
    <T key="id" id="RevenuesByStatus.loanCount" />,
    ...statuses.map(status => (loansByStatus[status] || []).length),
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
    rows: [makeCountRow(loansByStatus), makeRow(loansByStatus, multiplier)],
    columnOptions,
  };
});
