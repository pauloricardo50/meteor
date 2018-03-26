import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { DocHead } from 'meteor/kadira:dochead';
import { injectIntl } from 'react-intl';

import getSteps from 'core/arrays/steps';
import withLoan from 'core/containers/withLoan';
import ProcessPageBar from './ProcessPageBar';
import StepperContainer from '../../containers/StepperContainer';

export const getStepValues = (props) => {
  const { id: itemId, stepNb } = props;

  const steps = getSteps(props);
  const currentStep = steps[stepNb - 1];
  const stepItems = currentStep.items;
  const { length } = stepItems;
  const currentItem = stepItems.find(item => item.id === itemId);
  const index = stepItems.findIndex(item => item.id === itemId);
  const nextStep = stepNb < steps.length - 1 && steps[stepNb];
  const prevStep = stepNb > 1 && steps[stepNb - 1];
  let nextLink;
  let prevItem;
  let nextItem;

  // Get the next item's link
  if (index < length - 1) {
    nextItem = stepItems[index + 1];
    nextLink = nextItem && !nextItem.disabled && nextItem.link;
  } else {
    nextItem = nextStep && nextStep.items[0];
    nextLink = nextItem && nextItem.link;
  }

  // Get the previous item's link
  if (index > 0) {
    prevItem = stepItems[index - 1];
  } else {
    const prevItems = prevStep.items;
    prevItem = prevItems && prevItems[prevItems.length - 1];
  }
  const prevLink = prevItem && prevItem.link;

  return {
    currentStep: currentItem,
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
