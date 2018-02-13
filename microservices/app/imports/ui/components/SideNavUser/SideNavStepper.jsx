import React from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';

import getSteps from 'core/arrays/steps';
import { T } from 'core/components/Translation';
import Step from './Step';
import StepperContainer from '../../containers/StepperContainer';

class SideNavStepper extends React.Component {
  constructor() {
    super();
    this.state = {};
  }

  componentDidMount() {
    Meteor.call('getServerTime', (e, res) => {
      this.setState({ serverTime: res });
    });

    this.props.setStep(this.props.loan.logic.step);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.location.pathname !== this.props.location.pathname) {
      // Update server time when the user moves around, to make sure all
      // validation works fine
      Meteor.call('getServerTime', (e, res) => {
        this.setState({ serverTime: res });
      });
    }
  }

  handleClick = (i, isNavLink = false) => {
    if (this.props.activeStep === i && !isNavLink) {
      this.props.hideSteps();
    } else {
      this.props.setStep(i);
    }
  };

  render() {
    const { serverTime } = this.state;
    const { activeStep } = this.props;

    const steps = getSteps({
      ...this.props,
      serverTime,
    });

    return (
      <div className="side-stepper">
        <h5 className="fixed-size top-title">
          <T id="SideNavStepper.title" />
        </h5>
        <ul className="list">
          {steps.map((s, i) => (
            <Step
              {...this.props}
              key={i}
              step={s}
              active={activeStep === i}
              currentLoanStep={this.props.loan.logic.step === i}
              handleClick={() => this.handleClick(i)}
            />
          ))}
        </ul>
      </div>
    );
  }
}

SideNavStepper.propTypes = {
  location: PropTypes.objectOf(PropTypes.any).isRequired,
  setStep: PropTypes.func.isRequired,
  hideSteps: PropTypes.func.isRequired,
  activeStep: PropTypes.number.isRequired,
};

export default StepperContainer(SideNavStepper);
