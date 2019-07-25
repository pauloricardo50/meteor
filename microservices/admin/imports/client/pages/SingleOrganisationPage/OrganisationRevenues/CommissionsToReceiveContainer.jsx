import React from 'react';
import { compose, withProps } from 'recompose';

import StatusLabel from 'core/components/StatusLabel';
import { Money, Percent } from 'core/components/Translation';
import { REVENUES_COLLECTION } from 'core/api/constants';
import RevenuesTableContainer from '../../SingleLoanPage/LoanTabs/RevenuesTab/RevenuesTableContainer';

const makeAddCommissionStatus = organisationId => ({
  organisations,
  columns,
  amount,
  ...rest
}) => {
  const organisationCommission = organisations.find(({ _id }) => _id === organisationId);
  const {
    status: commissionStatus,
    commissionRate,
  } = organisationCommission.$metadata;
  const commissionAmount = amount * commissionRate;

  return {
    ...rest,
    columns: [
      {
        raw: commissionStatus,
        label: (
          <StatusLabel
            status={commissionStatus}
            collection={REVENUES_COLLECTION}
          />
        ),
      },
      ...columns,
      {
        raw: commissionAmount,
        label: (
          <>
            <Money value={commissionAmount} />
            &nbsp; (
            <Percent value={commissionRate} />
)
          </>
        ),
      },
    ],
  };
};

export default compose(
  withProps(() => ({ displayLoan: true })),
  RevenuesTableContainer,
  withProps(({ columnOptions, rows, _id: organisationId }) => ({
    columnOptions: [
      { id: 'commissionStatus', label: 'Statut de la commission' },
      ...columnOptions,
      { id: 'commissionRate', label: 'Commission' },
    ],
    rows: rows.map(makeAddCommissionStatus(organisationId)),
    initialOrderBy: 2,
  })),
);
