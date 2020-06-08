import { Meteor } from 'meteor/meteor';

import React, { useMemo } from 'react';
import { faCommentLines } from '@fortawesome/pro-duotone-svg-icons/faCommentLines';
import StepConnector from '@material-ui/core/StepConnector';
import Stepper from '@material-ui/core/Stepper';
import { withStyles } from '@material-ui/core/styles';
import cx from 'classnames';

import { getLoanProgress } from '../../../api/loans/helpers';
import colors from '../../../config/colors';
import FaIcon from '../../Icon/FaIcon';
import { PROMOTION_OPTION_ICONS } from './promotionReservationProgressHelpers';
import PromotionReservationProgressStep from './PromotionReservationProgressStep';

const Connector = withStyles({
  alternativeLabel: { top: 9 },
  active: { '& $line': { borderColor: colors.primary } },
  completed: { '& $line': { borderColor: colors.success } },
  line: {
    borderColor: colors.borderGrey,
    borderTopWidth: 2,
  },
  vertical: {
    marginLeft: 9,
    padding: 0,
  },
  lineVertical: {
    borderLeftWidth: 2,
    borderColor: colors.borderGrey,
  },
})(StepConnector);

const getStepperProps = (
  showDetailIcon,
  vertical,
  { style, ...props } = {},
) => ({
  alternativeLabel: !vertical,
  nonLinear: true,
  connector: <Connector />,
  style: {
    marginTop: showDetailIcon ? 24 : undefined,
    backgroundColor: 'inherit',
    ...style,
  },
  orientation: vertical ? 'vertical' : undefined,
  ...props,
});

const isApp = Meteor.microservice === 'app';

const PromotionReservationProgress = ({
  promotionOption,
  loan = promotionOption.loan,
  showLabel,
  showDetailIcon,
  className,
  StepperProps,
  showLoanProgress,
  vertical,
  onClick,
}) => {
  const { proNote } = loan;
  const { info, documents } = useMemo(
    () => loan.loanProgress || getLoanProgress(loan),
    [loan],
  );
  const payload = { ...promotionOption, info, documents };
  const stepperProps = getStepperProps(showDetailIcon, vertical, StepperProps);

  const progressSteps = [
    'simpleVerification',
    showLoanProgress && 'info',
    showLoanProgress && 'documents',
    'fullVerification',
    'bank',
  ].filter(x => x);

  return (
    <div className={cx('promotion-reservation-progress-2', className)}>
      <Stepper
        {...stepperProps}
        style={{ ...stepperProps.style, minWidth: progressSteps.length * 50 }}
      >
        {progressSteps.map(id => (
          <PromotionReservationProgressStep
            key={id}
            id={id}
            stepConfig={PROMOTION_OPTION_ICONS[id](payload)}
            showLabel={showLabel}
            showDetailIcon={showDetailIcon}
            onClick={!['info', 'documents'].includes(id) && onClick}
            vertical={vertical}
          />
        ))}
      </Stepper>

      <Stepper
        {...stepperProps}
        style={{ ...stepperProps.style, minWidth: 2 * 50 }}
      >
        {['reservationAgreement', 'reservationDeposit'].map(id => (
          <PromotionReservationProgressStep
            key={id}
            id={id}
            stepConfig={PROMOTION_OPTION_ICONS[id](payload)}
            showLabel={showLabel}
            showDetailIcon={showDetailIcon}
            onClick={onClick}
            vertical={vertical}
          />
        ))}
      </Stepper>

      {!isApp && (
        <Stepper {...stepperProps}>
          <PromotionReservationProgressStep
            id="proNote"
            stepConfig={{
              description: proNote?.note || 'Pas de commentaire',
              date: proNote?.date,
              IconComponent: () => (
                <FaIcon
                  icon={faCommentLines}
                  color={proNote?.note ? colors.primary : colors.borderGrey}
                />
              ),
            }}
            showLabel={showLabel}
            vertical={vertical}
          />
        </Stepper>
      )}
    </div>
  );
};

export default PromotionReservationProgress;
