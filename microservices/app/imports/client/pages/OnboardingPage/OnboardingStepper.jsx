import React, { useEffect } from 'react';
import Step from '@material-ui/core/Step';
import StepButton from '@material-ui/core/StepButton';
import StepConnector from '@material-ui/core/StepConnector';
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
  labelContainer: { textAlign: 'left' },
  stepRoot: { maxWidth: 200 },
  connectorLineVertical: { minHeight: 8 },
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
    activeStep,
    steps,
    stepIds,
    setActiveStep,
    currentTodoStep,
    loan,
  } = useOnboarding();
  const activeStepIndex = stepIds.findIndex(id => id === activeStep);

  return (
    <Stepper
      orientation="vertical"
      activeStep={activeStepIndex}
      classes={{ root: classes.root }}
      nonLinear
      connector={
        <StepConnector
          classes={{ lineVertical: classes.connectorLineVertical }}
        />
      }
    >
      {steps.map(({ id, done, renderValue }, index) => {
        const isCompleted = isStepDone(done, steps, index);
        const isActive = isCompleted || activeStep === id;

        return (
          <Step
            key={id}
            completed={isCompleted}
            active={isActive}
            disabled={isStepDisabled(done, currentTodoStep, id)}
            classes={{ root: classes.stepRoot }}
          >
            <StepButton onClick={() => setActiveStep(id)}>
              <StepLabel
                StepIconProps={{ classes: { completed: classes.completed } }}
                classes={{ labelContainer: classes.labelContainer }}
              >
                <T id={`OnboardingStepper.${id}`} />
              </StepLabel>
            </StepButton>

            {/* https://github.com/mui-org/material-ui/issues/22167 */}
            <StepContent>
              {isCompleted ? (
                <small className="secondary">{renderValue(loan)}</small>
              ) : null}
            </StepContent>
          </Step>
        );
      })}
    </Stepper>
  );
};

export default OnboardingStepper;
