import React from 'react';
import Step from '@material-ui/core/Step';
import StepButton from '@material-ui/core/StepButton';
import StepLabel from '@material-ui/core/StepLabel';
import { makeStyles } from '@material-ui/core/styles';

import colors from '../../../config/colors';
import FaIcon from '../../Icon/FaIcon';
import Tooltip from '../../Material/Tooltip';
import T, { IntlDate } from '../../Translation';

const StepIconComponent = ({
  color,
  date,
  description,
  detailIcon,
  IconComponent,
  id,
  primaryColor,
  secondaryColor,
  showDetailIcon,
  showTooltip,
  subDescription,
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
      <Tooltip
        title={
          <StepLabelContent
            id={id}
            description={description}
            subDescription={subDescription}
            date={date}
          />
        }
      >
        {component}
      </Tooltip>
    );
  }

  return component;
};

const StepLabelContent = ({
  id,
  description,
  subDescription,
  date,
  vertical,
}) => (
  // TODO: Remove this styling:
  <div style={vertical ? { textAlign: 'left' } : {}}>
    <div className="secondary">
      <T id={`Forms.${id}`} />
    </div>
    <div>
      {description}
      {date && (
        <>
          &nbsp;–&nbsp;
          <small>
            <IntlDate value={date} type="relative" style="long" />
          </small>
        </>
      )}
      {subDescription && (
        <>
          <br />
          <span className="secondary" style={{ fontWeight: 'normal' }}>
            {subDescription}
          </span>
        </>
      )}
    </div>
  </div>
);

const useStyles = makeStyles(() => ({
  labelContainer: {
    display: ({ showLabels }) => (showLabels ? '' : 'none'),
  },
  stepButtonRoot: {
    transition: 'background-color 0.2s ease',
    '&:hover': {
      backgroundColor: colors.borderGrey,
    },
  },
}));

const PromotionReservationProgressStep = ({
  id,
  stepConfig,
  showLabels,
  showDetailIcon,
  onClick,
  vertical,
  ...props
}) => {
  const { labelContainer, stepButtonRoot } = useStyles({ showLabels });
  const { isCompleted, isActive } = stepConfig;

  const label = (
    <StepLabel
      StepIconComponent={StepIconComponent}
      StepIconProps={{
        id,
        showDetailIcon,
        showTooltip: !showLabels,
        ...stepConfig,
      }}
      classes={{ labelContainer }}
      data-testid="step"
    >
      {showLabels && (
        <StepLabelContent id={id} {...stepConfig} vertical={vertical} />
      )}
    </StepLabel>
  );

  return (
    <Step
      key={id}
      {...props} // https://github.com/mui-org/material-ui/issues/21326
      completed={isCompleted}
      active={isActive}
    >
      {onClick ? (
        <StepButton
          classes={{ root: stepButtonRoot }}
          onClick={() => onClick(id)}
        >
          {label}
        </StepButton>
      ) : (
        label
      )}
    </Step>
  );
};

export default PromotionReservationProgressStep;
