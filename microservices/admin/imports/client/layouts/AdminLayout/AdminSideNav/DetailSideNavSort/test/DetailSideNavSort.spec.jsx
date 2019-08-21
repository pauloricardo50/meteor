/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';

import { shallow } from 'core/utils/testHelpers/enzyme';
import T from 'core/components/Translation';
import DropdownMenu from 'core/components/DropdownMenu';
import { LOANS_COLLECTION, USERS_COLLECTION } from 'core/api/constants';
import { ORDER } from 'core/utils/sortArrayOfObjects';

import DetailSideNavSort from '../DetailSideNavSort';

const component = props => shallow(<DetailSideNavSort {...props} />);

const getTranslationId = parentNode =>
  shallow(parentNode)
    .find(T)
    .first()
    .prop('id');

const setSortOption = sinon.spy();
const renderDropdownMenu = (collectionName) => {
  const props = {
    collectionName,
    setSortOption,
    sortOption: { field: 'createdAt', order: ORDER.DESC },
  };

  return component(props)
    .dive()
    .find(DropdownMenu)
    .first();
};

describe('DetailSideNavSort', () => {
  let menuOptions;

  beforeEach(() => {
    menuOptions = renderDropdownMenu(LOANS_COLLECTION).prop('options');
  });

  [LOANS_COLLECTION, USERS_COLLECTION].forEach((collectionName) => {
    describe(`for ${collectionName} collection`, () => {
      it(`should pass the created and updated at
      sort options to DropdownMenu component`, () => {
        menuOptions = renderDropdownMenu(collectionName).prop('options');

        expect(menuOptions[0].id).to.equal('createdAt');
        expect(getTranslationId(menuOptions[0].label)).to.equal('TasksTable.createdAt');

        expect(menuOptions[1].id).to.equal('updatedAt');
        expect(getTranslationId(menuOptions[1].label)).to.equal('TasksTable.updatedAt');
      });
    });
  });

  it.skip(`should call setSortOption redux action with the correct sort field & order
      when clicking a new sort option in the DropdownMenu`, () => {
    const handleClickSortByUpdatedAt = menuOptions[1].onClick;
    handleClickSortByUpdatedAt();

    const expectedActionParams = [
      'loans',
      {
        field: 'updatedAt',
        order: ORDER.ASC,
      },
    ];
    expect(setSortOption.lastCall.args).to.deep.equal(expectedActionParams);
  });

  it.skip(`should call setSortOption redux action with the DESC sort order when 
      previous sort order was ASC on that field`, () => {
    const dropdownMenu = component({
      collectionName: LOANS_COLLECTION,
      setSortOption,
      sortOption: { field: 'createdAt', order: ORDER.ASC },
    })
      .dive()
      .find(DropdownMenu)
      .first();

    const handleClickSortByCreatedAt = dropdownMenu.prop('options')[0].onClick;
    handleClickSortByCreatedAt();

    const expectedActionParams = [
      'loans',
      {
        field: 'createdAt',
        order: ORDER.DESC,
      },
    ];
    expect(setSortOption.lastCall.args).to.deep.equal(expectedActionParams);
  });
});
