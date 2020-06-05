import React, { useMemo } from 'react';
import Step from '@material-ui/core/Step';
import StepConnector from '@material-ui/core/StepConnector';
import StepLabel from '@material-ui/core/StepLabel';
import Stepper from '@material-ui/core/Stepper';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import cx from 'classnames';

import { getLoanProgress } from '../../../api/loans/helpers';
import colors from '../../../config/colors';
import FaIcon from '../../Icon/FaIcon';
import Tooltip from '../../Material/Tooltip';
import T from '../../Translation';
import { PROMOTION_OPTION_ICONS } from './promotionReservationProgressHelpers';

const StepIconComponent = ({
  color,
  description,
  detailIcon,
  IconComponent,
  id,
  primaryColor,
  secondaryColor,
  showDetailIcon,
  showTooltip,
}) => {
  const component = (
    <div
      style={{
        alignItems: 'center',
        display: 'flex',
        fontSize: 20,
        height: 20,
        justifyContent: 'center',
        position: 'relative',
        width: 20,
        zIndex: 1,
      }}
    >
      <IconComponent />
      {showDetailIcon && (
        <div
          style={{
            bottom: '150%',
            fontSize: '2rem',
            left: -8,
            position: 'absolute',
          }}
        >
          <FaIcon
            icon={detailIcon}
            fixedWidth // Uses 1.25x the fontSize
            color={color}
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}
          />
        </div>
      )}
    </div>
  );

  if (showTooltip) {
    return (
      <Tooltip title={<StepLabelContent id={id} description={description} />}>
        {component}
      </Tooltip>
    );
  }

  return component;
};

const Connector = withStyles({
  alternativeLabel: { top: 9 },
  active: { '& $line': { borderColor: colors.primary } },
  completed: { '& $line': { borderColor: colors.success } },
  line: {
    borderColor: colors.borderGrey,
    borderTopWidth: 2,
    borderRadius: 2,
  },
})(StepConnector);

const getStepperProps = (showDetailIcon, { style } = {}) => ({
  alternativeLabel: true,
  nonLinear: true,
  connector: <Connector />,
  style: {
    marginTop: showDetailIcon ? 24 : undefined,
    backgroundColor: 'inherit',
    ...style,
  },
});

const StepLabelContent = ({ id, description }) => (
  <div>
    <div>
      <T id={`Forms.${id}`} />
    </div>
    <div className="secondary">{description}</div>
  </div>
);

const useStyles = makeStyles(() => ({
  labelContainer: {
    display: ({ showLabel }) => (showLabel ? '' : 'none'),
  },
}));

const PromotionReservationProgress = ({
  promotionOption,
  loan,
  showLabel,
  showDetailIcon,
  className,
  StepperProps,
  showLoanProgress,
}) => {
  const classes = useStyles({ showLabel });
  const { info, documents } = useMemo(() => getLoanProgress(loan), [loan]);
  const payload = { ...promotionOption, info, documents };
  const stepperProps = getStepperProps(showDetailIcon, StepperProps);

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
        {progressSteps.map(id => {
          const {
            isCompleted,
            isActive,
            description,
            ...rest
          } = PROMOTION_OPTION_ICONS[id](payload);
          return (
            <Step key={id} completed={isCompleted} active={isActive}>
              <StepLabel
                StepIconComponent={StepIconComponent}
                StepIconProps={{
                  ...rest,
                  id,
                  showDetailIcon,
                  showTooltip: !showLabel,
                  description,
                }}
                classes={classes}
              >
                {showLabel && (
                  <StepLabelContent id={id} description={description} />
                )}
              </StepLabel>
            </Step>
          );
        })}
      </Stepper>

      <Stepper
        {...stepperProps}
        style={{ ...stepperProps.style, minWidth: 2 * 50 }}
      >
        {['reservationAgreement', 'reservationDeposit'].map(id => {
          const {
            isCompleted,
            isActive,
            description,
            ...rest
          } = PROMOTION_OPTION_ICONS[id](payload);
          return (
            <Step key={id} active completed={isCompleted}>
              <StepLabel
                StepIconComponent={StepIconComponent}
                StepIconProps={{
                  ...rest,
                  id,
                  showDetailIcon,
                  showTooltip: !showLabel,
                  description,
                }}
                classes={classes}
              >
                {showLabel && (
                  <StepLabelContent id={id} description={description} />
                )}
              </StepLabel>
            </Step>
          );
        })}
      </Stepper>
    </div>
  );
};

export default PromotionReservationProgress;
