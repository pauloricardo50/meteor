/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';

import { shallow } from 'core/utils/testHelpers/enzyme';
import { Composer } from 'core/api';
import { ROLES } from 'core/api/constants';
import TableFilters from 'core/components/Table/TableFilters';

import {
  withQueryUsers,
  withUsersTableFilters,
  getAdminsEmails,
} from '../UsersTableContainer';

describe('UsersTableContainer', () => {
  it('should compose HoCs in the correct order', () => {
    const hocs = [withQueryUsers, withUsersTableFilters];
    expect(Composer.compose.calledWith(...hocs)).to.equal(true);
  });

  describe('withUsersTableFilters', () => {
    it("enables filtering by users' role and assigned employee", () => {
      const expectedUserFilters = {
        filters: {
          roles: true,
          assignedEmployee: { emails: [{ address: true }] },
        },
        options: {
          roles: Object.values(ROLES),
          address: getAdminsEmails(),
        },
      };

      const WrappedComponent = () => null;
      const Component = withUsersTableFilters(WrappedComponent);
      const wrapper = shallow(<Component />);

      const filtersProp = wrapper.find(TableFilters).prop('filters');
      expect(filtersProp.filters).to.deep.equal(expectedUserFilters.filters);

      expect(filtersProp.options.roles).to.deep.equal(expectedUserFilters.options.roles);

      expect(filtersProp.options.address.constructor).to.equal(Promise);
    });
  });
});
