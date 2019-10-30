// @flow
import { Meteor } from 'meteor/meteor';
import React from 'react';
import cx from 'classnames';

import {
  PROMOTION_OPTION_MORTGAGE_CERTIFICATION_STATUS,
  AGREEMENT_STATUS,
  DEPOSIT_STATUS,
  PROMOTION_OPTION_BANK_STATUS,
} from '../../../../../api/promotionOptions/promotionOptionConstants';
import PromotionReservationProgressItem from './PromotionReservationProgressItem';

type PromotionReservationProgressProps = {};

const makeGetIcon = ({
  success = [],
  waiting = [],
  error = [],
  warning = [],
}) => (status) => {
  if (waiting.includes(status)) {
    return { icon: 'waiting', color: 'warning' };
  }
  if (warning.includes(status)) {
    return { icon: 'error', color: 'warning' };
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
  const shouldShowNote = !isAnonymized && Meteor.microservice !== 'app';

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
    reservationAgreement.status === AGREEMENT_STATUS.RECEIVED,
    deposit.status === DEPOSIT_STATUS.PAID,
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
        success: [AGREEMENT_STATUS.RECEIVED],
        error: [AGREEMENT_STATUS.WAITING],
      })(reservationAgreement.status),
      id: 'reservationAgreement',
    }),
    icon({
      ...deposit,
      ...makeGetIcon({
        success: [DEPOSIT_STATUS.PAID],
        error: [DEPOSIT_STATUS.UNPAID],
      })(deposit.status),
      id: 'deposit',
    }),
    icon({
      ...bank,
      ...makeGetIcon({
        success: [PROMOTION_OPTION_BANK_STATUS.VALIDATED],
        error: [PROMOTION_OPTION_BANK_STATUS.REJECTED],
        warning: [PROMOTION_OPTION_BANK_STATUS.VALIDATED_WITH_CONDITIONS],
        waiting: [PROMOTION_OPTION_BANK_STATUS.SENT],
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
