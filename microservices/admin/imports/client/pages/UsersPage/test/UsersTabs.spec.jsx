/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';
import { MemoryRouter } from 'react-router-dom';

import { shallow } from 'core/utils/testHelpers/enzyme';
import { ROLES } from 'core/api/constants';

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
        const filtersProp = getUsersTableFiltersProp(tabId);

        expect(filtersProp.filters).to.deep.equal({
          roles: true,
          assignedEmployee: { emails: [{ address: true }] },
        });

        expect(filtersProp.options.roles).to.deep.equal(Object.values(ROLES));

        expect(filtersProp.options.address.constructor).to.equal(Promise);
      });
    });
  });
});
