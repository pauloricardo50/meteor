import { Meteor } from 'meteor/meteor';
import React from 'react';

import PromotionReservationProgressItem from './PromotionReservationProgressItem';
import {
  PROMOTION_OPTION_SIMPLE_VERIFICATION_STATUS,
  PROMOTION_OPTION_FULL_VERIFICATION_STATUS,
  PROMOTION_OPTION_AGREEMENT_STATUS,
  PROMOTION_OPTION_DEPOSIT_STATUS,
  PROMOTION_OPTION_BANK_STATUS,
} from '../../../api/promotionOptions/promotionOptionConstants';

export const makeGetIcon = ({
  success = [],
  waiting = [],
  error = [],
  warning = [],
  sent = [],
  waitList = [],
}) => status => {
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
  if (sent.includes(status)) {
    return { icon: 'send', color: 'warning' };
  }
  if (waitList.includes(status)) {
    return { icon: 'schedule', color: 'warning' };
  }

  return { icon: 'radioButtonChecked', color: 'primary' };
};

export const makeGetProgressItem = (variant, promotionOptionId, loanId) => ({
  icon,
  color,
  status,
  date,
  id,
  component,
  placeholder,
}) => ({
  id,
  progressItem: (
    <PromotionReservationProgressItem
      icon={icon}
      color={color}
      date={date}
      status={status}
      variant={variant}
      id={id}
      promotionOptionId={promotionOptionId}
      component={component}
      placeholder={placeholder}
      loanId={loanId}
    />
  ),
});

export const getPercent = ({ valid, required }) => {
  if (valid === 0 || required === 0) {
    return 0;
  }

  return valid / required;
};

export const getRatio = ({ valid, required }) => ({
  value: valid,
  target: required,
});

export const getAdminNoteIcon = ({
  proNote: { note, date },
  variant,
  promotionOptionId,
  isAnonymized,
}) => {
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
      id="proNote"
      // Modify the note on the loan
      promotionOptionId={promotionOptionId}
    />
  );
};

export const rawPromotionReservationProgress = ({
  simpleVerification,
  fullVerification,
  reservationAgreement,
  reservationDeposit,
  bank,
}) =>
  [
    simpleVerification.status ===
      PROMOTION_OPTION_SIMPLE_VERIFICATION_STATUS.VALIDATED,
    fullVerification.status ===
      PROMOTION_OPTION_FULL_VERIFICATION_STATUS.VALIDATED,
    reservationAgreement.status === PROMOTION_OPTION_AGREEMENT_STATUS.RECEIVED,
    reservationDeposit.status === PROMOTION_OPTION_DEPOSIT_STATUS.PAID,
    bank.status === PROMOTION_OPTION_BANK_STATUS.VALIDATED,
  ].reduce((tot, v) => (v === true ? tot + 1 : tot), 0);
