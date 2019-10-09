import React from 'react';
import { compose, withState, withProps } from 'recompose';
import moment from 'moment';

import { getUserNameAndOrganisation } from '../../../../api/helpers/index';
import { promotionReservations as query } from '../../../../api/promotionReservations/queries';
import { withSmartQuery } from '../../../../api/containerToolkit/index';
import ProCustomer from '../../../ProCustomer';
import T from '../../../Translation';
import PromotionReservationProgress, {
  rawPromotionReservationProgress,
} from './PromotionReservationProgress';

const columnOptions = [
  { id: 'promotionLot' },
  { id: 'customer' },
  { id: 'deadline' },
  { id: 'progress' },
].map(col => ({
  ...col,
  label: <T id={`PromotionReservationsTable.${col.id}`} />,
}));

const makeMapPromotionReservation = promotion => (promotionReservation) => {
  const { users: promotionUsers = [] } = promotion;
  const { _id, promotionLot, loan, expirationDate } = promotionReservation;
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
  withState('status', 'setStatus'),
  withSmartQuery({
    query,
    params: ({ promotion: { _id: promotionId }, status }) => ({
      promotionId,
      status,
    }),
    dataName: 'promotionReservations',
  }),
  withProps(({ promotionReservations, promotion }) => ({
    rows: promotionReservations.map(makeMapPromotionReservation(promotion)),
    columnOptions,
  })),
);
