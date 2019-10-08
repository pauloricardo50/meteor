// @flow
import React from 'react';
import moment from 'moment';

import {
  PROMOTION_RESERVATION_MORTGAGE_CERTIFICATION_STATUS,
  AGREEMENT_STATUSES,
  DEPOSIT_STATUSES,
  PROMOTION_RESERVATION_LENDER_STATUS,
} from '../../../../api/promotionReservations/promotionReservationConstants';
import Icon from '../../../Icon';

type PromotionReservationProgressProps = {};

const getMortgageCertificationIcon = mortgageCertification => (
  <Icon type="checkCircle" className="mr-8" />
);
const getAgreementIcon = agreement => (
  <Icon type="checkCircle" className="mr-8" />
);
const getDepositIcon = deposit => <Icon type="checkCircle" className="mr-8" />;
const getLenderIcon = lender => <Icon type="checkCircle" className="mr-8" />;
const getAdminNoteIcon = ({ note, date }) =>
  note && (
    <Icon
      type="info"
      tooltip={(
        <div>
          <i>{moment(date)}</i>
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
