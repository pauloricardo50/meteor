import React, { Component, PropTypes } from 'react';
import cleanMethod from '/imports/api/cleanMethods';

import { List, ListItem } from 'material-ui/List';
import RaisedButton from 'material-ui/RaisedButton';

import StepperVertical from './StepperVertical.jsx';
import StepperHorizontal from './StepperHorizontal.jsx';

import { getWidth } from '/imports/js/helpers/browserFunctions';
import steps from '/imports/js/arrays/steps';
import stepValidation from '/imports/js/helpers/stepValidation';

const styles = {
  stepContent: {
    marginTop: 16,
  },
  stepActions: {
    margin: '16px 0',
  },
};

export default class RequestStepper extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeStep: this.props.loanRequest.logic.step,
      largeWidth: getWidth() >= 992,
    };

    this.handleNext = this.handleNext.bind(this);
    this.setStep = this.setStep.bind(this);
    this.renderStep = this.renderStep.bind(this);
    this.renderStepActions = this.renderStepActions.bind(this);
    this.resize = this.resize.bind(this);
  }

  componentDidMount() {
    window.addEventListener('resize', this.resize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
  }

  resize() {
    this.setState({ largeWidth: getWidth() >= 992 });
  }

  shouldComponentUpdate(nProps, nState) {
    return true;
  }

  setStep(i) {
    this.setState({ activeStep: i });
  }

  renderStep(step) {
    if (!step) {
      return null;
    }

    return (
      <div style={styles.stepContent}>
        {step.description && <p>{step.description}</p>}
        {step.items &&
          step.items.length > 0 &&
          <List>
            {step.items.map(item => (
              <ListItem
                key={item.title}
                primaryText={item.title}
                rightIcon={
                  item.isDone
                    ? <span className="fa fa-check right-icon success" />
                    : <span className="right-icon pending" />
                }
                secondaryText={
                  (item.percent && `${item.percent * 100}%`) || '0%'
                }
                href={item.href}
              />
            ))}
          </List>}
      </div>
    );
  }

  renderStepActions(step, handleNextChild) {
    const currentStep = this.props.loanRequest.logic.step;

    // For the last step, do not show a continue button
    if (step.nb === steps.length) {
      return null;
    }

    return (
      <div style={styles.stepActions} className="text-center">
        <RaisedButton
          label="Continuer"
          primary={currentStep === step}
          disabled={currentStep < step || !stepValidation(step)}
          onTouchTap={() => {
            if (typeof handleNextChild === 'function') {
              handleNextChild(step, () => this.handleNext(step));
            } else {
              this.handleNext(step);
            }
          }}
        />
      </div>
    );
  }

  handleNext(step) {
    const currentStep = this.props.loanRequest.logic.step;

    // Only increase DB step if it is possible
    if (currentStep === step && currentStep < 3) {
      cleanMethod(
        'incrementStep',
        this.props.loanRequest._id,
        null,
        error => !error && this.setState({ activeStep: step + 1 }),
        true,
      );
    } else {
      // Else simply jump to the required step
      this.setState({ activeStep: step + 1 });
    }
  }

  render() {
    const props = {
      steps,
      setStep: this.setStep,
      currentStep: this.props.loanRequest.logic.step,
      activeStep: this.state.activeStep,
      renderStep: this.renderStep,
      renderStepActions: this.renderStepActions,
      handleNext: this.handleNext,
    };

    if (this.state.largeWidth) {
      return <StepperHorizontal {...props} />;
    }

    return <StepperVertical {...props} />;
  }
}

RequestStepper.propTypes = {
  loanRequest: PropTypes.objectOf(PropTypes.any).isRequired,
};
