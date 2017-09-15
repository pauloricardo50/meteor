import React from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';

import getSteps from '/imports/js/arrays/steps';
import { T } from '/imports/ui/components/general/Translation';
import SideNavStepperStep from './SideNavStepperStep';

export default class SideNavStepper extends React.Component {
  constructor(props) {
    super(props);

    this.state = { active: this.props.loanRequest.logic.step };
  }

  componentDidMount() {
    Meteor.call('getServerTime', (e, res) => {
      this.setState({ serverTime: res });
    });
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.location.pathname !== this.props.location.pathname &&
      Session.get('stepNb') !== undefined
    ) {
      // Use defer to allow the other component to update Session before grabbing it here
      // Otherwise it is always one step behind when the stepNb changes
      Meteor.defer(() => this.setState({ active: Session.get('stepNb') }));

      // Update server time when the user moves around, to make sure all
      // validation works fine
      Meteor.call('getServerTime', (e, res) => {
        this.setState({ serverTime: res });
      });
    }
  }

  handleClick = (i, isNavLink = false) => {
    if (this.state.active === i && !isNavLink) {
      this.setState({ active: -1 });
    } else {
      this.setState({ active: i });
    }
  };

  render() {
    const steps = getSteps({
      ...this.props,
      serverTime: this.state.serverTime,
    });
    return (
      <div className="side-stepper">
        <h5 className="fixed-size top-title">
          <T id="SideNavStepper.title" />
        </h5>
        <ul className="list">
          {steps.map((s, i) => (
            <SideNavStepperStep
              {...this.props}
              key={i}
              step={s}
              active={this.state.active === i}
              currentRequestStep={this.props.loanRequest.logic.step === i}
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
};
