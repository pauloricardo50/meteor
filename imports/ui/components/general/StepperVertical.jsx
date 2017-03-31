import React, { PropTypes } from 'react';

import { Step, Stepper, StepButton, StepContent } from 'material-ui/Stepper';

const StepperVertical = props => (
  <div className="vertical">
    <Stepper
      activeStep={props.activeStep}
      orientation={'vertical'}
      linear={false}
    >
      {props.steps.map((step, i) => (
        <Step
          key={step.nb}
          disabled={props.currentStep < i}
          completed={props.currentStep > i}
        >
          <StepButton onTouchTap={() => props.setStep(i)}>
            <span
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                height: step.subtitle && '36px',
                lineHeight: step.subtitle && '18px',
              }}
            >
              {step.title}
              {step.subtitle && <br />}
              {step.subtitle &&
                <span className="secondary">{step.subtitle}</span>}
            </span>
          </StepButton>
          <StepContent>
            {props.renderStep(step)}
            {props.renderStepActions(i)}
          </StepContent>
        </Step>
      ))}
    </Stepper>
  </div>
);

StepperVertical.propTypes = {
  currentStep: PropTypes.number.isRequired,
  activeStep: PropTypes.number.isRequired,
  setStep: PropTypes.func.isRequired,
  steps: PropTypes.arrayOf(PropTypes.any).isRequired,
  renderStep: PropTypes.func.isRequired,
  renderStepActions: PropTypes.func.isRequired,
};

export default StepperVertical;
