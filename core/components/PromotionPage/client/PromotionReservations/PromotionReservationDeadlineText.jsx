import { Meteor } from 'meteor/meteor';

import React from 'react';

import { getUserNameAndOrganisation } from '../../../../api/helpers';
import { getLoanProgress } from '../../../../api/loans/helpers';
import {
  PROMOTION_OPTION_BANK_STATUS,
  PROMOTION_OPTION_FULL_VERIFICATION_STATUS,
  PROMOTION_OPTION_SIMPLE_VERIFICATION_STATUS,
  PROMOTION_OPTION_STATUS,
} from '../../../../api/promotionOptions/promotionOptionConstants';
import T from '../../../Translation';
import { usePromotion } from '../PromotionPageContext';

const isApp = Meteor.microservice === 'app';

const getAppDescriptionId = (promotionOption, loan) => {
  if (promotionOption.bank.status === PROMOTION_OPTION_BANK_STATUS.WAITLIST) {
    return 'waitlist';
  }
  if (promotionOption.bank.status === PROMOTION_OPTION_BANK_STATUS.REJECTED) {
    return 'bankRejected';
  }
  if (
    promotionOption.bank.status ===
    PROMOTION_OPTION_BANK_STATUS.VALIDATED_WITH_CONDITIONS
  ) {
    return 'bankValidatedWithConditions';
  }
  if (promotionOption.bank.status === PROMOTION_OPTION_BANK_STATUS.VALIDATED) {
    return 'bankValidated';
  }
  if (promotionOption.bank.status === PROMOTION_OPTION_BANK_STATUS.SENT) {
    return 'bankSent';
  }
  if (
    promotionOption.fullVerification.status ===
    PROMOTION_OPTION_FULL_VERIFICATION_STATUS.VALIDATED
  ) {
    return 'epotekValidated';
  }
  if (
    promotionOption.simpleVerification.status ===
      PROMOTION_OPTION_SIMPLE_VERIFICATION_STATUS.REJECTED ||
    promotionOption.fullVerification.status ===
      PROMOTION_OPTION_FULL_VERIFICATION_STATUS.REJECTED
  ) {
    return 'epotekRejected';
  }

  const { info, documents } = loan?.loanProgress || getLoanProgress(loan) || {};

  if (info && documents) {
    if (
      info.valid === info.required &&
      documents.valid === documents.required
    ) {
      return 'epotekWaiting';
    }
  }

  return 'missingInfo';
};

const getTextLabel = (promotionOption, loan) => {
  const { status } = promotionOption;

  if (isApp && status === PROMOTION_OPTION_STATUS.RESERVATION_ACTIVE) {
    const id = getAppDescriptionId(promotionOption, loan);
    return `PromotionReservationDeadline.app.${id}`;
  }

  return `PromotionReservationDeadline.${status}`;
};

const PromotionReservationDeadlineText = ({
  promotionOption,
  loan = promotionOption.loan,
}) => {
  const { invitedBy } = promotionOption;
  const {
    promotion: { users },
  } = usePromotion();
  const pro = users.find(({ _id }) => _id === invitedBy);
  const proName = getUserNameAndOrganisation({ user: pro });

  const textLabel = getTextLabel(promotionOption, loan);
  const values = { isApp, proName };

  return (
    <div style={{ marginBottom: 16 }}>
      <h3 className="font-size-2 mt-0">
        <T id={textLabel} values={values} />
      </h3>
      <p className="description ">
        <T id={`${textLabel}.description`} values={values} />
      </p>
    </div>
  );
};

export default PromotionReservationDeadlineText;
