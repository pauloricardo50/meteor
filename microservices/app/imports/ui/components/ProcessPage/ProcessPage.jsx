import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { DocHead } from 'meteor/kadira:dochead';
import { injectIntl } from 'react-intl';

import getSteps from 'core/arrays/steps';
import withLoan from 'core/containers/withLoan';
import ProcessPageBar from './ProcessPageBar';
import StepperContainer from '../../containers/StepperContainer';

const isLastItemOfStep = (index, length) => index >= length - 1;
const isFirstItemOfStep = index => index <= 0;

export const getStepValues = (props) => {
  const { id: itemId, stepNb } = props;
  const steps = getSteps(props);

  const currentStepIndex = stepNb - 1;
  const prevStepIndex = currentStepIndex - 1;
  const nextStepIndex = currentStepIndex + 1;

  const currentStep = steps[currentStepIndex];
  const prevStep = prevStepIndex >= 0 && steps[prevStepIndex];
  const nextStep = nextStepIndex < steps.length && steps[nextStepIndex];

  const { items: currentStepItems } = currentStep;
  const { length: currentStepItemCount } = currentStepItems;

  const currentItem = currentStepItems.find(({ id }) => id === itemId);
  const currentItemIndex = currentStepItems.findIndex(({ id }) => id === itemId);

  let prevLink;
  let nextLink;
  let prevItem;
  let nextItem;

  // Get the next item's link
  if (isLastItemOfStep(currentItemIndex, currentStepItemCount)) {
    // Get the first item of next step
    nextItem = nextStep && nextStep.items[0];
    nextLink = nextItem && nextItem.link;
  } else {
    // get next item of current step
    nextItem = currentStepItems[currentItemIndex + 1];
    nextLink = nextItem && !nextItem.disabled && nextItem.link;
  }

  // Get the previous item's link
  if (isFirstItemOfStep(currentItemIndex)) {
    // Get the last item of the previous step
    const prevItems = prevStep.items;
    prevItem = prevItems && prevItems[prevItems.length - 1];
    prevLink = prevItem && prevItem.link;
  } else {
    // get previous item of current step
    prevItem = currentStepItems[currentItemIndex - 1];
    prevLink = prevItem && prevItem.link;
  }

  return {
    currentStep: currentItem,
    index: currentItemIndex,
    length: currentStepItemCount,
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
    this.barProps = { ...this.props, ...values, status: loan.status };
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
