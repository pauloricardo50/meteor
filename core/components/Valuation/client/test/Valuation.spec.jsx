// @flow
/* eslint-env mocha */
import { expect } from 'chai';
import getMountedComponent from 'core/utils/testHelpers/getMountedComponent';
import { toMoney } from 'core/utils/conversionFunctions';

import Button from 'core/components/Button';
import Loading from 'core/components/Loading';
import { VALUATION_STATUS } from 'core/api/constants';

import { Valuation } from '../../Valuation';
import ValuationResult from '../../ValuationResult';

describe('Valuation', () => {
  let props;
  const component = () =>
    getMountedComponent({
      Component: Valuation,
      props,
    });

  beforeEach(() => {
    props = {
      property: {
        valuation: { status: VALUATION_STATUS.NONE, microlocation: {} },
      },
    };
  });

  afterEach(() => {
    getMountedComponent.reset();
  });

  it('renders the valuation button when the valuation does not exist', () => {
    expect(component()
      .find(Button)
      .exists()).to.equal(true);
  });

  it('renders the results when the valuation exists', () => {
    const min = 100000;
    const max = 500000;
    props.property.valuation = {
      ...props.property.valuation,
      status: VALUATION_STATUS.DONE,
      min,
      max,
    };

    expect(component()
      .find(ValuationResult)
      .contains(toMoney(min))).to.equal(true);
    expect(component()
      .find(ValuationResult)
      .contains(toMoney(max))).to.equal(true);
  });

  it('renders the value when it exists', () => {
    const value = 1000000;
    props.property.valuation = {
      ...props.property.valuation,
      status: VALUATION_STATUS.DONE,
      value,
    };

    expect(component()
      .find(ValuationResult)
      .contains(toMoney(value))).to.equal(true);
  });

  it('renders the button when the valuation exists', () => {
    props.property.valuation = {
      ...props.property.valuation,
      status: VALUATION_STATUS.DONE,
    };
    expect(component()
      .find(Button)
      .exists()).to.equal(true);
  });

  it('renders the loading state when the button is clicked and the valuation does not exist yet', () => {
    props.isLoading = true;
    expect(component()
      .find(Loading)
      .exists()).to.equal(true);
  });

  it('renders the error when error exists', () => {
    const error = 'testError';
    props.property.valuation = {
      ...props.property.valuation,
      status: VALUATION_STATUS.ERROR,
      error,
    };
    expect(component().contains(error)).to.equal(true);
  });

  it('renders the error button when error exists', () => {
    expect(component()
      .find(Button)
      .exists()).to.equal(true);
  });
});
