/* eslint-env mocha */
import { expect } from 'chai';
import React from 'react';

import { shallow } from 'core/utils/testHelpers/enzyme';

import { TASK_STATUS } from 'core/api/tasks/taskConstants';
import AdminDashboardPage from '../AdminDashboardPage';

describe('AdminDashboardPage', () => {
  let props = {};
  const component = () => shallow(<AdminDashboardPage {...props} />);

  beforeEach(() => {
    props = {};
  });

  it(`enables filtering by assigned employee's email
      on the tasks table`, () => {
    const adminEmail = 'admin@email.com';
    props.currentUser = { email: adminEmail };

    const tableFiltersProp = component()
      .find('[tableFilters]')
      .first()
      .prop('tableFilters');

    expect(tableFiltersProp).to.deep.equal({
      filters: {
        assignedEmployee: { email: true },
        status: [TASK_STATUS.ACTIVE],
      },
      options: {
        email: [adminEmail, undefined],
        status: Object.values(TASK_STATUS),
      },
    });
  });
});
