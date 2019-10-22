// @flow
import React from 'react';
import cx from 'classnames';

import {
  PROMOTION_OPTION_MORTGAGE_CERTIFICATION_STATUS,
  AGREEMENT_STATUSES,
  DEPOSIT_STATUSES,
  PROMOTION_OPTION_BANK_STATUS,
} from '../../../../../api/promotionOptions/promotionOptionConstants';
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

const makeIcon = (variant, isEditing, promotionOptionId) => ({
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
    promotionOptionId={promotionOptionId}
  />
);

const getAdminNoteIcon = (
  { note, date, isAnonymized } = {},
  variant,
  isEditing,
  promotionOptionId,
) => {
  const shouldShowNote = !isAnonymized;

  if (!shouldShowNote) {
    return null;
  }

  return (
    <PromotionReservationProgressItem
      icon="info"
      color={note ? 'primary' : 'borderGrey'}
      date={date}
      note={note}
      placeholder="Pas de commentaire"
      variant={variant}
      id="adminNote"
      isEditing={isEditing}
      promotionOptionId={promotionOptionId}
    />
  );
};

export const rawPromotionReservationProgress = ({
  mortgageCertification,
  reservationAgreement,
  deposit,
  bank,
}) =>
  [
    mortgageCertification.status
      === PROMOTION_OPTION_MORTGAGE_CERTIFICATION_STATUS.VALIDATED,
    reservationAgreement.status === AGREEMENT_STATUSES.SIGNED,
    deposit.status === DEPOSIT_STATUSES.PAID,
    bank.status === PROMOTION_OPTION_BANK_STATUS.VALIDATED,
  ].reduce((tot, v) => (v === true ? tot + 1 : tot), 0);

const PromotionReservationProgress = ({
  promotionOption,
  style,
  variant = 'icon',
  isEditing,
  className,
}: PromotionReservationProgressProps) => {
  const {
    _id: promotionOptionId,
    mortgageCertification,
    reservationAgreement,
    deposit,
    bank,
    adminNote,
    loan,
    isAnonymized,
  } = promotionOption;
  const { user } = loan;

  const icon = makeIcon(variant, isEditing, promotionOptionId);

  const icons = [
    icon({
      ...mortgageCertification,
      ...makeGetIcon({
        error: [PROMOTION_OPTION_MORTGAGE_CERTIFICATION_STATUS.INSOLVENT],
        success: [PROMOTION_OPTION_MORTGAGE_CERTIFICATION_STATUS.SOLVENT],
        waiting: [
          PROMOTION_OPTION_MORTGAGE_CERTIFICATION_STATUS.TO_BE_VERIFIED,
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
      ...bank,
      ...makeGetIcon({
        success: [PROMOTION_OPTION_BANK_STATUS.VALIDATED],
        error: [PROMOTION_OPTION_BANK_STATUS.REJECTED],
        waiting: [PROMOTION_OPTION_BANK_STATUS.WAITING],
      })(bank.status),
      id: 'bank',
    }),
    !isAnonymized
      && getAdminNoteIcon(adminNote, variant, isEditing, promotionOptionId),
  ].filter(x => x);

  return (
    <div
      className={cx(
        'promotion-reservation-progress flex center-align',
        className,
      )}
      style={style}
    >
      {icons}
    </div>
  );
};

export default PromotionReservationProgress;
