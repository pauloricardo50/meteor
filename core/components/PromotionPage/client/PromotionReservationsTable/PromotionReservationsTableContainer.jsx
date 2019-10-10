import React from 'react';
import { compose, withState, withProps } from 'recompose';
import moment from 'moment';

import { PROMOTION_RESERVATIONS_COLLECTION } from '../../../../api/promotionReservations/promotionReservationConstants';
import { getUserNameAndOrganisation } from '../../../../api/helpers/index';
import { promotionReservations as query } from '../../../../api/promotionReservations/queries';
import { withSmartQuery } from '../../../../api/containerToolkit/index';
import ProCustomer from '../../../ProCustomer';
import T from '../../../Translation';
import StatusLabel from '../../../StatusLabel';
import PromotionReservationProgress, {
  rawPromotionReservationProgress,
} from '../PromotionReservations/PromotionReservationProgress';

const columnOptions = [
  { id: 'promotionLot' },
  { id: 'status' },
  { id: 'customer' },
  { id: 'deadline' },
  { id: 'progress' },
].map(col => ({
  ...col,
  label: <T id={`PromotionReservationsTable.${col.id}`} />,
}));

const makeMapPromotionReservation = promotion => (promotionReservation) => {
  const {
    _id,
    promotionLot,
    loan,
    expirationDate,
    status,
  } = promotionReservation;
  const { users: promotionUsers = [] } = promotion;
  const { promotions } = loan;
  const [{ $metadata: { invitedBy } = {} }] = promotions;

  const expirationMoment = moment(expirationDate);
  const invitedByUser = invitedBy
    && promotionUsers
    && (!!promotionUsers.length
      && promotionUsers.find(({ _id: id }) => id === invitedBy));

  return {
    id: _id,
    data: promotionReservation,
    columns: [
      promotionLot.name,
      {
        raw: status,
        label: (
          <StatusLabel
            status={status}
            collection={PROMOTION_RESERVATIONS_COLLECTION}
          />
        ),
      },
      {
        raw: loan.user,
        label: (
          <ProCustomer
            user={loan.user}
            invitedByUser={
              invitedByUser
                ? getUserNameAndOrganisation({ user: invitedByUser })
                : 'Personne'
            }
          />
        ),
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
  withState('status', 'setStatus', ({ initialStatus }) => initialStatus),
  withSmartQuery({
    query,
    params: ({
      promotion: { _id: promotionId },
      status,
      loanId,
      promotionLotId,
    }) => ({
      promotionId,
      status,
      loanId,
      promotionLotId,
    }),
    dataName: 'promotionReservations',
  }),
  withProps(({ promotionReservations, promotion }) => ({
    rows: promotionReservations.map(makeMapPromotionReservation(promotion)),
    columnOptions,
  })),
);
