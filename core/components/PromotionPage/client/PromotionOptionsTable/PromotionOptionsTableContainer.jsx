import React from 'react';
import moment from 'moment';
import { compose, withProps } from 'recompose';

import withSmartQuery from '../../../../api/containerToolkit/withSmartQuery';
import {
  PROMOTION_OPTIONS_COLLECTION,
  PROMOTION_OPTION_STATUS,
} from '../../../../api/promotionOptions/promotionOptionConstants';
import { proPromotionOptions } from '../../../../api/promotionOptions/queries';
import StatusLabel from '../../../StatusLabel';
import T from '../../../Translation';
import PromotionReservationProgress from '../../PromotionReservationProgress';
import { rawPromotionReservationProgress } from '../../PromotionReservationProgress/PromotionReservationProgressHelpers';
import PromotionCustomer from '../PromotionCustomer';

const columnOptions = [
  { id: 'lotName' },
  { id: 'status' },
  { id: 'buyer' },
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
