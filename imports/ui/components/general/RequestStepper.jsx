import React, { Component, PropTypes } from 'react';
import cleanMethod from '/imports/api/cleanMethods';

import { List, ListItem } from 'material-ui/List';
import RaisedButton from 'material-ui/RaisedButton';
import { Link } from 'react-router-dom';

import StepperVertical from './StepperVertical.jsx';
import StepperHorizontal from './StepperHorizontal.jsx';

import { getWidth } from '/imports/js/helpers/browserFunctions';
import getSteps from '/imports/js/arrays/steps';

const styles = {
  stepContent: {
    margin: '0 auto',
    marginTop: 16,
    width: '100%',
    maxWidth: 400,
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

    if (this.focused) {
      this.focused.applyFocusState('keyboard-focused');
    }
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
          <List id="list">
            {step.items.map(item => (
              <ListItem
                key={item.title}
                primaryText={item.title}
                ref={r => {
                  // Get the first list item that isn't done, set ref, and focus in componentDidMount
                  if (!this.focused && !item.isDone()) {
                    this.focused = r;
                  }
                }}
                rightIcon={
                  item.isDone()
                    ? <span
                        className="fa fa-check right-icon success animated bounceInDown"
                        style={{ fontSize: 16 }}
                      />
                    : <span className="right-icon pending" />
                }
                secondaryText={
                  (item.percent !== undefined &&
                    `Progrès: ${Math.round(item.percent() * 1000) / 10}%`) ||
                    ''
                }
                onTouchTap={() =>
                  item.link && this.props.history.push(item.link)}
                style={{ fontSize: 18 }}
              />
            ))}
          </List>}
      </div>
    );
  }

  renderStepActions(step, handleNextChild) {
    const currentStep = this.props.loanRequest.logic.step;
    const i = step.nb - 1;

    // For the last step, do not show a continue button
    if (i === 4) {
      return null;
    }

    // loop over each step item and make sure they are all done
    const stepIsDone = step.items.reduce(
      (tot, item) => tot && (item.isDone() && tot),
      true,
    );

    return (
      <div style={styles.stepActions} className="text-center">
        <RaisedButton
          label="Continuer"
          primary={currentStep === i}
          disabled={currentStep < i || !stepIsDone}
          keyboardFocused={stepIsDone && currentStep === i}
          onTouchTap={() => {
            if (typeof handleNextChild === 'function') {
              handleNextChild(i, () => this.handleNext(i));
            } else {
              this.handleNext(i);
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
        null,
        this.props.loanRequest._id,
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
      steps: getSteps(this.props.loanRequest, this.props.borrowers),
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
  borrowers: PropTypes.arrayOf(PropTypes.object).isRequired,
  history: PropTypes.objectOf(PropTypes.any).isRequired,
};
