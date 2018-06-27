/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'core/utils/testHelpers/enzyme';

import AdminDashboardPage from '../AdminDashboardPage';
import TasksTableWithData from '../../../components/TasksTable/TasksTableWithData';

const component = () => shallow(<AdminDashboardPage />);

describe('AdminDashboardPage', () => {
  it("enables filtering by assigned employee's email on the tasks table", () => {
    const tableFiltersProp = component()
      .find(TasksTableWithData)
      .first()
      .prop('tableFilters');

    expect(tableFiltersProp).to.deep.equal({
      assignedEmployee: { emails: [{ address: true }] },
    });
  });
});
