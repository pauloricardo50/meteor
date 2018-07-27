// @flow
/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'core/utils/testHelpers/enzyme';
import Button from 'core/components/Button';
import Loading from '../../Loading';

import { Valuation } from '../Valuation';
import { EXPERTISE_STATUS } from '../../../api/constants';

describe('Valuation', () => {
  let props;
  const component = () => shallow(<Valuation {...props} />);

  beforeEach(() => {
    props = {
      property: {
        valuation: {
          status: EXPERTISE_STATUS.NONE,
        },
      },
    };
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
      status: EXPERTISE_STATUS.DONE,
      min,
      max,
    };
    expect(component().contains(min)).to.equal(true);
    expect(component().contains(max)).to.equal(true);
  });

  it('renders the button when the valuation exists', () => {
    props.property.valuation = {
      status: EXPERTISE_STATUS.DONE,
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
      status: EXPERTISE_STATUS.ERROR,
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
