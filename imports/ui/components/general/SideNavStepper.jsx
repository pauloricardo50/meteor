import React, { PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';

import getSteps from '/imports/js/arrays/steps';
import SideNavStepperStep from './SideNavStepperStep.jsx';

export default class SideNavStepper extends React.Component {
  constructor(props) {
    super(props);

    this.state = { active: 0 };
  }

  componentDidMount() {
    Meteor.call('getServerTime', (e, res) => {
      this.setState({ serverTime: res });
    });
  }

  handleClick = i => {
    if (this.state.active === i) {
      this.setState({ active: 0 });
    } else {
      this.setState({ active: i });
    }
  };

  render() {
    const steps = getSteps({ ...this.props, serverTime: this.state.serverTime });
    return (
      <div className="side-stepper">
        <h5 className="fixed-size top-title">PROGRESSION</h5>
        <ul className="list">
          {steps.map(s => (
            <SideNavStepperStep
              {...this.props}
              key={s.nb}
              step={s}
              active={this.state.active === s.nb}
              handleClick={() => this.handleClick(s.nb)}
            />
          ))}
        </ul>
      </div>
    );
  }
}

SideNavStepper.propTypes = {};
