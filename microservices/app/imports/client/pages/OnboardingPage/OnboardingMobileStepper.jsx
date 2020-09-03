import React from 'react';
import MobileStepper from '@material-ui/core/MobileStepper';
import { makeStyles } from '@material-ui/core/styles';

import Button from 'core/components/Button';
import Icon from 'core/components/Icon';
import T from 'core/components/Translation';

import { useOnboarding } from './OnboardingContext';

const useStyles = makeStyles({
  root: { backgroundColor: 'unset' },
});

const OnboardingMobileStepper = () => {
  const classes = useStyles();
  const {
    isMobile,
    activeStep,
    stepIds,
    setShowDrawer,
    currentTodoStep,
    resetPosition,
    isWaitingForStepDone,
  } = useOnboarding();
  const activeStepIndex = stepIds.findIndex(id => id === activeStep);
  const isOnLatestStep = activeStep === currentTodoStep;
  const showResetButton = !isOnLatestStep && !isWaitingForStepDone;

  if (isMobile) {
    return (
      <div style={{ margin: '0 auto', minWidth: 250 }}>
        <MobileStepper
          classes={classes}
          variant="dots"
          steps={stepIds.length}
          position="static"
          activeStep={activeStepIndex}
          nextButton={
            showResetButton ? (
              <Button
                primary
                raised
                onClick={event => {
                  // Avoid setShowDrawer triggering
                  event.stopPropagation();
                  resetPosition();
                }}
                icon={<Icon type="right" />}
                iconAfter
                className="animated fadeIn"
              >
                <T id="OnboardingMobileStepper.resetPosition" />
              </Button>
            ) : (
              <div />
            )
          }
          backButton={<div />}
          onClick={() => {
            setShowDrawer(true);
          }}
        />
      </div>
    );
  }

  return null;
};

export default OnboardingMobileStepper;
