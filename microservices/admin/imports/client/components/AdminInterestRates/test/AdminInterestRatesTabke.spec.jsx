/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';

import InterestRatesTable from 'core/components/InterestRatesTable';
import { shallow } from '../../../../../utils/testHelpers/enzyme';
import { getMountedComponent } from '../../../../../utils/testHelpers';
import AdminInterestRatesTable from '../AdminInterestRatesTable';

let defaultProps;

const component = props => shallow(<AdminInterestRatesTable {...props} />);

const mountedComponent = props =>
  getMountedComponent({
    Component: AdminInterestRatesTable,
    props,
    withRouter: false,
  });

describe('AdminInterestRatesTable', () => {
  beforeEach(() => getMountedComponent.reset());

  it('renders a `InterestRatesTable` component for each filter', () => {
    expect(component(defaultProps).find(InterestRatesTable).length).to.equal(1);
  });
});
