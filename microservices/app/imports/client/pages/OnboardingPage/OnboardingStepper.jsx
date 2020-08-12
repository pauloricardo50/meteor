import React from 'react';
import MobileStepper from '@material-ui/core/MobileStepper';
import Step from '@material-ui/core/Step';
import StepButton from '@material-ui/core/StepButton';
import StepContent from '@material-ui/core/StepContent';
import StepLabel from '@material-ui/core/StepLabel';
import Stepper from '@material-ui/core/Stepper';
import { makeStyles } from '@material-ui/core/styles';

import T from 'core/components/Translation';

import { useOnboarding } from './OnboardingContext';

const useStyles = makeStyles({ root: { backgroundColor: 'unset' } });

const OnboardingStepper = () => {
  const classes = useStyles();
  const { isMobile, activeStep, stepIds, setActiveStep } = useOnboarding();
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
        />
      </div>
    );
  }

  return (
    <Stepper
      orientation="vertical"
      activeStep={activeStepIndex}
      classes={classes}
    >
      {stepIds.map(step => (
        <Step key={step}>
          <StepButton onClick={() => setActiveStep(step)}>
            <StepLabel>
              <T id={`OnboardingStepper.${step}`} />
            </StepLabel>
          </StepButton>

          {/* https://github.com/mui-org/material-ui/issues/22167 */}
          <StepContent>
            <div className="secondary">Hello world</div>
          </StepContent>
        </Step>
      ))}
    </Stepper>
  );
};

export default OnboardingStepper;
