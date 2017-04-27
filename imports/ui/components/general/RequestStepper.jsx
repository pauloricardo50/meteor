import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import cleanMethod from '/imports/api/cleanMethods';
import Scroll from 'react-scroll';

import { List, ListItem } from 'material-ui/List';
import RaisedButton from 'material-ui/RaisedButton';
import { Link } from 'react-router-dom';

import myTheme from '/imports/js/config/mui_custom';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import colors from '/imports/js/config/colors';

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

const getSecondaryText = item => {
  let text = null;
  if (item.subtitle) {
    text = (
      <span>
        <span className="secondary fa fa-clock-o" />
        {' '}
        {item.subtitle}
        {(item.percent !== undefined && ` - Progrès: ${Math.round(item.percent() * 1000) / 10}%`) ||
          ''}
      </span>
    );
  }

  return text;
};

export default class RequestStepper extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeStep: this.props.loanRequest.logic.step,
      largeWidth: getWidth() >= 992,
    };
  }

  componentDidMount() {
    window.addEventListener('resize', this.resize);

    // if (this.focused) {
    //   this.focused.applyFocusState('keyboard-focused');
    // }

    Meteor.call('getServerTime', (e, res) => {
      this.setState({ serverTime: res });
    });
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
  }

  setStep = i => {
    this.setState({ activeStep: i });
  };

  handleNext = step => {
    const currentStep = this.props.loanRequest.logic.step;

    // Only increase DB step if it is possible
    if (currentStep === step && currentStep < 3) {
      cleanMethod(
        'incrementStep',
        null,
        this.props.loanRequest._id,
        error => {
          if (!error) {
            this.setState({ activeStep: step + 1 });
          }
        },
        true,
      );
    } else {
      // Else simply jump to the required step
      this.setState({ activeStep: step + 1 });
    }
  };

  resize = () => {
    this.setState({ largeWidth: getWidth() >= 992 });
  };

  renderStep = step => {
    if (!step) {
      return null;
    }

    // After a step is rendered, hover any item that isn't done
    // Meteor.defer creates an async function that does this after the render
    this.focused = null;
    Meteor.defer(() => {
      // Check if the current active element isn't an input, else,
      // it's probably the initial modal that asks for a project name
      if (this.focused && document.activeElement.nodeName !== 'INPUT') {
        this.focused.applyFocusState('keyboard-focused');
      }
    });

    return (
      <div style={styles.stepContent}>
        {step.description && <p>{step.description}</p>}
        {step.items &&
          step.items.length > 0 &&
          <List id="list">
            {step.items.map(item => (
              <ListItem
                hoverColor="#f8f8f8"
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
                secondaryText={getSecondaryText(item)}
                onTouchTap={() => item.link && this.props.history.push(item.link)}
                style={{
                  fontSize: 18,
                  cursor: item.disabled ? 'not-allowed' : item.link && 'pointer',
                }}
                disabled={item.disabled}
              />
            ))}
          </List>}
      </div>
    );
  };

  renderStepActions = (step, handleNextChild) => {
    const currentStep = this.props.loanRequest.logic.step;
    const i = step.nb - 1;

    // For the last step, do not show a continue button
    if (i === 4) {
      return null;
    }

    // loop over each step item and make sure they are all done
    const stepIsDone = step.items
      ? step.items.reduce((tot, item) => tot && (item.isDone() && tot), true)
      : true;

    if (stepIsDone || currentStep > i) {
      return (
        <div style={styles.stepActions} className="text-center">
          <RaisedButton
            label="Continuer"
            primary={currentStep === i}
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

    return null;
  };

  render() {
    const props = {
      steps: getSteps({ ...this.props, serverTime: this.state.serverTime }),
      setStep: this.setStep,
      currentStep: this.props.loanRequest.logic.step,
      activeStep: this.state.activeStep,
      renderStep: this.renderStep,
      renderStepActions: this.renderStepActions,
      handleNext: this.handleNext,
    };

    const customTheme = {
      ...myTheme,
      ripple: {
        color: colors.primary,
      },
    };

    return (
      <MuiThemeProvider muiTheme={getMuiTheme(customTheme)}>
        {this.state.largeWidth ? <StepperHorizontal {...props} /> : <StepperVertical {...props} />}
      </MuiThemeProvider>
    );
  }
}

RequestStepper.propTypes = {
  loanRequest: PropTypes.objectOf(PropTypes.any).isRequired,
  borrowers: PropTypes.arrayOf(PropTypes.object).isRequired,
  history: PropTypes.objectOf(PropTypes.any).isRequired,
};
