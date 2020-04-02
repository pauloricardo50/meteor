import { Meteor } from 'meteor/meteor';

import React from 'react';
import isEqual from 'lodash/isEqual';

import T from 'core/components/Translation';
import { LOANS_COLLECTION } from 'core/api/loans/loanConstants';
import { USERS_COLLECTION } from 'core/api/users/userConstants';
import {
  PROMOTIONS_COLLECTION,
  PROMOTION_STATUS,
} from 'core/api/promotions/promotionConstants';

const assignedToMeFilter = {
  label: <T id="DetailSideNavFilters.showAssignedToMe" />,
  value: { assignedEmployeeId: Meteor.userId() },
};

const relevantLoansOnlyFilter = {
  label: <T id="DetailSideNavFilters.relevantOnly" />,
  value: { relevantOnly: true },
};

export const appendFilters = (filterArray = []) =>
  filterArray.reduce((filters, filter) => ({ ...filters, ...filter }), {});

const filterIncludedInFilters = (filter, filterArray) =>
  filterArray.find(filterValue => isEqual(filterValue, filter));

export const filterFilterOptionsByValues = (filterOptions, filterArray = []) =>
  filterOptions.filter(({ value }) =>
    filterIncludedInFilters(value, filterArray),
  );

export const getFilterOptionFromValue = (options, filterValue) =>
  options.find(({ value }) => isEqual(value, filterValue));

const loanFilters = [assignedToMeFilter, relevantLoansOnlyFilter];
const userFilters = [assignedToMeFilter];
const promotionFilters = [
  {
    label: 'Actives uniquement',
    value: { status: PROMOTION_STATUS.OPEN },
  },
];

const getFilterOptions = props => {
  const { collectionName } = props;

  return {
    [LOANS_COLLECTION]: loanFilters,
    [USERS_COLLECTION]: userFilters,
    [PROMOTIONS_COLLECTION]: promotionFilters,
  }[collectionName];
};

export const defaultFilterOptions = {
  [LOANS_COLLECTION]: loanFilters.map(({ value }) => value),
  [USERS_COLLECTION]: userFilters.map(({ value }) => value),
  [PROMOTIONS_COLLECTION]: promotionFilters.map(({ value }) => value),
};

export default getFilterOptions;
