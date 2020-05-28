import React, { useMemo } from 'react';
import cx from 'classnames';
import { withProps } from 'recompose';

import { getLoanProgress } from '../../../api/loans/helpers';
import { loanProgress as loanProgressQuery } from '../../../api/loans/queries';
import { useStaticMeteorData } from '../../../hooks/useMeteorData';
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
  loanProgress,
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
  const { _id: loanId, proNote = {} } = loanOverride || loan;
  const info = loanProgress?.info;
  const documents = loanProgress?.documents;

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
      info && {
        data: info,
        id: 'info',
        tooltipPrefix: 'Informations:',
      },
      documents && {
        data: documents,
        id: 'documents',
        tooltipPrefix: 'Documents:',
      },
    ]
      .filter(x => x)
      .map(({ data, id, tooltipPrefix }) =>
        getProgressItem({
          renderComponent: (
            <ProgressCircle
              percent={getPercent(data)}
              ratio={getRatio(data)}
              options={{
                squareSize: 16,
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
    promotionOption: { loan: promotionOptionLoan },
    withLoanProgress = false,
  }) => {
    const loanId = loan?._id || promotionOptionLoan?._id;
    const { data: loanProgress = {}, loading } = useStaticMeteorData({
      query: withLoanProgress && loanProgressQuery,
      params: { loanId },
      type: 'single',
    });

    return {
      loanProgress: withLoanProgress && !loading && loanProgress,
    };
  },
)(PromotionReservationProgressComponent);
