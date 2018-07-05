/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';

import { shallow } from 'core/utils/testHelpers/enzyme';
import { getMountedComponent } from 'core/utils/testHelpers';
import {
  LOANS_COLLECTION,
  BORROWERS_COLLECTION,
  USERS_COLLECTION,
} from 'core/api/constants';

import { initialState } from '../../../../redux/sidenav/sidenavReducer';
import AdminSideNav from '../AdminSideNav';
import DetailSideNavHeader from '../DetailSideNavHeader';
import DetailSideNavList from '../DetailSideNavList';
import DetailSideNavFilters from '../DetailSideNavFilters';
import DetailSideNavSort from '../DetailSideNavSort';
import { defaultSortOption } from '../DetailSideNavSort/sortOptions';

const currentUser = { emails: [{ address: 'admin@test.com' }] };
const assignedToMeFilterValue = {
  'user.assignedEmployee.emails': {
    $elemMatch: { address: 'admin@test.com' },
  },
};

const component = state =>
  getMountedComponent({
    Component: AdminSideNav,
    props: { currentUser },
    withStore: {
      sidenav: {
        ...initialState,
        showDetail: true,
        ...state,
      },
    },
    withRouter: true,
  });
describe('AdminSideNav', () => {
  beforeEach(() => {
    getMountedComponent.reset();
  });

  [(LOANS_COLLECTION, BORROWERS_COLLECTION, USERS_COLLECTION)].forEach((collectionName) => {
    describe(`for ${collectionName} collection`, () => {
      it('renders DetailSideNavSort and DetailSideNavFilters components in the DetailSideNavHeader', () => {
        const sidenavHeader = component({ collectionName }).find(DetailSideNavHeader);

        expect(sidenavHeader.find(DetailSideNavSort).length).to.equal(1);
        expect(sidenavHeader.find(DetailSideNavFilters).length).to.equal(1);
      });
    });
  });

  it('passes `setSortOption` redux action to DetailSideNavSort', () => {
    const sidenavSort = component({ collectionName: LOANS_COLLECTION })
      .find(DetailSideNavHeader)
      .find(DetailSideNavSort);
    expect(sidenavSort.prop('setSortOption')).to.be.a('function');
  });

  it('passes the default `sortOption` redux state to DetailSideNavSort', () => {
    const sidenavSort = component({ collectionName: LOANS_COLLECTION }).find(DetailSideNavSort);
    expect(sidenavSort.prop('sortOption')).to.equal(defaultSortOption[LOANS_COLLECTION]);
  });

  it('passes the resolved `sortOption` prop to DetailSideNavList', () => {
    const loanSortOption = { field: 'createdAt' };
    const sortOption = { [LOANS_COLLECTION]: loanSortOption };

    const sidenavList = component({
      collectionName: LOANS_COLLECTION,
      sortOption,
    }).find(DetailSideNavList);

    expect(sidenavList.prop('sortOption')).to.deep.equal(loanSortOption);
  });

  it('passes `setFilters` redux action to DetailSideNavFilters', () => {
    const sidenavFilter = component({ collectionName: LOANS_COLLECTION }).find(DetailSideNavFilters);
    expect(sidenavFilter.prop('setFilters')).to.be.a('function');
  });

  it('passes `filters` redux state to DetailSideNavFilters', () => {
    const sidenavFilter = component({ collectionName: LOANS_COLLECTION }).find(DetailSideNavFilters);
    expect(sidenavFilter.prop('filters')).to.deep.equal({});
  });

  it('passes the resolved `filterOptions` prop to DetailSideNavList', () => {
    const loanFilters = [assignedToMeFilterValue];
    const filters = { [LOANS_COLLECTION]: loanFilters };

    const sidenavList = component({
      collectionName: LOANS_COLLECTION,
      filters,
    }).find(DetailSideNavList);

    expect(sidenavList.prop('filterOptions')).to.deep.equal({
      $and: loanFilters,
    });
  });
});
