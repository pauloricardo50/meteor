import React from 'react';
import MobileStepper from '@material-ui/core/MobileStepper';
import { makeStyles } from '@material-ui/core/styles';

import { useOnboarding } from './OnboardingContext';

const useStyles = makeStyles({
  root: { backgroundColor: 'unset' },
});

const OnboardingMobileStepper = () => {
  const classes = useStyles();
  const { isMobile, activeStep, stepIds, setShowDrawer } = useOnboarding();
  const activeStepIndex = stepIds.findIndex(id => id === activeStep);

  if (isMobile) {
    return (
      <div style={{ margin: '0 auto', minWidth: 250 }}>
        <MobileStepper
          classes={classes}
          variant="dots"
          steps={stepIds.length}
          position="static"
          activeStep={activeStepIndex}
          nextButton={<div />}
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
