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

const Icon = ({ icon, color, date, status, id, showText }) =>
  (showText ? (
    <p className="flex center-align">
      <BaseIcon type={icon} color={color} className="mr-16" />
      {iconTooltip({ date, status, id })}
    </p>
  ) : (
    <BaseIcon
      type={icon}
      color={color}
      className="mr-8"
      tooltip={iconTooltip({ date, status, id })}
    />
  ));

const getMortgageCertificationIcon = ({ date, status }, showText) => {
  const { icon, color } = makeGetIcon({
    error: [PROMOTION_RESERVATION_MORTGAGE_CERTIFICATION_STATUS.NONE],
    success: [PROMOTION_RESERVATION_MORTGAGE_CERTIFICATION_STATUS.VALIDATED],
    waiting: [PROMOTION_RESERVATION_MORTGAGE_CERTIFICATION_STATUS.CALCULATED],
  })(status);
  return (
    <Icon
      icon={icon}
      color={color}
      date={date}
      status={status}
      showText={showText}
      id="mortgageCertification"
    />
  );
};
const getAgreementIcon = ({ date, status }, showText) => {
  const { icon, color } = makeGetIcon({
    success: [AGREEMENT_STATUSES.SIGNED],
    waiting: [AGREEMENT_STATUSES.WAITING],
    error: [AGREEMENT_STATUSES.UNSIGNED],
  })(status);
  return (
    <Icon
      icon={icon}
      color={color}
      date={date}
      status={status}
      showText={showText}
      id="reservationAgreement"
    />
  );
};
const getDepositIcon = ({ date, status }, showText) => {
  const { icon, color } = makeGetIcon({
    success: [DEPOSIT_STATUSES.PAID],
    error: [DEPOSIT_STATUSES.UNPAID],
  })(status);
  return (
    <Icon
      icon={icon}
      color={color}
      date={date}
      status={status}
      showText={showText}
      id="deposit"
    />
  );
};
const getLenderIcon = ({ date, status }, showText) => {
  const { icon, color } = makeGetIcon({
    success: [PROMOTION_RESERVATION_LENDER_STATUS.VALIDATED],
    error: [PROMOTION_RESERVATION_LENDER_STATUS.REJECTED],
    waiting: [PROMOTION_RESERVATION_LENDER_STATUS.WAITING],
  })(status);
  return (
    <Icon
      icon={icon}
      color={color}
      date={date}
      status={status}
      showText={showText}
      id="lender"
    />
  );
};
const getAdminNoteIcon = ({ note, date }, showText) =>
  note && (
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
  showText,
}: PromotionReservationProgressProps) => {
  const {
    mortgageCertification,
    reservationAgreement,
    deposit,
    lender,
    adminNote,
  } = promotionReservation;

  const icons = [
    getMortgageCertificationIcon(mortgageCertification, showText),
    getAgreementIcon(reservationAgreement, showText),
    getDepositIcon(deposit, showText),
    getLenderIcon(lender, showText),
    getAdminNoteIcon(adminNote, showText),
  ].filter(x => x);

  return (
    <div className="flex center-align" style={style}>
      {icons}
    </div>
  );
};

export default PromotionReservationProgress;
