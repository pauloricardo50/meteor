// @flow
import React from 'react';
import moment from 'moment';

import {
  PROMOTION_RESERVATION_MORTGAGE_CERTIFICATION_STATUS,
  AGREEMENT_STATUSES,
  DEPOSIT_STATUSES,
  PROMOTION_RESERVATION_BANK_STATUS,
} from '../../../../../api/promotionReservations/promotionReservationConstants';
import BaseIcon from '../../../../Icon';
import T from '../../../../Translation';
import PromotionReservationProgressItem from './PromotionReservationProgressItem';

type PromotionReservationProgressProps = {};

const makeGetIcon = ({ success = [], waiting = [], error = [] }) => (status) => {
  if (waiting.includes(status)) {
    return { icon: 'waiting', color: 'warning' };
  }
  if (error.includes(status)) {
    return { icon: 'error', color: 'error' };
  }
  if (success.includes(status)) {
    return { icon: 'checkCircle', color: 'success' };
  }

  return { icon: 'radioButtonChecked', color: 'primary' };
};

const makeIcon = (variant, isEditing, promotionReservationId) => ({
  icon,
  color,
  status,
  date,
  id,
}) => (
  <PromotionReservationProgressItem
    icon={icon}
    color={color}
    date={date}
    status={status}
    variant={variant}
    id={id}
    isEditing={isEditing}
    promotionReservationId={promotionReservationId}
  />
);

const getAdminNoteIcon = (
  { note, date } = {},
  variant,
  isEditing,
  promotionReservationId,
) =>
  date && (
    <PromotionReservationProgressItem
      icon="info"
      color={note ? 'primary' : 'borderGrey'}
      date={date}
      note={note}
      placeholder="Pas de commentaire"
      variant={variant}
      id="adminNote"
      isEditing={isEditing}
      promotionReservationId={promotionReservationId}
    />
  );

export const rawPromotionReservationProgress = ({
  mortgageCertification,
  reservationAgreement,
  deposit,
  lender,
}) =>
  [
    mortgageCertification.status
      === PROMOTION_RESERVATION_MORTGAGE_CERTIFICATION_STATUS.VALIDATED,
    reservationAgreement.status === AGREEMENT_STATUSES.SIGNED,
    deposit.status === DEPOSIT_STATUSES.PAID,
    lender.status === PROMOTION_RESERVATION_BANK_STATUS.VALIDATED,
  ].reduce((tot, v) => (v === true ? tot + 1 : tot), 0);

const PromotionReservationProgress = ({
  promotionReservation,
  style,
  variant = 'icon',
  isEditing,
}: PromotionReservationProgressProps) => {
  const {
    _id: promotionReservationId,
    mortgageCertification,
    reservationAgreement,
    deposit,
    lender,
    adminNote,
  } = promotionReservation;

  const icon = makeIcon(variant, isEditing, promotionReservationId);

  const icons = [
    icon({
      ...mortgageCertification,
      ...makeGetIcon({
        error: [PROMOTION_RESERVATION_MORTGAGE_CERTIFICATION_STATUS.INSOLVENT],
        success: [PROMOTION_RESERVATION_MORTGAGE_CERTIFICATION_STATUS.SOLVENT],
        waiting: [
          PROMOTION_RESERVATION_MORTGAGE_CERTIFICATION_STATUS.CALCULATED,
        ],
      })(mortgageCertification.status),
      id: 'mortgageCertification',
    }),
    icon({
      ...reservationAgreement,
      ...makeGetIcon({
        success: [AGREEMENT_STATUSES.SIGNED],
        waiting: [AGREEMENT_STATUSES.WAITING],
        error: [AGREEMENT_STATUSES.UNSIGNED],
      })(reservationAgreement.status),
      id: 'reservationAgreement',
    }),
    icon({
      ...deposit,
      ...makeGetIcon({
        success: [DEPOSIT_STATUSES.PAID],
        error: [DEPOSIT_STATUSES.UNPAID],
      })(deposit.status),
      id: 'deposit',
    }),
    icon({
      ...lender,
      ...makeGetIcon({
        success: [PROMOTION_RESERVATION_BANK_STATUS.VALIDATED],
        error: [PROMOTION_RESERVATION_BANK_STATUS.REJECTED],
        waiting: [PROMOTION_RESERVATION_BANK_STATUS.WAITING],
      })(lender.status),
      id: 'lender',
    }),
    getAdminNoteIcon(adminNote, variant, isEditing, promotionReservationId),
  ].filter(x => x);

  return (
    <div
      className="promotion-reservation-progress flex center-align"
      style={style}
    >
      {icons}
    </div>
  );
};

export default PromotionReservationProgress;
