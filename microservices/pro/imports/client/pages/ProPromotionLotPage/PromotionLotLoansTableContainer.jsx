import React from 'react';
import { compose, withProps, mapProps } from 'recompose';

import withSmartQuery from 'core/api/containerToolkit/withSmartQuery';
import proPromotionOptions from 'core/api/promotionOptions/queries/proPromotionOptions';
import T from 'core/components/Translation';

const getSolvency = email =>
  Number(email.replace(/(^.+\D)(\d+)(\D.+$)/i, '$2')) % 3 === 0;

const mapOption = ({
  _id: promotionOptionId,
  loan,
  status,
  lots,
  solvency,
}) => {
  console.log('loan', loan);

  return {
    id: promotionOptionId,
    columns: [
      loan && loan[0] && loan[0].user.name,
      loan
        && loan[0]
        && loan[0].user.phoneNumbers
        && loan[0].user.phoneNumbers[0],
      <T id={`Forms.status.${status}`} key="status" />,
      lots,
      <span
        className={
          getSolvency(loan && loan[0] && loan[0].user.email)
            ? 'solvent'
            : 'non-solvent'
        }
        key="solvency"
      >
        {getSolvency(loan && loan[0] && loan[0].user.email)
          ? 'Solvable'
          : 'Non solvable'}
      </span>,
    ],
  };
};

const columnOptions = [
  { id: 'name' },
  { id: 'phone' },
  { id: 'status' },
  { id: 'lots' },
  { id: 'solvency' },
].map(({ id }) => ({ id, label: <T id={`PromotionLotLoansTable.${id}`} /> }));

export default compose(
  mapProps(({ promotionOptions }) => ({
    promotionOptionIds: promotionOptions.map(({ _id }) => _id),
  })),
  withSmartQuery({
    query: ({ promotionOptionIds }) =>
      proPromotionOptions.clone({ promotionOptionIds }),
    queryOptions: { reactive: false },
    dataName: 'promotionOptions',
  }),
  withProps(({ promotionOptions }) => ({
    rows: promotionOptions.map(mapOption),
    columnOptions,
  })),
);
