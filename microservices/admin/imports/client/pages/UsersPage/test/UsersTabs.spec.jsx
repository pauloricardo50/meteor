/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';
import { MemoryRouter } from 'react-router-dom';
import { shallow } from 'core/utils/testHelpers/enzyme';

import { getTabs } from '../UsersTabs';

const getTabById = (tabId) => {
  const tab = getTabs({ history: {} }).find(({ id }) => id === tabId);

  // put the tab element inside a Router
  // because the UsersTable component is wrapped by withRouter
  // which needs an outer Router
  const Router = (
    <MemoryRouter>
      {React.cloneElement(tab.content, {
        history: { location: { pathname: '' } },
      })}
    </MemoryRouter>
  );

  return shallow(Router).childAt(0);
};

const getUsersTableFiltersProp = tabId =>
  getTabById(tabId).prop('tableFilters');

describe('UsersTabs', () => {
  ['myUsers', 'allUsers'].forEach((tabId) => {
    describe(tabId, () => {
      it('enables filtering tasks by type and status', () => {
        console.log(
          '>>>>>>',
          getTabById(tabId)
            .childAt(0)
            .props(),
        );

        const filtersProp = getUsersTableFiltersProp(tabId);

        expect(filtersProp).to.deep.equal({
          role: true,
          assignedEmployee: { emails: [{ address: true }] },
        });
      });
    });
  });
});
