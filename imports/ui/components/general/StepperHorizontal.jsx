import React, { Component, PropTypes } from 'react';


import { Step, Stepper, StepButton } from 'material-ui/Stepper';
import ExpandTransition from 'material-ui/internal/ExpandTransition';


export default class StepperHorizontal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
    };

    this.handleNext = this.handleNext.bind(this);
  }


  setStep(i) {
    if (i !== this.props.activeStep) {
      if (!this.state.loading) {
        this.dummyAsync(() => {
          this.setState({ loading: false }, () =>
            this.props.setStep(i),
          );
        });
      }
    }
  }


  handleNext(step, callback) {
    if (!this.state.loading) {
      this.dummyAsync(() => {
        this.setState({ loading: false }, () =>
          callback(),
        );
      });
    }
  }


  dummyAsync(callback) {
    this.setState({ loading: true }, () => {
      this.asyncTimer = setTimeout(callback, 350);
    });
  }


  render() {
    return (
      <div className="horizontal">
        <Stepper
          activeStep={this.props.activeStep}
          orientation="horizontal"
          linear={false}
        >
          {this.props.steps.map((step, i) =>
            <Step
              key={step.nb}
              disabled={this.props.currentStep < i}
              completed={this.props.currentStep > i}
            >
              <StepButton onTouchTap={() => this.setStep(i)}>
                {step.title}
              </StepButton>
            </Step>,
          )}
        </Stepper>
        <ExpandTransition loading={this.state.loading} open>
          <div style={{ margin: '0 16px', overflow: 'hidden' }}>
            {this.props.renderStep(this.props.steps[this.props.activeStep])}
            {this.props.renderStepActions(this.props.activeStep, this.handleNext)}
          </div>
        </ExpandTransition>
      </div>
    );
  }
}

StepperHorizontal.propTypes = {
  currentStep: PropTypes.number.isRequired,
  activeStep: PropTypes.number.isRequired,
  setStep: PropTypes.func.isRequired,
  steps: PropTypes.arrayOf(PropTypes.any).isRequired,
  renderStep: PropTypes.func.isRequired,
  renderStepActions: PropTypes.func.isRequired,
};
