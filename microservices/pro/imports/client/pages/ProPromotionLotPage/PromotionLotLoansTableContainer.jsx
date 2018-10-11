import React from 'react';
import { compose, withProps, mapProps } from 'recompose';

import withSmartQuery from 'core/api/containerToolkit/withSmartQuery';
import proPromotionOptions from 'core/api/promotionOptions/queries/proPromotionOptions';
import T from 'core/components/Translation';
import PromotionLotAttributer from './PromotionLotAttributer';

const getSolvency = email =>
  Number(email.replace(/(^.+\D)(\d+)(\D.+$)/i, '$2')) % 3 === 0;

const mapOption = ({
  status: promotionLotStatus,
  _id: promotionLotId,
  attributedTo,
}) => ({ _id: promotionOptionId, loan, status, lots, solvency }) => {
  console.log('attributedTo', attributedTo);

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
      <PromotionLotAttributer
        promotionLotId={promotionLotId}
        loanId={loan && loan[0] && loan[0]._id}
        promotionLotStatus={promotionLotStatus}
        attributedToId={attributedTo && attributedTo._id}
        key="promotionLotAttributer"
      />,
    ],
  };
};

const columnOptions = [
  { id: 'name' },
  { id: 'phone' },
  { id: 'status' },
  { id: 'lots' },
  { id: 'solvency' },
  { id: 'attribute' },
].map(({ id }) => ({ id, label: <T id={`PromotionLotLoansTable.${id}`} /> }));

export default compose(
  mapProps(({ promotionOptions, promotionLot }) => ({
    promotionOptionIds: promotionOptions.map(({ _id }) => _id),
    promotionLot,
  })),
  withSmartQuery({
    query: ({ promotionOptionIds }) =>
      proPromotionOptions.clone({ promotionOptionIds }),
    queryOptions: { reactive: false },
    dataName: 'promotionOptions',
  }),
  withProps(({ promotionOptions, promotionLot }) => ({
    rows: promotionOptions.map(mapOption(promotionLot)),
    columnOptions,
  })),
);
