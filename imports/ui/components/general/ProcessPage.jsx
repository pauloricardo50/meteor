import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Session } from 'meteor/session';

import getSteps from '/imports/js/arrays/steps';
import ProcessPageBar from './ProcessPageBar.jsx';

const getStepValues = props => {
  const steps = getSteps(props);
  const stepItems = steps[props.stepNb].items;
  const currentStep = stepItems.find(i => i.id === props.id);
  const index = stepItems.findIndex(i => i.id === props.id);
  const length = stepItems.length;
  let prevStep;
  let nextStep;
  let nextLink;

  // Get the next step's link
  if (index < length - 1) {
    nextStep = stepItems[index + 1];
    nextLink = nextStep && !nextStep.disabled && nextStep.link;
  } else {
    nextStep = steps[props.stepNb + 1].items.length > 0 && steps[props.stepNb + 1].items[0];
    nextLink = nextStep && nextStep.link;
  }

  // Get the previous step's link
  if (index > 0) {
    prevStep = stepItems[index - 1];
  } else {
    const prevItems = steps[props.stepNb - 1].items;
    prevStep = prevItems[prevItems.length - 1];
  }
  const prevLink = prevStep && prevStep.link;

  return { currentStep, index, length, nextLink, prevLink };
};

export default class ProcessPage extends Component {
  componentDidMount() {
    Session.set('stepNb', this.props.stepNb);
  }

  componentWillUnmount() {
    Session.set('stepNb', undefined);
  }

  render() {
    const values = getStepValues(this.props);
    const barProps = { ...this.props, ...values };
    return (
      <div className="page-title">
        <ProcessPageBar {...barProps} className="top-bar" />
        <div className="children animated fadeIn">
          {this.props.children}
        </div>
        {this.props.showBottom && <ProcessPageBar {...barProps} className="bottom-bar" />}
      </div>
    );
  }
}

ProcessPage.propTypes = {
  children: PropTypes.element.isRequired,
  stepNb: PropTypes.number.isRequired,
  id: PropTypes.string.isRequired,
  loanRequest: PropTypes.objectOf(PropTypes.any).isRequired,
  borrowers: PropTypes.arrayOf(PropTypes.object).isRequired,
  showBottom: PropTypes.bool,
  serverTime: PropTypes.instanceOf(Date),
};

ProcessPage.defaultProps = {
  showBottom: true,
  serverTime: undefined,
};
