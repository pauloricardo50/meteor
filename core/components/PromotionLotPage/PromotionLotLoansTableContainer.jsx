import React from 'react';
import { compose, withProps, mapProps } from 'recompose';
import moment from 'moment';
import { withRouter } from 'react-router-dom';

import withSmartQuery from 'core/api/containerToolkit/withSmartQuery';
import proPromotionOptions from 'core/api/promotionOptions/queries/proPromotionOptions';
import T from 'core/components/Translation';
import { CollectionIconLink } from 'core/components/IconLink';
import PromotionLotAttributer from './PromotionLotAttributer';
import PriorityOrder from './PriorityOrder';
import PromotionProgress from './PromotionProgress';
import PromotionProgressHeader from '../PromotionUsersPage/PromotionProgressHeader';
import { LOANS_COLLECTION } from '../../api/constants';

const makeMapOption = ({
  promotionLot: {
    status: promotionLotStatus,
    _id: promotionLotId,
    promotion: lotPromotion,
    attributedTo,
    name,
  },
  canModify,
  isAdmin,
  history,
}) => (promotionOption) => {
  const {
    _id: promotionOptionId,
    loan,
    lots,
    custom,
    createdAt,
    solvency,
  } = promotionOption;
  console.log('promotionOption:', promotionOption)
  const {
    user,
    promotions,
    promotionOptions = [],
    _id: loanId,
    promotionProgress,
  } = loan;
  const promotion = promotions && promotions.find(({ _id }) => _id === lotPromotion._id);

  return {
    id: promotionOptionId,
    columns: [
      isAdmin
        ? user && (
          <CollectionIconLink
            relatedDoc={{
              ...loan,
              name: user.name,
              collection: LOANS_COLLECTION,
            }}
          />
        )
        : user && user.name,
      { raw: moment(createdAt).valueOf(), label: moment(createdAt).fromNow() },
      user && user.phoneNumbers && user.phoneNumbers[0],
      user && user.email,
      {
        raw: promotionProgress.verificationStatus,
        label: <PromotionProgress promotionProgress={promotionProgress} />,
      },
      custom,
      {
        raw: promotionOptions.length,
        label: (
          <PriorityOrder
            promotion={promotion}
            promotionOptions={promotionOptions}
            currentId={promotionOptionId}
            userId={user && user._id}
            key="priorityOrder"
          />
        ),
      },
      <PromotionLotAttributer
        promotionLotId={promotionLotId}
        loanId={loanId}
        promotionLotStatus={promotionLotStatus}
        attributedToId={attributedTo && attributedTo._id}
        userName={user && user.name}
        lots={lots}
        solvency={solvency}
        promotionLotName={name}
        canModify={canModify}
        key="promotionLotAttributer"
      />,
    ],
  };
};

const columnOptions = [
  { id: 'name' },
  { id: 'date' },
  { id: 'phone' },
  { id: 'email' },
  { id: 'promotionProgress', label: <PromotionProgressHeader /> },
  { id: 'custom' },
  { id: 'priorityOrder' },
  { id: 'attribute' },
].map(({ id, label }) => ({
  id,
  label: label || <T id={`PromotionLotLoansTable.${id}`} />,
}));

export default compose(
  mapProps(({ promotionOptions, promotionLot, canModify, isAdmin }) => ({
    promotionOptionIds: promotionOptions.map(({ _id }) => _id),
    promotionLot,
    canModify,
    isAdmin,
  })),
  withSmartQuery({
    query: proPromotionOptions,
    params: ({ promotionOptionIds }) => ({ promotionOptionIds }),
    queryOptions: { reactive: false },
    dataName: 'promotionOptions',
  }),
  withRouter,
  withProps(({ promotionOptions, promotionLot, canModify, history, isAdmin }) => ({
    rows: promotionOptions.map(makeMapOption({ promotionLot, canModify, history, isAdmin })),
    columnOptions,
  })),
);
