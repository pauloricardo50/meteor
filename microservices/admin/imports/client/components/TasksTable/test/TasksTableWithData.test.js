/* eslint-env mocha */
import { expect } from 'chai';

import { compose } from 'core/api';
import withTableFilters from 'core/containers/withTableFilters';

import { withTasksQuery } from '../TasksTableWithData';

describe('TasksTableContainer', () => {
  it('composes HoCs in the correct order', () => {
    const hocs = [withTasksQuery, withTableFilters];
    expect(compose.calledWith(...hocs)).to.equal(true);
  });
});
