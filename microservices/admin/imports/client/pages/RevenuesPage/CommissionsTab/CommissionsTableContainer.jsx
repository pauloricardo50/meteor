import React from 'react';
import { compose, withProps } from 'recompose';

import StatusLabel from 'core/components/StatusLabel';
import { Money, Percent } from 'core/components/Translation';
import CollectionIconLink from 'core/components/IconLink/CollectionIconLink';
import {
  REVENUES_COLLECTION,
  ORGANISATIONS_COLLECTION,
} from 'core/api/constants';
import CommissionsConsolidator from 'imports/client/components/RevenuesTable/CommissionConsolidator';
import RevenuesTableContainer from '../../../components/RevenuesTable/RevenuesTableContainer';

const addCommissionRows = (
  rows,
  { organisations = [], columns, id: revenueId, amount, ...rest },
) => {
  if (!organisations || organisations.length === 0) {
    return rows;
  }

  return [
    ...rows,
    ...organisations.map(({ name, _id, $metadata: { status, commissionRate, paidAt } }) => {
      const commissionAmount = amount * commissionRate;

      return {
        id: revenueId + _id,
        columns: [
          {
            raw: name,
            label: (
              <CollectionIconLink
                relatedDoc={{
                  _id,
                  name,
                  collection: ORGANISATIONS_COLLECTION,
                }}
              />
            ),
          },
          {
            raw: status,
            label: (
              <StatusLabel status={status} collection={REVENUES_COLLECTION} />
            ),
          },
          ...columns,
          {
            raw: commissionAmount,
            label: (
              <b>
                  (
                <Percent value={commissionRate} />
                  )&nbsp;
                <Money value={commissionAmount} />
              </b>
            ),
          },
          <CommissionsConsolidator
            revenueId={revenueId}
            amount={amount}
            paidAt={paidAt}
            organisation={{ _id, name }}
            commissionRate={commissionRate}
            commissionAmount={commissionAmount}
            key="commissions-consolidator"
          />,
        ],
        ...rest,
      };
    }),
  ];
};

export default compose(
  withProps(() => ({ displayLoan: true })),
  RevenuesTableContainer,
  withProps(({ columnOptions, rows }) => ({
    columnOptions: [
      { id: 'commissionOrganisation', label: 'À payer' },
      { id: 'commissionStatus', label: 'Statut de la commission' },
      ...columnOptions,
      {
        id: 'commissionRate',
        label: 'Commission',
        align: 'right',
        style: { whiteSpace: 'nowrap' },
      },
      { id: 'actions' },
    ],
    rows: rows.reduce(addCommissionRows, []),
    initialOrderBy: 2,
  })),
);
