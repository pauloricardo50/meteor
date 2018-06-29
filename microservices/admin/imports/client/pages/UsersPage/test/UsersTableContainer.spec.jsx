/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';

import { shallow } from 'core/utils/testHelpers/enzyme';
import { Composer } from 'core/api';
import TableFilters from 'core/components/Table/TableFilters';

import UsersTableContainer, {
  withQueryUsers,
  withUsersTableFilters,
} from '../UsersTableContainer';

describe('UsersTableContainer', () => {
  it('should compose HoCs in the correct order', () => {
    const hocs = [withQueryUsers, withUsersTableFilters];
    UsersTableContainer(() => null);
    expect(Composer.compose.lastCall.args).to.deep.equal(hocs);
  });

  describe('withUsersTableFilters', () => {
    it(`renders the TableFilters component
        with the correct filters based on the data prop`, () => {
      const expectedUserFilters = {
        filters: {
          roles: true,
          assignedEmployee: { emails: [{ address: true }] },
        },
        options: { address: ['email1@test.com', 'email2@test.com'] },
      };

      const props = {
        data: [
          { emails: [{ address: 'email1@test.com' }] },
          { emails: [{ address: 'email2@test.com' }] },
        ],
      };

      const WrappedComponent = () => null;
      const Component = withUsersTableFilters(WrappedComponent);

      const tableFiltersComponent = shallow(<Component {...props} />).find(TableFilters);
      expect(tableFiltersComponent.prop('filters')).to.deep.equal(expectedUserFilters);
    });
  });
});
