/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';

import InterestRatesTable from 'core/components/InterestRatesTable';
import { shallow } from 'core/utils/testHelpers/enzyme';
import { getMountedComponent } from 'core/utils/testHelpers';

import LoanInterestRatesTable from '../LoanInterestRatesTable';
import { columnOptions, rows } from '../loanInterestsTableHelpers';

const defaultProps = { columnOptions, rows };

const component = props => shallow(<LoanInterestRatesTable {...props} />);

describe('LoanInterestRatesTable', () => {
  beforeEach(() => getMountedComponent.reset());

  it('renders a `InterestRatesTable` component with correct props', () => {
    expect(component()
      .find(InterestRatesTable)
      .props()).to.deep.equal(defaultProps);
  });
});
