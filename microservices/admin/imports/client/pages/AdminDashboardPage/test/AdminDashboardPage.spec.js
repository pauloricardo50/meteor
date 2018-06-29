/* eslint-env mocha */
import { expect } from 'chai';
import React from 'react';

import { shallow } from 'core/utils/testHelpers/enzyme';

import AdminDashboardPage from '../AdminDashboardPage';
import TasksTableWithData from '../../../components/TasksTable/TasksTableWithData';

const component = props => shallow(<AdminDashboardPage {...props} />);

describe('AdminDashboardPage', () => {
  it(`enables filtering by assigned employee's email
      on the tasks table`, () => {
    const adminEmail = 'admin@email.com';
    const currentUser = { emails: [{ address: adminEmail }] };

    const tableFiltersProp = component({ currentUser })
      .find(TasksTableWithData)
      .first()
      .prop('tableFilters');

    expect(tableFiltersProp).to.deep.equal({
      filters: { assignedEmployee: { emails: [{ address: true }] } },
      options: { address: [adminEmail] },
    });
  });
});
