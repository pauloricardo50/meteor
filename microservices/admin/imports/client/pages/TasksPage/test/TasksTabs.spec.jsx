/* eslint-env mocha */
import { expect } from 'chai';

import { shallow } from 'core/utils/testHelpers/enzyme';
import { TASK_TYPE, TASK_STATUS } from 'core/api/constants';

import { getTabs } from '../TasksTabs';

const getTabById = tabId => getTabs().find(({ id }) => id === tabId);

const getTasksTableFiltersProp = tabId =>
  shallow(getTabById(tabId).content).prop('tableFilters');

describe('TasksTabs', () => {
  ['myTasks', 'unassignedTasks', 'allTasks'].forEach((tabId) => {
    describe(tabId, () => {
      it('enables filtering tasks by type and status', () => {
        const filtersProp = getTasksTableFiltersProp(tabId);

        expect(filtersProp).to.deep.equal({
          filters: {
            type: true,
            status: true,
          },
          options: {
            type: Object.values(TASK_TYPE),
            status: Object.values(TASK_STATUS),
          },
        });
      });
    });
  });
});
