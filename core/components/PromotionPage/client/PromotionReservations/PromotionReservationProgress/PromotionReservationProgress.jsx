// @flow
import React from 'react';
import cx from 'classnames';
import { withProps } from 'recompose';

import { getLoanProgress } from 'core/api/loans/helpers';
import {
  PROMOTION_OPTION_SIMPLE_VERIFICATION_STATUS,
  PROMOTION_OPTION_FULL_VERIFICATION_STATUS,
  PROMOTION_OPTION_AGREEMENT_STATUS,
  PROMOTION_OPTION_DEPOSIT_STATUS,
  PROMOTION_OPTION_BANK_STATUS,
} from '../../../../../api/promotionOptions/promotionOptionConstants';
import ProgressCircle from '../../../../ProgressCircle';
import {
  makeIcon,
  makeGetIcon,
  getAdminNoteIcon,
  getPercent,
  getRatio,
} from './PromotionReservationProgressHelpers';

type PromotionReservationProgressProps = {};

const getAnimationDelay = (index, offset = 0) => (index + offset) * 50;

const getAnimation = (variant, index, offset) =>
  `animated ${
    variant === 'icon' ? 'fadeInLeft' : 'fadeInDown'
  } delay-${getAnimationDelay(index, offset)}`;

const PromotionReservationProgressComponent = ({
  promotionOption,
  style,
  variant = 'icon',
  isEditing,
  className,
  loanProgress = {},
}: PromotionReservationProgressProps) => {
  const {
    _id: promotionOptionId,
    simpleVerification,
    fullVerification,
    reservationAgreement,
    deposit,
    bank,
    loan,
    isAnonymized,
    proNote = '',
  } = promotionOption;
  const { user, _id: loanId } = loan;
  const { info = {}, documents = {} } = loanProgress;

  const icon = makeIcon(variant, isEditing, promotionOptionId, loanId);

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
        placeholder: `${data.valid}/${data.required} (${Math.round(
          getPercent(info) * 100,
        )}%)`,
        id,
      }),
    ),
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
        waiting: [PROMOTION_OPTION_AGREEMENT_STATUS.WAITING],
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
          <div
            className={cx('icon', getAnimation(variant, index))}
            key={`verification${index}`}
          >
            {icon}
          </div>
        ))}
      </div>
      <div className="promotion-reservation-progress-icons">
        {agreementAndDepositIcons.map((icon, index) => (
          <div
            className={cx(
              'icon',
              getAnimation(variant, index, verificationAndBankIcons.length),
            )}
            key={`agreement${index}`}
          >
            {icon}
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
            {getAdminNoteIcon(proNote, variant, isEditing, promotionOptionId)}
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
  }) => ({
    loanProgress: loanProgress || getLoanProgress(loan),
  }),
)(PromotionReservationProgressComponent);
