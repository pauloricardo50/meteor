/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';

import { shallow } from 'core/utils/testHelpers/enzyme';
import { T } from 'core/components/Translation';
import TableFilters from 'core/components/Table/TableFilters';

const dataToFilter = [
  { name: 'John', city: 'London', phone: '123' },
  { name: 'Alex', city: 'London', phone: '4321' },
  { name: 'Rebecca', city: 'Portland', phone: '9032' },
];

const component = (props = { data: dataToFilter }) =>
  shallow(<TableFilters {...props} />);

describe('TableFilters', () => {
  // it('renders ')
});
