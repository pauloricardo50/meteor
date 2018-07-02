/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';

import { shallow } from 'core/utils/testHelpers/enzyme';
import { Composer } from 'core/api';
import TableFilters from 'core/components/Table/TableFilters';

import {
  TasksTableContainer,
  withTasksQuery,
  withTasksTableFilters,
} from '../TasksTableContainer';

describe('TasksTableContainer', () => {
  it('should compose HoCs in the correct order', () => {
    const hocs = [withTasksQuery, withTasksTableFilters];
    TasksTableContainer(() => null);
    expect(Composer.compose.lastCall.args).to.deep.equal(hocs);
  });

  describe('withTasksTableFilters', () => {
    it(`passes the 'tableFilters' prop from above
        to the TableFilters component`, () => {
      const tableFilters = {
        filters: {
          a: true,
          b: true,
        },
        options: { a: ['dummyData1', 'dummyData2'], b: ['someDummyData1'] },
      };

      const WrappedComponent = () => null;
      const Component = withTasksTableFilters(WrappedComponent);

      const wrapper = shallow(<Component tableFilters={tableFilters} />);
      expect(wrapper.find(TableFilters).prop('filters')).to.deep.equal(tableFilters);
    });
  });
});
