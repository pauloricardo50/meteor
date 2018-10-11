import React from 'react';
import { compose, withProps, mapProps } from 'recompose';

import withSmartQuery from 'core/api/containerToolkit/withSmartQuery';
import proPromotionOptions from 'core/api/promotionOptions/queries/proPromotionOptions';
import T from 'core/components/Translation';
import PromotionLotAttributer from './PromotionLotAttributer';
import PriorityOrder from './PriorityOrder';

const getSolvency = (email) => {
  const nb = Number(email.replace(/(^.+\D)(\d+)(\D.+$)/i, '$2'));
  if (nb % 3 === 0) {
    return { className: 'success', text: 'Solvable' };
  }
  if (nb % 3 === 1) {
    return { className: 'warning', text: 'Non solvable' };
  }
  return { className: 'primary', text: 'En cours' };
};

const mapOption = ({
  status: promotionLotStatus,
  _id: promotionLotId,
  promotion: lotPromotion,
  attributedTo,
  name,
}) => (promotionOption) => {
  const {
    _id: promotionOptionId,
    loan,
    status,
    lots,
    solvency,
  } = promotionOption;

  const promotion = loan
    && loan[0].promotions
    && loan[0].promotions.find(({ _id }) => _id === lotPromotion[0]._id);

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
      <PriorityOrder
        promotion={promotion}
        promotionOptions={loan[0].promotionOptions}
        currentId={promotionOptionId}
        key="priorityOrder"
      />,
      {
        raw: getSolvency(loan && loan[0] && loan[0].user.email).className,
        label: (
          <span
            className={
              getSolvency(loan && loan[0] && loan[0].user.email).className
            }
            key="solvency"
          >
            {getSolvency(loan && loan[0] && loan[0].user.email).text}
          </span>
        ),
      },
      <PromotionLotAttributer
        promotionLotId={promotionLotId}
        loanId={loan && loan[0] && loan[0]._id}
        promotionLotStatus={promotionLotStatus}
        attributedToId={attributedTo && attributedTo._id}
        userName={loan && loan[0] && loan[0].user.name}
        lots={lots}
        solvency={getSolvency(loan && loan[0] && loan[0].user.email).text}
        solvencyClassName={
          getSolvency(loan && loan[0] && loan[0].user.email).className
        }
        promotionLotName={name}
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
  { id: 'priorityOrder' },
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
