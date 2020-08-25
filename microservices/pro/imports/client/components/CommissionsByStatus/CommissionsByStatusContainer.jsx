import React from 'react';
import { withProps } from 'recompose';

import { LOANS_COLLECTION, LOAN_STATUS } from 'core/api/loans/loanConstants';
import { COMMISSION_STATUS } from 'core/api/revenues/revenueConstants';
import { getCommissionsFromRevenues } from 'core/api/revenues/revenueHelpers';
import StatusLabel from 'core/components/StatusLabel';
import T, { Money } from 'core/components/Translation';
import Calculator from 'core/utils/Calculator';

const statuses = Object.values(LOAN_STATUS).filter(
  status => status !== LOAN_STATUS.TEST,
);

const isEstimationStatus = (status, commissionStatus) =>
  [LOAN_STATUS.LEAD, LOAN_STATUS.QUALIFIED_LEAD, LOAN_STATUS.ONGOING].includes(
    status,
  ) && commissionStatus === COMMISSION_STATUS.TO_BE_PAID;

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

const calculateRevenuesByStatus = ({
  loans = [],
  status,
  commissionRate = 1,
  commissionStatus,
  organisationId,
  estimation,
}) =>
  loans.reduce((tot, loan) => {
    const { revenues = [] } = loan;

    if (!estimation && revenues.length) {
      const data = getCommissionsFromRevenues(revenues, {
        filterOrganisationId: organisationId,
      });
      return tot + data[commissionStatus];
    }

    if (estimation && isEstimationStatus(status, commissionStatus)) {
      const estimatedRevenues = Calculator.getEstimatedRevenues({ loan });
      return (tot + estimatedRevenues) * commissionRate;
    }

    return tot;
  }, 0);

const makeRow = ({
  loansByStatus,
  commissionRate,
  commissionStatus,
  organisationId,
  estimation,
  id,
}) => ({
  id,
  columns: [
    estimation ? (
      'Estimation'
    ) : (
      <T key="id" id={`Forms.status.${commissionStatus}`} />
    ),
    ...statuses
      .map(status =>
        calculateRevenuesByStatus({
          loans: loansByStatus[status],
          status,
          commissionRate,
          commissionStatus,
          organisationId,
          estimation,
        }),
      )
      .map((amount, i) => {
        const status = statuses[i];

        if (estimation) {
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

export default withProps(
  ({ loans = [], commissionRate = 1, organisationId }) => {
    const loansByStatus = loans.reduce(
      (obj, loan) => ({
        ...obj,
        [loan.status]: [...(obj[loan.status] || []), loan],
      }),
      {},
    );

    const rows = [
      makeCountRow(loansByStatus),
      makeRow({
        loansByStatus,
        commissionRate,
        commissionStatus: COMMISSION_STATUS.TO_BE_PAID,
        organisationId,
        estimation: true,
        id: 'estimation',
      }),
      makeRow({
        loansByStatus,
        commissionRate,
        commissionStatus: COMMISSION_STATUS.TO_BE_PAID,
        organisationId,
        estimation: false,
        id: 'toBePaid',
      }),
      makeRow({
        loansByStatus,
        commissionRate,
        commissionStatus: COMMISSION_STATUS.PAID,
        organisationId,
        estimation: false,
        id: 'paid',
      }),
    ];

    return { rows, columnOptions };
  },
);
