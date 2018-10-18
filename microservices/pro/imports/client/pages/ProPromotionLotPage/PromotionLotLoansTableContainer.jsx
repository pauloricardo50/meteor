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
    loan: loans,
    lots,
    solvency,
  } = promotionOption;

  const { user, promotions, promotionOptions, _id: loanId } = (loans && loans[0]) || {};
  const promotion = promotions && promotions.find(({ _id }) => _id === lotPromotion[0]._id);

  return {
    id: promotionOptionId,
    columns: [
      user && user.name,
      user && user.phoneNumbers && user.phoneNumbers[0],
      lots,
      <PriorityOrder
        promotion={promotion}
        promotionOptions={promotionOptions}
        currentId={promotionOptionId}
        userId={user && user._id}
        key="priorityOrder"
      />,
      {
        raw: getSolvency(user && user.email).className,
        label: (
          <span
            className={getSolvency(user && user.email).className}
            key="solvency"
          >
            {getSolvency(user && user.email).text}
          </span>
        ),
      },
      <PromotionLotAttributer
        promotionLotId={promotionLotId}
        loanId={loanId}
        promotionLotStatus={promotionLotStatus}
        attributedToId={attributedTo && attributedTo._id}
        userName={user && user.name}
        lots={lots}
        solvency={getSolvency(user && user.email).text}
        solvencyClassName={getSolvency(user && user.email).className}
        promotionLotName={name}
        key="promotionLotAttributer"
      />,
    ],
  };
};

const columnOptions = [
  { id: 'name' },
  { id: 'phone' },
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
