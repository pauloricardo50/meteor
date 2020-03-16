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

const iconConfig = {
  simpleVerification: {
    error: [PROMOTION_OPTION_SIMPLE_VERIFICATION_STATUS.REJECTED],
    success: [PROMOTION_OPTION_SIMPLE_VERIFICATION_STATUS.VALIDATED],
    waiting: [PROMOTION_OPTION_SIMPLE_VERIFICATION_STATUS.CALCULATED],
  },
  fullVerification: {
    error: [PROMOTION_OPTION_FULL_VERIFICATION_STATUS.REJECTED],
    success: [PROMOTION_OPTION_FULL_VERIFICATION_STATUS.VALIDATED],
  },
  bank: {
    success: [PROMOTION_OPTION_BANK_STATUS.VALIDATED],
    error: [PROMOTION_OPTION_BANK_STATUS.REJECTED],
    warning: [PROMOTION_OPTION_BANK_STATUS.VALIDATED_WITH_CONDITIONS],
    sent: [PROMOTION_OPTION_BANK_STATUS.SENT],
    waitList: [PROMOTION_OPTION_BANK_STATUS.WAITLIST],
  },
  reservationAgreement: {
    success: [PROMOTION_OPTION_AGREEMENT_STATUS.RECEIVED],
    waiting: [PROMOTION_OPTION_AGREEMENT_STATUS.WAITING],
  },
  reservationDeposit: {
    success: [PROMOTION_OPTION_DEPOSIT_STATUS.PAID],
    error: [PROMOTION_OPTION_DEPOSIT_STATUS.UNPAID],
  },
};

export const getPromotionReservationIcon = (id, status) => {
  const config = iconConfig[id];

  if (!config) {
    return;
  }

  const {
    success = [],
    waiting = [],
    error = [],
    warning = [],
    sent = [],
    waitList = [],
  } = config;

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

export const makeGetProgressItem = ({
  variant,
  promotionOptionId,
  loanId,
  withTooltip,
  withIcon,
  renderStatus,
}) => ({ icon, color, status, date, id, renderComponent, placeholder }) => ({
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
      renderComponent={renderComponent}
      placeholder={placeholder}
      loanId={loanId}
      withTooltip={withTooltip}
      withIcon={withIcon}
      renderStatus={renderStatus}
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
  withTooltip,
  withIcon,
  renderStatus,
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
      withTooltip={withTooltip}
      withIcon={withIcon}
      renderStatus={renderStatus}
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
