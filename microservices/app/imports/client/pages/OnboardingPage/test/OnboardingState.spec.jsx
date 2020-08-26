import React from 'react';
/* eslint-env mocha */
import { expect } from 'chai';
import { Route } from 'react-router-dom';
import { QueryParamProvider } from 'use-query-params';

import {
  ACQUISITION_STATUS,
  PURCHASE_TYPE,
} from 'core/api/loans/loanConstants';
import { RESIDENCE_TYPE } from 'core/api/properties/propertyConstants';
import {
  cleanup,
  fireEvent,
  render,
} from 'core/utils/testHelpers/testing-library';

import withOnboardingContext, { useOnboarding } from '../OnboardingContext';

const ComponentA = withOnboardingContext(() => {
  const {
    activeStep,
    currentTodoStep,
    stepIds,
    setActiveStep,
    resetPosition,
    handleNextStep,
  } = useOnboarding();
  return (
    <div>
      <span>activeStep: {activeStep}</span>
      <span>currentTodoStep: {currentTodoStep}</span>
      {stepIds.map(id => (
        <div key={id}>
          <span>step: {id}</span>
          <button type="button" onClick={() => setActiveStep(id)}>
            goToStep: {id}
          </button>
        </div>
      ))}

      <button type="button" onClick={handleNextStep}>
        Next
      </button>

      <button type="button" onClick={resetPosition}>
        Reset
      </button>
    </div>
  );
});

const Component = ({ loan }) => (
  <QueryParamProvider ReactRouterRoute={Route}>
    <ComponentA loan={loan} />
  </QueryParamProvider>
);

describe('Onboarding State', () => {
  beforeEach(async () => {
    await cleanup();
  });

  it('starts onboarding with purchaseType', () => {
    const { getByText } = render(<Component loan={{}} />);

    const result = getByText('activeStep: purchaseType');
    expect(!!result).to.equal(true);
  });

  it('skips purchaseType if it is already set', () => {
    const { getByText } = render(
      <Component loan={{ purchaseType: PURCHASE_TYPE.ACQUISITION }} />,
    );

    const result = getByText('activeStep: acquisitionStatus');
    expect(!!result).to.equal(true);
  });

  it('skips refinancing step when doing an acquisition', () => {
    const { queryByText } = render(
      <Component loan={{ purchaseType: PURCHASE_TYPE.ACQUISITION }} />,
    );

    const purchaseType = queryByText('step: purchaseType');
    expect(!!purchaseType).to.equal(true);

    const refinancing = queryByText('step: refinancing');
    expect(!!refinancing).to.equal(false);
  });

  it('keeps track of the next step to do', async () => {
    const { getByText, findByText } = render(
      <Component
        loan={{
          purchaseType: PURCHASE_TYPE.ACQUISITION,
          acquisitionStatus: ACQUISITION_STATUS.SEARCHING,
        }}
      />,
    );

    const residenceType = getByText('activeStep: residenceType');
    expect(!!residenceType).to.equal(true);

    fireEvent.click(getByText('goToStep: purchaseType'));

    const purchaseType = await findByText('activeStep: purchaseType');
    expect(!!purchaseType).to.equal(true);

    const residenceTypeTodo = await findByText(
      'currentTodoStep: residenceType',
    );
    expect(!!residenceTypeTodo).to.equal(true);
  });

  it('goes to the next step', async () => {
    const loan = {};
    const { getByText, findByText } = render(<Component loan={loan} />);

    const purchaseType = getByText('activeStep: purchaseType');
    expect(!!purchaseType).to.equal(true);

    fireEvent.click(getByText('Next'));

    const acquisitionStatus = await findByText('activeStep: acquisitionStatus');
    expect(!!acquisitionStatus).to.equal(true);
  });

  it('sets the right next step if you go back and change stuff', () => {
    const loan = {
      purchaseType: PURCHASE_TYPE.ACQUISITION,
      acquisitionStatus: ACQUISITION_STATUS.SEARCHING,
      residenceType: RESIDENCE_TYPE.MAIN_RESIDENCE,
      properties: [{ _id: 'propertyId', canton: 'GE', value: 1000000 }],
      borrowers: [{ birthDate: '01-01-1992' }],
    };
    const { getByText, rerender } = render(<Component loan={loan} />);

    const income = getByText('currentTodoStep: income');
    expect(!!income).to.equal(true);

    fireEvent.click(getByText('goToStep: purchaseType'));

    rerender(
      <Component loan={{ ...loan, purchaseType: PURCHASE_TYPE.REFINANCING }} />,
    );

    fireEvent.click(getByText('Reset'));

    const refinancing = getByText('activeStep: refinancing');
    expect(!!refinancing).to.equal(true);
  });
});
