import React, { useMemo } from 'react';
import cx from 'classnames';
import { withProps } from 'recompose';

import { getLoanProgress } from '../../../api/loans/helpers';
import ProgressCircle from '../../ProgressCircle';
import {
  getAdminNoteIcon,
  getPercent,
  getPromotionReservationIcon,
  getRatio,
  makeGetProgressItem,
} from './PromotionReservationProgressHelpers';

const PromotionReservationProgressComponent = ({
  promotionOption,
  style,
  variant = 'icon',
  className,
  loanProgress = {},
  withTooltip,
  withIcon,
  renderStatus,
  loan: loanOverride,
}) => {
  const {
    _id: promotionOptionId,
    simpleVerification,
    fullVerification,
    reservationAgreement,
    reservationDeposit,
    bank,
    loan,
    isAnonymized,
  } = promotionOption;
  const { user, _id: loanId, proNote = {} } = loanOverride || loan;
  const { info = {}, documents = {} } = loanProgress;

  const getProgressItem = useMemo(
    () =>
      makeGetProgressItem({
        variant,
        promotionOptionId,
        loanId,
        withTooltip,
        withIcon,
        renderStatus,
      }),
    [],
  );

  const verificationAndBankIcons = [
    getProgressItem({
      ...simpleVerification,
      ...getPromotionReservationIcon(
        'simpleVerification',
        simpleVerification.status,
      ),
      id: 'simpleVerification',
    }),
    ...[
      { data: info, id: 'info', tooltipPrefix: 'Informations:' },
      { data: documents, id: 'documents', tooltipPrefix: 'Documents:' },
    ].map(({ data, id, tooltipPrefix }) =>
      getProgressItem({
        renderComponent: (
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
        placeholder: `${data.valid}/${data.required} (${Math.round(
          getPercent(info) * 100,
        )}%)`,
        id,
      }),
    ),
    getProgressItem({
      ...fullVerification,
      ...getPromotionReservationIcon(
        'fullVerification',
        fullVerification.status,
      ),
      id: 'fullVerification',
    }),
    getProgressItem({
      ...bank,
      ...getPromotionReservationIcon('bank', bank.status),
      id: 'bank',
    }),
  ];

  const agreementAndDepositIcons = [
    getProgressItem({
      ...reservationAgreement,
      ...getPromotionReservationIcon(
        'reservationAgreement',
        reservationAgreement.status,
      ),
      id: 'reservationAgreement',
    }),
    getProgressItem({
      ...reservationDeposit,
      ...getPromotionReservationIcon(
        'reservationDeposit',
        reservationDeposit.status,
      ),
      id: 'reservationDeposit',
    }),
  ];

  return (
    <div
      className={cx(
        'promotion-reservation-progress flex center-align',
        className,
      )}
      style={style}
    >
      <div className="promotion-reservation-progress-icons">
        {verificationAndBankIcons.map(({ id, progressItem }, index) => (
          <div className="icon" key={id}>
            {progressItem}
          </div>
        ))}
      </div>
      <div className="promotion-reservation-progress-icons">
        {agreementAndDepositIcons.map(({ id, progressItem }, index) => (
          <div className="icon" key={id}>
            {progressItem}
          </div>
        ))}
      </div>
      <div className="promotion-reservation-progress-icons">
        {!isAnonymized && (
          <div className="icon">
            {getAdminNoteIcon({
              proNote,
              variant,
              promotionOptionId,
              isAnonymized,
              withTooltip,
              withIcon,
              renderStatus,
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default withProps(
  ({
    loan,
    promotionOption: {
      loan: { loanProgress },
    },
  }) => ({ loanProgress: loanProgress || getLoanProgress(loan) }),
)(PromotionReservationProgressComponent);
