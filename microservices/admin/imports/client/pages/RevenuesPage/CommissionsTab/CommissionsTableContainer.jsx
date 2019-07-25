import React from 'react';
import { compose, withProps } from 'recompose';

import StatusLabel from 'core/components/StatusLabel';
import { Money, Percent } from 'core/components/Translation';
import CollectionIconLink from 'core/components/IconLink/CollectionIconLink';
import {
  REVENUES_COLLECTION,
  ORGANISATIONS_COLLECTION,
} from 'core/api/constants';
import RevenuesTableContainer from '../../SingleLoanPage/LoanTabs/RevenuesTab/RevenuesTableContainer';

const makeCommissionRows = () => (
  rows,
  { organisations = [], columns, id, amount, ...rest },
) => {
  if (!organisations || organisations.length === 0) {
    return rows;
  }

  return [
    ...rows,
    ...organisations.map(({ name, _id, $metadata: { status, commissionRate, paidDate } }) => {
      const commissionAmount = amount * commissionRate;

      return {
        id: id + _id,
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
              <>
                <Money value={commissionAmount} />
                  &nbsp; (
                <Percent value={commissionRate} />
)
              </>
            ),
          },
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
      { id: 'commissionOrganisation', label: 'Statut de la commission' },
      { id: 'commissionStatus', label: 'Statut de la commission' },
      ...columnOptions,
      { id: 'commissionRate', label: 'Commission' },
    ],
    rows: rows.reduce(makeCommissionRows(), []),
    initialOrderBy: 2,
  })),
);
