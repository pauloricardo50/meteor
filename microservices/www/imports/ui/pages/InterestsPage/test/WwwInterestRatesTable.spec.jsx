/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';

import InterestRatesTable from 'core/components/InterestRatesTable';
import { shallow } from 'core/utils/testHelpers/enzyme';
import { getMountedComponent } from 'core/utils/testHelpers';

import WwwInterestRatesTable from '../WwwInterestRatesTable';
import { columnOptions, rows } from '../wwwInterestsTableHelpers';

const defaultProps = { columnOptions, rows };

const component = props => shallow(<WwwInterestRatesTable {...props} />);

describe('WwwInterestRatesTable', () => {
  beforeEach(() => getMountedComponent.reset());

  it('renders a `InterestRatesTable` component with correct props', () => {
    expect(component()
      .find(InterestRatesTable)
      .props()).to.deep.equal(defaultProps);
  });
});
