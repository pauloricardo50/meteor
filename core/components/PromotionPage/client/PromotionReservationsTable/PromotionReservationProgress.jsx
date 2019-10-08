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

const iconTooltip = ({ date, status }) =>
  date && (
    <div>
      <i>{moment(date).format('D MMMM YY')}</i>
      <br />
      <T id={`Forms.status.${status}`} />
    </div>
  );

const Icon = ({ icon, color, date, status }) => (
  <BaseIcon
    type={icon}
    color={color}
    className="mr-8"
    tooltip={iconTooltip({ date, status })}
  />
);

const getMortgageCertificationIcon = ({ date, status }) => {
  const { icon, color } = makeGetIcon({
    error: [PROMOTION_RESERVATION_MORTGAGE_CERTIFICATION_STATUS.NONE],
    success: [PROMOTION_RESERVATION_MORTGAGE_CERTIFICATION_STATUS.VALIDATED],
    waiting: [PROMOTION_RESERVATION_MORTGAGE_CERTIFICATION_STATUS.CALCULATED],
  })(status);
  return <Icon icon={icon} color={color} date={date} status={status} />;
};
const getAgreementIcon = ({ date, status }) => {
  const { icon, color } = makeGetIcon({
    success: [AGREEMENT_STATUSES.SIGNED],
    waiting: [AGREEMENT_STATUSES.WAITING],
    error: [AGREEMENT_STATUSES.UNSIGNED],
  })(status);
  return <Icon icon={icon} color={color} date={date} status={status} />;
};
const getDepositIcon = ({ date, status }) => {
  const { icon, color } = makeGetIcon({
    success: [DEPOSIT_STATUSES.PAID],
    error: [DEPOSIT_STATUSES.UNPAID],
  })(status);
  return <Icon icon={icon} color={color} date={date} status={status} />;
};
const getLenderIcon = ({ date, status }) => {
  const { icon, color } = makeGetIcon({
    success: [PROMOTION_RESERVATION_LENDER_STATUS.VALIDATED],
    error: [PROMOTION_RESERVATION_LENDER_STATUS.REJECTED],
    waiting: [PROMOTION_RESERVATION_LENDER_STATUS.WAITING],
  })(status);
  return <Icon icon={icon} color={color} date={date} status={status} />;
};
const getAdminNoteIcon = ({ note, date }) =>
  note && (
    <Icon
      type="info"
      tooltip={(
        <div>
          <i>{moment(date).toNow()}</i>
          <br />
          {note}
        </div>
      )}
    />
  );

export const rawPromotionReservationProgress = ({
  mortgageCertification,
  agreement,
  deposit,
  lender,
}) =>
  [
    mortgageCertification.status
      === PROMOTION_RESERVATION_MORTGAGE_CERTIFICATION_STATUS.VALIDATED,
    agreement.status === AGREEMENT_STATUSES.SIGNED,
    deposit.status === DEPOSIT_STATUSES.PAID,
    lender.status === PROMOTION_RESERVATION_LENDER_STATUS.VALIDATED,
  ].reduce((tot, v) => (v === true ? tot + 1 : tot), 0);

const PromotionReservationProgress = ({
  promotionReservation,
}: PromotionReservationProgressProps) => {
  const {
    mortgageCertification,
    agreement,
    deposit,
    lender,
    adminNote,
  } = promotionReservation;

  const icons = [
    getMortgageCertificationIcon(mortgageCertification),
    getAgreementIcon(agreement),
    getDepositIcon(deposit),
    getLenderIcon(lender),
    getAdminNoteIcon(adminNote),
  ].filter(x => x);

  return <div className="flex center-align">{icons}</div>;
};

export default PromotionReservationProgress;
