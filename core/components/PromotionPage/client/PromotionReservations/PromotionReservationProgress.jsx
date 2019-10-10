// @flow
import React from 'react';
import moment from 'moment';

import {
  PROMOTION_RESERVATION_MORTGAGE_CERTIFICATION_STATUS,
  AGREEMENT_STATUSES,
  DEPOSIT_STATUSES,
  PROMOTION_RESERVATION_LENDER_STATUS,
} from '../../../../api/promotionReservations/promotionReservationConstants';
import BaseIcon from '../../../Icon';
import T from '../../../Translation';

type PromotionReservationProgressProps = {};

const makeGetIcon = ({ success = [], waiting = [], failed = [] }) => (status) => {
  if (waiting.includes(status)) {
    return { icon: 'waiting', color: 'warning' };
  }
  if (failed.includes(status)) {
    return { icon: 'error', color: 'error' };
  }
  if (success.includes(status)) {
    return { icon: 'checkCircle', color: 'success' };
  }

  return { icon: 'radioButtonChecked', color: 'primary' };
};

const iconTooltip = ({ date, status, id }) =>
  date && (
    <div className="flex-col" style={{ flexGrow: 1 }}>
      <b className="flex sb">
        <T id={`Forms.${id}`} />
        &nbsp;
        <i className="secondary">{moment(date).format('D MMMM YY')}</i>
      </b>
      <T id={`Forms.status.${status}`} />
    </div>
  );

const Icon = ({ icon, color, date, status, id, variant }) => {
  if (variant === 'text') {
    return (
      <p className="flex center-align">
        <BaseIcon type={icon} color={color} className="mr-16" />
        {iconTooltip({ date, status, id })}
      </p>
    );
  }

  const baseIcon = (
    <BaseIcon
      type={icon}
      color={color}
      className="promotion-reservation-progress-icon"
      tooltip={iconTooltip({ date, status, id })}
    />
  );

  if (variant === 'label') {
    return (
      <div className="flex-col center-align">
        {baseIcon}
        <T id={`Forms.${id}`} />
      </div>
    );
  }

  return baseIcon;
};
const makeIcon = variant => ({ icon, color, status, date, id }) => (
  <Icon
    icon={icon}
    color={color}
    date={date}
    status={status}
    variant={variant}
    id={id}
  />
);

const getAdminNoteIcon = (
  { note = 'Pas de commentaire', date } = {},
  showText,
) =>
  date && (
    <Icon
      type="info"
      tooltip={(
        <div>
          <b>
            <T id="Forms.adminNote" />
          </b>
          <br />
          <i>{moment(date).toNow()}</i>
          <br />
          {note}
        </div>
      )}
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
    lender.status === PROMOTION_RESERVATION_LENDER_STATUS.VALIDATED,
  ].reduce((tot, v) => (v === true ? tot + 1 : tot), 0);

const PromotionReservationProgress = ({
  promotionReservation,
  style,
  variant = 'icon',
}: PromotionReservationProgressProps) => {
  const {
    mortgageCertification,
    reservationAgreement,
    deposit,
    lender,
    adminNote,
  } = promotionReservation;

  const icon = makeIcon(variant);

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
        success: [PROMOTION_RESERVATION_LENDER_STATUS.VALIDATED],
        error: [PROMOTION_RESERVATION_LENDER_STATUS.REJECTED],
        waiting: [PROMOTION_RESERVATION_LENDER_STATUS.WAITING],
      })(lender.status),
      id: 'lender',
    }),
    getAdminNoteIcon(adminNote, variant === 'showText'),
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
