import React from 'react';
import { withProps } from 'recompose';

import Calculator from '../../utils/Calculator/index';
import { LOAN_STATUS, LOANS_COLLECTION } from '../../api/constants';
import T, { Money } from '../Translation';
import StatusLabel from '../StatusLabel';

const statuses = Object.values(LOAN_STATUS).filter(
  status => status !== LOAN_STATUS.TEST,
);

const isEstimationStatus = status =>
  [LOAN_STATUS.LEAD, LOAN_STATUS.QUALIFIED_LEAD, LOAN_STATUS.ONGOING].includes(
    status,
  );

const columnOptions = [
  {
    id: 'x',
    label: <span />,
  },
  ...statuses.map(status => ({
    id: status,
    label: <StatusLabel status={status} collection={LOANS_COLLECTION} />,
    style: { whiteSpace: 'nowrap' },
  })),
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
        calculateRevenuesByStatus(loansByStatus[status], status, multiplier),
      )
      .map((amount, i) => {
        const status = statuses[i];

        if (isEstimationStatus(status)) {
          if (!amount) {
            return <span key={status}>-</span>;
          }

          return (
            <span key={status}>
              ~
              <Money value={amount} displayZero={false} />
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
