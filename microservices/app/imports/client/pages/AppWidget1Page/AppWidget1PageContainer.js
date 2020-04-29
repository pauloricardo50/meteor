import { connect } from 'react-redux';

import { getFinmaValues } from 'core/components/widget1/widget1Helpers';
import { widget1Selectors } from 'core/redux/widget1';

const AppWidget1PageContainer = connect(state => {
  const {
    widget1: {
      step,
      finishedTutorial,
      salary: { value: salary },
      fortune: { value: fortune },
      property: { value: propertyValue },
      wantedLoan: { value: wantedLoan },
      purchaseType,
    },
  } = state;
  const finma = getFinmaValues({
    salary,
    fortune,
    propertyValue,
    purchaseType,
    wantedLoan,
  });
  return {
    step,
    finishedTutorial,
    finma,
    salary,
    fortune,
    propertyValue,
    fields: widget1Selectors.selectFields(state),
  };
});

export default AppWidget1PageContainer;
