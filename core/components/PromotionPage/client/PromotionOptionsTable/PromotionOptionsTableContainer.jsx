import React from 'react';
import { compose, withProps, withState } from 'recompose';
import moment from 'moment';

import withSmartQuery from 'core/api/containerToolkit/withSmartQuery';
import { proPromotionOptions } from 'core/api/promotionOptions/queries';
import {
  PROMOTION_OPTIONS_COLLECTION,
  PROMOTION_OPTION_STATUS,
} from 'core/api/constants';
import StatusLabel from 'core/components/StatusLabel';
import T from 'core/components/Translation';
import { PromotionReservationProgress } from '../PromotionReservations/PromotionReservationProgress';
import { rawPromotionReservationProgress } from '../PromotionReservations/PromotionReservationProgress/PromotionReservationProgressHelpers';
import PromotionCustomer from '../PromotionCustomer';

const columnOptions = [
  { id: 'lotName' },
  { id: 'status' },
  { id: 'customer' },
  { id: 'createdAt' },
  { id: 'progress' },
].map(opt => ({
  id: opt.id,
  label: <T id={`PromotionOptionsTable.${opt.id}`} />,
}));

const makeMapPromotionOption = ({ promotion }) => promotionOption => {
  const { users: promotionUsers } = promotion;
  const {
    _id: promotionOptionId,
    promotionLots,
    status,
    loan,
    createdAt,
  } = promotionOption;
  const [promotionLot] = promotionLots;
  const [
    {
      $metadata: { invitedBy },
    },
  ] = loan.promotions;

  return {
    id: promotionOptionId,
    promotionOption,
    columns: [
      promotionLot.name,
      {
        raw: status,
        label: (
          <StatusLabel
            status={status}
            collection={PROMOTION_OPTIONS_COLLECTION}
          />
        ),
      },
      {
        raw: loan.user.name,
        label: (
          <PromotionCustomer
            user={loan.user}
            invitedBy={invitedBy}
            promotionUsers={promotionUsers}
          />
        ),
      },
      { raw: createdAt.valueOf(), label: moment(createdAt).fromNow() },
      {
        raw: rawPromotionReservationProgress(promotionOption),
        label: (
          <PromotionReservationProgress promotionOption={promotionOption} />
        ),
      },
    ],
  };
};

export default compose(
  withState('status', 'setStatus', undefined),
  withSmartQuery({
    query: proPromotionOptions,
    params: ({ status, promotion: { _id: promotionId } }) => ({
      status: { ...status, $ne: PROMOTION_OPTION_STATUS.INTERESTED },
      promotionId,
    }),
    dataName: 'promotionOptions',
  }),
  withProps(({ promotionOptions, promotion }) => ({
    rows: promotionOptions.map(makeMapPromotionOption({ promotion })),
    columnOptions,
  })),
);
