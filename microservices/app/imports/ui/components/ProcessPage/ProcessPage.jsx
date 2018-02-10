import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { DocHead } from 'meteor/kadira:dochead';
import { injectIntl } from 'react-intl';

import getSteps from 'core/arrays/steps';
import withLoan from 'core/containers/withLoan';
import ProcessPageBar from './ProcessPageBar';
import StepperContainer from '../../containers/StepperContainer';

export const getStepValues = (props) => {
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
    nextStep =
      steps[props.stepNb + 1].items.length > 0 &&
      steps[props.stepNb + 1].items[0];
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

  return {
    currentStep,
    index,
    length,
    nextLink,
    prevLink,
  };
};

class ProcessPage extends Component {
  componentDidMount() {
    this.setBarProps();

    this.props.setStep(this.props.stepNb);
  }

  setBarProps = () => {
    const { intl, loan } = this.props;
    const values = getStepValues(this.props);
    this.barProps = {
      ...this.props,
      ...values,
      status: loan.status,
    };
    DocHead.setTitle(`${intl.formatMessage({
      id: `steps.${this.barProps.currentStep.id}.title`,
    })} | e-Potek`);
  };

  render() {
    this.setBarProps();
    return (
      <section className="page-title">
        <ProcessPageBar {...this.barProps} className="top-bar" />
        <div className="children animated fadeIn page">
          {this.props.children}
        </div>
      </section>
    );
  }
}

ProcessPage.propTypes = {
  children: PropTypes.element,
  stepNb: PropTypes.number.isRequired,
  id: PropTypes.string.isRequired,
  loan: PropTypes.objectOf(PropTypes.any).isRequired,
  borrowers: PropTypes.arrayOf(PropTypes.object).isRequired,
  showBottom: PropTypes.bool,
  serverTime: PropTypes.instanceOf(Date),
  setStep: PropTypes.func.isRequired,
};

ProcessPage.defaultProps = {
  showBottom: true,
  serverTime: undefined,
  children: undefined,
};

export { ProcessPage };
export default injectIntl(StepperContainer(withLoan(ProcessPage)));
