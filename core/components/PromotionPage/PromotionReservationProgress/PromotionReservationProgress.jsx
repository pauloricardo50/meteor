import React, { useMemo } from 'react';
import cx from 'classnames';
import { withProps } from 'recompose';

import { getLoanProgress } from '../../../api/loans/helpers';
import {
  PROMOTION_OPTION_SIMPLE_VERIFICATION_STATUS,
  PROMOTION_OPTION_FULL_VERIFICATION_STATUS,
  PROMOTION_OPTION_AGREEMENT_STATUS,
  PROMOTION_OPTION_DEPOSIT_STATUS,
  PROMOTION_OPTION_BANK_STATUS,
} from '../../../api/promotionOptions/promotionOptionConstants';
import ProgressCircle from '../../ProgressCircle';
import {
  makeGetProgressItem,
  makeGetIcon,
  getAdminNoteIcon,
  getPercent,
  getRatio,
} from './PromotionReservationProgressHelpers';

const getAnimationDelay = (index, offset = 0) => (index + offset) * 50;

const getAnimation = (variant, index, offset) =>
  `animated ${
    variant === 'icon' ? 'fadeInLeft' : 'fadeInDown'
  } delay-${getAnimationDelay(index, offset)}`;

const PromotionReservationProgressComponent = ({
  promotionOption,
  style,
  variant = 'icon',
  className,
  loanProgress = {},
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
  const { user, _id: loanId, proNote = {} } = loan;
  const { info = {}, documents = {} } = loanProgress;

  const getProgressItem = useMemo(
    () => makeGetProgressItem(variant, promotionOptionId, loanId),
    [],
  );

  const verificationAndBankIcons = [
    getProgressItem({
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
      getProgressItem({
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
        placeholder: `${data.valid}/${data.required} (${Math.round(
          getPercent(info) * 100,
        )}%)`,
        id,
      }),
    ),
    getProgressItem({
      ...fullVerification,
      ...makeGetIcon({
        error: [PROMOTION_OPTION_FULL_VERIFICATION_STATUS.REJECTED],
        success: [PROMOTION_OPTION_FULL_VERIFICATION_STATUS.VALIDATED],
      })(fullVerification.status),
      id: 'fullVerification',
    }),
    getProgressItem({
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
    getProgressItem({
      ...reservationAgreement,
      ...makeGetIcon({
        success: [PROMOTION_OPTION_AGREEMENT_STATUS.RECEIVED],
        waiting: [PROMOTION_OPTION_AGREEMENT_STATUS.WAITING],
      })(reservationAgreement.status),
      id: 'reservationAgreement',
    }),
    getProgressItem({
      ...reservationDeposit,
      ...makeGetIcon({
        success: [PROMOTION_OPTION_DEPOSIT_STATUS.PAID],
        error: [PROMOTION_OPTION_DEPOSIT_STATUS.UNPAID],
      })(reservationDeposit.status),
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
          <div className={cx('icon', getAnimation(variant, index))} key={id}>
            {progressItem}
          </div>
        ))}
      </div>
      <div className="promotion-reservation-progress-icons">
        {agreementAndDepositIcons.map(({ id, progressItem }, index) => (
          <div
            className={cx(
              'icon',
              getAnimation(variant, index, verificationAndBankIcons.length),
            )}
            key={id}
          >
            {progressItem}
          </div>
        ))}
      </div>
      <div className="promotion-reservation-progress-icons">
        {!isAnonymized && (
          <div
            className={cx(
              'icon',
              getAnimation(
                variant,
                0,
                verificationAndBankIcons.length +
                  agreementAndDepositIcons.length,
              ),
            )}
          >
            {getAdminNoteIcon({
              proNote,
              variant,
              promotionOptionId,
              isAnonymized,
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
