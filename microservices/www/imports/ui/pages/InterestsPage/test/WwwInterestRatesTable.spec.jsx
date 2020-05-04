/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';

import {
  INTEREST_RATES,
  TRENDS,
} from 'core/api/interestRates/interestRatesConstants';
import InterestRatesTable from 'core/components/InterestRatesTable';
import { getMountedComponent } from 'core/utils/testHelpers';
import { shallow } from 'core/utils/testHelpers/enzyme';

import { WwwInterestRatesTableForTests } from '../WwwInterestRatesTable';
import { columnOptions, rows } from '../wwwInterestsTableHelpers';

const date = new Date();

const currentInterestRates = {
  date,
  rates: [
    {
      type: INTEREST_RATES.YEARS_10,
      rateLow: 0.01,
      rateHigh: 0.02,
      trend: TRENDS.FLAT,
    },
  ],
};

const defaultProps = {
  currentInterestRates,
  date,
  columnOptions,
  rows: rows(currentInterestRates.rates),
};

const component = props =>
  shallow(<WwwInterestRatesTableForTests {...props} />);

describe('WwwInterestRatesTable', () => {
  beforeEach(() => getMountedComponent.reset());

  it('renders a `InterestRatesTable` component with correct props', () => {
    expect(
      component({ currentInterestRates })
        .find(InterestRatesTable)
        .props(),
    ).to.deep.equal(defaultProps);
  });
});
