import React from 'react';
import { compose, withState, withProps } from 'recompose';
import moment from 'moment';

import { promotionReservations as query } from '../../../../api/promotionReservations/queries';
import { withSmartQuery } from '../../../../api/containerToolkit/index';
import ProCustomer from '../../../ProCustomer';
import T from '../../../Translation';
import PromotionReservationProgress, {
  rawPromotionReservationProgress,
} from '../PromotionReservations/PromotionReservationProgress';

const columnOptions = [
  { id: 'promotionLot' },
  { id: 'customer' },
  { id: 'deadline' },
  { id: 'progress' },
].map(col => ({
  ...col,
  label: <T id={`PromotionReservationsTable.${col.id}`} />,
}));

const mapPromotionReservation = (promotionReservation) => {
  const { _id, promotionLot, loan, expirationDate } = promotionReservation;
  const expirationMoment = moment(expirationDate);

  return {
    id: _id,
    data: promotionReservation,
    columns: [
      promotionLot.name,
      {
        raw: loan.user,
        label: <ProCustomer user={loan.user} invitedByUser={null} />,
      },
      {
        raw: expirationMoment,
        label: expirationMoment.fromNow(),
      },
      {
        raw: rawPromotionReservationProgress(promotionReservation),
        label: (
          <PromotionReservationProgress
            promotionReservation={promotionReservation}
          />
        ),
      },
    ],
  };
};

export default compose(
  withState('status', 'setStatus'),
  withSmartQuery({
    query,
    params: ({ promotionId, status, loanId }) => ({ promotionId, status, loanId }),
    dataName: 'promotionReservations',
  }),
  withProps(({ promotionReservations }) => ({
    rows: promotionReservations.map(mapPromotionReservation),
    columnOptions,
  })),
);
