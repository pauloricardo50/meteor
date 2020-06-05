import React, { useMemo } from 'react';
import { faHandshake } from '@fortawesome/pro-duotone-svg-icons/faHandshake';
import CircularProgress from '@material-ui/core/CircularProgress';
import Step from '@material-ui/core/Step';
import StepConnector from '@material-ui/core/StepConnector';
import StepLabel from '@material-ui/core/StepLabel';
import Stepper from '@material-ui/core/Stepper';
import { withStyles } from '@material-ui/core/styles';

import { getLoanProgress } from '../../../api/loans/helpers';
import {
  PROMOTION_OPTION_FULL_VERIFICATION_STATUS,
  PROMOTION_OPTION_SIMPLE_VERIFICATION_STATUS,
} from '../../../api/promotionOptions/promotionOptionConstants';
import colors from '../../../config/colors';
import Icon from '../../Icon';
import FaIcon from '../../Icon/FaIcon';
import T from '../../Translation';
import {
  getPercent,
  getPromotionReservationIcon,
  promotionOptionIconConfig,
} from './PromotionReservationProgressHelpers';

const isStatusCompleted = ({ id, promotionOption }) => {
  const { status } = promotionOption[id];

  return promotionOptionIconConfig[id].success === status;
};

const RegularIcon = ({ id, status }) => {
  const { icon, color } = getPromotionReservationIcon(id, status);
  return <Icon type={icon} color={color} />;
};

const circularProgressProps = {
  variant: 'static',
  size: 20,
  thickness: 6,
};

const ProgressIcon = ({ data }) => {
  const percent = getPercent(data);
  return (
    <>
      <CircularProgress
        style={{
          position: 'absolute',
          left: 2,
          top: 2,
          color: colors.borderGrey,
        }}
        value={100}
        {...circularProgressProps}
      />
      <CircularProgress
        style={{ margin: '0 2px' }}
        value={percent * 100}
        color={percent >= 1 ? 'secondary' : 'primary'}
        {...circularProgressProps}
      />
    </>
  );
};

const progressSteps = [
  {
    id: 'simpleVerification',
    isCompleted: isStatusCompleted,
    isActive: () => true,
    IconComponent: RegularIcon,
  },
  {
    id: 'info',
    isCompleted: ({ info }) => getPercent(info) >= 1,
    isActive: () => true,
    IconComponent: ({ info }) => <ProgressIcon data={info} />,
  },
  {
    id: 'documents',
    isCompleted: ({ documents }) => getPercent(documents) >= 1,
    isActive: () => true,
    IconComponent: ({ documents }) => <ProgressIcon data={documents} />,
  },
  {
    id: 'fullVerification',
    isCompleted: isStatusCompleted,
    isActive: ({ promotionOption }) =>
      promotionOption.simpleVerification.status ===
      PROMOTION_OPTION_SIMPLE_VERIFICATION_STATUS.VALIDATED,
    IconComponent: RegularIcon,
  },
  {
    id: 'bank',
    isCompleted: isStatusCompleted,
    isActive: ({ promotionOption }) =>
      promotionOption.fullVerification.status ===
      PROMOTION_OPTION_FULL_VERIFICATION_STATUS.VALIDATED,
    IconComponent: RegularIcon,
  },
];

const otherSteps = [
  {
    id: 'reservationAgreement',
    isCompleted: isStatusCompleted,
    IconComponent: RegularIcon,
  },
  {
    id: 'reservationDeposit',
    isCompleted: isStatusCompleted,
    IconComponent: RegularIcon,
  },
];

const StepIconComponent = ({ IconComponent, ...props }) => (
  <div
    style={{
      zIndex: 1,
      height: 24,
      width: 24,
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      backgroundColor: 'white',
    }}
  >
    <IconComponent {...props} />
    <div
      style={{
        position: 'absolute',
        bottom: '200%',
        left: -18,
        fontSize: '3rem',
      }}
    >
      <FaIcon
        icon={faHandshake}
        fixedWidth // Uses 1.25x the fontSize
        primaryColor={colors.primary}
        secondaryColor={colors.success}
      />
    </div>
  </div>
);

const Connector = withStyles({
  alternativeLabel: { top: 11 },
  active: { '& $line': { borderColor: colors.primary } },
  completed: { '& $line': { borderColor: colors.success } },
  line: {
    borderColor: '#eaeaf0',
    borderTopWidth: 2,
    borderRadius: 1,
  },
})(StepConnector);

const stepperProps = {
  alternativeLabel: true,
  nonLinear: true,
  connector: <Connector />,
};

const PromotionReservationProgress2 = ({
  promotionOption,
  loan,
  showLabel,
}) => {
  const { info, documents } = useMemo(() => getLoanProgress(loan), [loan]);

  return (
    <div className="promotion-reservation-progress-2">
      <Stepper {...stepperProps} className="mr-16">
        {progressSteps.map(step => {
          const { id, isCompleted, isActive } = step;
          return (
            <Step
              key={id}
              completed={isCompleted({
                promotionOption,
                id,
                loan,
                info,
                documents,
              })}
              active={isActive({ promotionOption })}
            >
              <StepLabel
                StepIconComponent={StepIconComponent}
                StepIconProps={{
                  ...step,
                  status: promotionOption[id]?.status,
                  info,
                  documents,
                }}
              >
                {showLabel && <T id={`Forms.${id}`} />}
              </StepLabel>
            </Step>
          );
        })}
      </Stepper>

      <Stepper {...stepperProps}>
        {otherSteps.map(step => {
          const { id, isCompleted } = step;

          return (
            <Step
              key={id}
              active
              completed={isCompleted({ promotionOption, id, loan })}
            >
              <StepLabel
                StepIconComponent={StepIconComponent}
                StepIconProps={{ ...step, status: promotionOption[id]?.status }}
              >
                {showLabel && <T id={`Forms.${id}`} />}
              </StepLabel>
            </Step>
          );
        })}
      </Stepper>
    </div>
  );
};
export default PromotionReservationProgress2;
