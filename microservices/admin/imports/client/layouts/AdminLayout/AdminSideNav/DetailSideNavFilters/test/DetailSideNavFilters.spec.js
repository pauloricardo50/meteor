/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';

import { shallow } from 'core/utils/testHelpers/enzyme';
import T from 'core/components/Translation';
import DropdownSelect from 'core/components/DropdownSelect';
import {
  LOANS_COLLECTION,
  BORROWERS_COLLECTION,
  USERS_COLLECTION,
} from 'core/api/constants';

import DetailSideNavFilters from '../DetailSideNavFilters';

const setFilters = sinon.spy();
const renderDropdownSelect = (collectionName, additionalProps) => {
  const props = {
    currentUser: { emails: [{ address: 'admin@test.com' }] },
    collectionName,
    setFilters,
    filters: {},
    ...additionalProps,
  };

  return shallow(<DetailSideNavFilters {...props} />)
    .dive()
    .find(DropdownSelect)
    .first();
};

// test correct options are passed√
// test correct action on click
// test correct action on deselect
// test correct action on selected 2 items

describe('DetailSideNavFilters', () => {
  [LOANS_COLLECTION, BORROWERS_COLLECTION, USERS_COLLECTION].forEach((collectionName) => {
    describe(`for ${collectionName} collection`, () => {
      it(`should pass the 'Show assigned to me' filter
          option to DropdownMenu component`, () => {
        const menuOptions = renderDropdownSelect(collectionName).prop('options');

        const assignedToMeFilter = {
          'user.assignedEmployee.emails': {
            $elemMatch: { address: 'admin@test.com' },
          },
        };

        expect(menuOptions[0].value).to.deep.equal(assignedToMeFilter);
        expect(shallow(menuOptions[0].label).prop('id')).to.equal('DetailSideNavFilters.showAssignedToMe');
      });
    });
  });

  it(`should run the setFilters redux action with the correct params
      when the filter options change`, () => {
    const handleDropdownChange = renderDropdownSelect('loans').prop('onChange');

    const filter1Value = { assigned: true };
    const filter2Value = { color: { $in: ['red', 'greeb'] } };
    const selectedOptions = [
      { label: <T id="someLabel1" />, value: filter1Value },
      { label: <T id="someLabel2" />, value: filter2Value },
    ];
    handleDropdownChange(selectedOptions);

    expect(setFilters.lastCall.args).to.deep.equal([
      'loans',
      [filter1Value, filter2Value],
    ]);
  });
});
