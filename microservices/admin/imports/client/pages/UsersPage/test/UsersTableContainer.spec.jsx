/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';

import { shallow } from 'core/utils/testHelpers/enzyme';
import { Composer } from 'core/api';
import { ROLES } from 'core/api/constants';
import TableFilters from 'core/components/Table/TableFilters';

import { withQueryUsers, withUsersTableFilters } from '../UsersTableContainer';

describe('UsersTableContainer', () => {
  it('should compose HoCs in the correct order', () => {
    const hocs = [withQueryUsers, withUsersTableFilters];
    expect(Composer.compose.calledWith(...hocs)).to.equal(true);
  });

  describe('withUsersTableFilters', () => {
    let expectedUserFilters;
    let adminDashboardProps;
    beforeEach(() => {
      expectedUserFilters = {
        filters: {
          roles: true,
          assignedEmployee: { emails: [{ address: true }] },
        },
        options: {
          roles: Object.values(ROLES),
          address: ['admin1@asignee.com', 'admin2@asignee.com'],
        },
      };

      adminDashboardProps = {
        data: [
          { assignedEmployee: { emails: [{ address: 'admin1@asignee.com' }] } },
          { assignedEmployee: { emails: [{ address: 'admin2@asignee.com' }] } },
        ],
      };
    });

    it("enables filtering by users' role and assigned employee", () => {
      const WrappedComponent = () => null;
      const Component = withUsersTableFilters(WrappedComponent);

      const wrapper = shallow(<Component {...adminDashboardProps} />);
      const filtersProp = wrapper.find(TableFilters).prop('filters');
      console.log('filtersProp', filtersProp);
      expect(filtersProp).to.deep.equal(expectedUserFilters);
    });

    it(`enables filtering by users' role and assigned employee
        when there's no assigned employee for the user`, () => {
      const WrappedComponent = () => null;
      const Component = withUsersTableFilters(WrappedComponent);

      adminDashboardProps.data[1] = {};
      expectedUserFilters.options.address[1] = undefined;

      const wrapper = shallow(<Component {...adminDashboardProps} />);
      const filtersProp = wrapper.find(TableFilters).prop('filters');
      expect(filtersProp).to.deep.equal(expectedUserFilters);
    });
  });
});
