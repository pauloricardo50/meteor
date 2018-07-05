/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';

import InterestRatesTable from 'core/components/InterestRatesTable';
import { shallow } from 'core/utils/testHelpers/enzyme';
import { getMountedComponent } from 'core/utils/testHelpers';

import AdminInterestRatesTable from '../AdminInterestRatesTable';
import { columnOptions, rows } from '../adminInterestsTableHelpers';

const defaultProps = { columnOptions, rows };

const component = props => shallow(<AdminInterestRatesTable {...props} />);

describe('AdminInterestRatesTable', () => {
  beforeEach(() => getMountedComponent.reset());

  it('renders a `InterestRatesTable` component with correct props', () => {
    expect(component()
      .find(InterestRatesTable)
      .props()).to.deep.equal(defaultProps);
  });
});
