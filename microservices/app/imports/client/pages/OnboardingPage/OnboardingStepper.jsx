import React from 'react';
import MobileStepper from '@material-ui/core/MobileStepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Stepper from '@material-ui/core/Stepper';

import { useOnboarding } from './OnboardingContext';

const OnboardingStepper = () => {
  const { isMobile, activeStep, stepIds } = useOnboarding();
  const activeStepIndex = stepIds.findIndex(id => id === activeStep);

  if (isMobile) {
    return (
      <MobileStepper
        variant="dots"
        steps={stepIds.length}
        position="static"
        activeStep={activeStepIndex}
      />
    );
  }

  return (
    <Stepper orientation="vertical" activeStep={activeStepIndex}>
      {stepIds.map(step => (
        <Step key={step.id}>
          <StepLabel>Hello dude</StepLabel>
        </Step>
      ))}
    </Stepper>
  );
};

export default OnboardingStepper;
