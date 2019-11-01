// @flow
import { Meteor } from 'meteor/meteor';
import React from 'react';
import cx from 'classnames';

import {
  PROMOTION_OPTION_SIMPLE_VERIFICATION_STATUS,
  PROMOTION_OPTION_FULL_VERIFICATION_STATUS,
  PROMOTION_OPTION_AGREEMENT_STATUS,
  PROMOTION_OPTION_DEPOSIT_STATUS,
  PROMOTION_OPTION_BANK_STATUS,
} from '../../../../../api/promotionOptions/promotionOptionConstants';
import PromotionReservationProgressItem from './PromotionReservationProgressItem';
import ProgressCircle from '../../../../ProgressCircle';

type PromotionReservationProgressProps = {};

const makeGetIcon = ({
  success = [],
  waiting = [],
  error = [],
  warning = [],
  sent = [],
  waitList = [],
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
  if (sent.includes(status)) {
    return { icon: 'send', color: 'warning' };
  }
  if (waitList.includes(status)) {
    return { icon: 'schedule', color: 'warning' };
  }

  return { icon: 'radioButtonChecked', color: 'primary' };
};

const makeIcon = (variant, isEditing, promotionOptionId) => ({
  icon,
  color,
  status,
  date,
  id,
  component,
  placeholder,
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
    component={component}
    placeholder={placeholder}
  />
);

const getPercent = ({ valid, required }) => {
  if (valid === 0 || required === 0) {
    return 0;
  }

  return valid / required;
};

const getRatio = ({ valid, required }) => ({ value: valid, target: required });

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
  simpleVerification,
  reservationAgreement,
  deposit,
  bank,
}) =>
  [
    simpleVerification.status
      === PROMOTION_OPTION_SIMPLE_VERIFICATION_STATUS.VALIDATED,
    reservationAgreement.status === PROMOTION_OPTION_AGREEMENT_STATUS.RECEIVED,
    deposit.status === PROMOTION_OPTION_DEPOSIT_STATUS.PAID,
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
    simpleVerification,
    fullVerification,
    reservationAgreement,
    deposit,
    bank,
    adminNote,
    loan,
    isAnonymized,
  } = promotionOption;
  const { user, loanProgress: { info = {}, documents = {} } = {} } = loan;

  const icon = makeIcon(variant, isEditing, promotionOptionId);

  const verificationAndBankIcons = [
    icon({
      ...simpleVerification,
      ...makeGetIcon({
        error: [PROMOTION_OPTION_SIMPLE_VERIFICATION_STATUS.REJECTED],
        success: [PROMOTION_OPTION_SIMPLE_VERIFICATION_STATUS.VALIDATED],
        waiting: [PROMOTION_OPTION_SIMPLE_VERIFICATION_STATUS.CALCULATED],
      })(simpleVerification.status),
      id: 'simpleVerification',
    }),
    ...[
      { data: info, id: 'info', tooltipPrefix: 'Informations:' },
      { data: documents, id: 'documents', tooltipPrefix: 'Documents:' },
    ].map(({ data, id, tooltipPrefix }) =>
      icon({
        component: (
          <ProgressCircle
            percent={getPercent(data)}
            ratio={getRatio(data)}
            options={{
              squareSize: 20,
              strokeWidth: 4,
              animated: true,
              withRatio: true,
              tooltipPrefix,
              style: { padding: 2 },
            }}
          />
        ),
        placeholder: `${data.valid}/${data.required} (${Math.round(getPercent(info) * 100)}%)`,
        id,
      })),
    icon({
      ...fullVerification,
      ...makeGetIcon({
        error: [PROMOTION_OPTION_FULL_VERIFICATION_STATUS.REJECTED],
        success: [PROMOTION_OPTION_FULL_VERIFICATION_STATUS.VALIDATED],
      })(fullVerification.status),
      id: 'fullVerification',
    }),
    icon({
      ...bank,
      ...makeGetIcon({
        success: [PROMOTION_OPTION_BANK_STATUS.VALIDATED],
        error: [PROMOTION_OPTION_BANK_STATUS.REJECTED],
        warning: [PROMOTION_OPTION_BANK_STATUS.VALIDATED_WITH_CONDITIONS],
        sent: [PROMOTION_OPTION_BANK_STATUS.SENT],
        waitList: [PROMOTION_OPTION_BANK_STATUS.WAITLIST],
      })(bank.status),
      id: 'bank',
    }),
  ];

  const agreementAndDepositIcons = [
    icon({
      ...reservationAgreement,
      ...makeGetIcon({
        success: [PROMOTION_OPTION_AGREEMENT_STATUS.RECEIVED],
        error: [PROMOTION_OPTION_AGREEMENT_STATUS.WAITING],
      })(reservationAgreement.status),
      id: 'reservationAgreement',
    }),
    icon({
      ...deposit,
      ...makeGetIcon({
        success: [PROMOTION_OPTION_DEPOSIT_STATUS.PAID],
        error: [PROMOTION_OPTION_DEPOSIT_STATUS.UNPAID],
      })(deposit.status),
      id: 'deposit',
    }),
  ];

  return (
    <div
      className={cx(
        'promotion-reservation-progress flex center-align',
        className,
        isEditing ? 'editing' : '',
      )}
      style={style}
    >
      <div className="promotion-reservation-progress-icons">
        {verificationAndBankIcons.map((icon, index) => (
          <div className="icon" key={`verification${index}`}>
            {icon}
          </div>
        ))}
      </div>
      <div className="promotion-reservation-progress-icons">
        {agreementAndDepositIcons.map((icon, index) => (
          <div className="icon" key={`agreement${index}`}>
            {icon}
          </div>
        ))}
      </div>
      <div className="promotion-reservation-progress-icons">
        {!isAnonymized
          && getAdminNoteIcon(adminNote, variant, isEditing, promotionOptionId)}
      </div>
    </div>
  );
};

export default PromotionReservationProgress;
