import React from 'react';
import MobileStepper from '@material-ui/core/MobileStepper';
import Step from '@material-ui/core/Step';
import StepButton from '@material-ui/core/StepButton';
import StepContent from '@material-ui/core/StepContent';
import StepLabel from '@material-ui/core/StepLabel';
import Stepper from '@material-ui/core/Stepper';
import { makeStyles } from '@material-ui/core/styles';

import T from 'core/components/Translation';
import colors from 'core/config/colors';

import { useOnboarding } from './OnboardingContext';

const useStyles = makeStyles({
  root: { backgroundColor: 'unset' },
  completed: { color: `${colors.success} !important` },
});

const isStepDone = (done, steps, index) => {
  if (!steps[index - 1]) {
    return done;
  }

  // This guarantees that the stepper always appears linear, even if some steps
  // are completed in the wrong order
  return done && steps[index - 1].done;
};

const isStepDisabled = (done, currentTodoStep, stepId) =>
  !done && !(currentTodoStep === stepId);

const OnboardingStepper = () => {
  const classes = useStyles();
  const {
    isMobile,
    activeStep,
    steps,
    stepIds,
    setActiveStep,
    currentTodoStep,
  } = useOnboarding();
  const activeStepIndex = stepIds.findIndex(id => id === activeStep);

  if (isMobile) {
    return (
      <div style={{ margin: '0 auto', minWidth: 250 }}>
        <MobileStepper
          classes={{ root: classes.root }}
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
      classes={{ root: classes.root }}
      nonLinear
    >
      {steps.map(({ id, done }, index) => (
        <Step
          key={id}
          completed={isStepDone(done, steps, index)}
          disabled={isStepDisabled(done, currentTodoStep, id)}
        >
          <StepButton onClick={() => setActiveStep(id)}>
            <StepLabel
              StepIconProps={{ classes: { completed: classes.completed } }}
            >
              <T id={`OnboardingStepper.${id}`} />
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
