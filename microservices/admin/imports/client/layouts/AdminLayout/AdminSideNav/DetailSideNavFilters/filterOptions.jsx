import React from 'react';
import isEqual from 'lodash/isEqual';

import T from 'core/components/Translation';
import {
  BORROWERS_COLLECTION,
  LOANS_COLLECTION,
  USERS_COLLECTION,
  PROPERTIES_COLLECTION,
  PROMOTIONS_COLLECTION,
  CONTACTS_COLLECTION,
} from 'core/api/constants';
import { Meteor } from 'meteor/meteor';

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
    filterIncludedInFilters(value, filterArray));

export const getFilterOptionFromValue = (options, filterValue) =>
  options.find(({ value }) => isEqual(value, filterValue));

const loanFilters = [assignedToMeFilter, relevantLoansOnlyFilter];
const userFilters = [assignedToMeFilter];

const getFilterOptions = (props) => {
  const { collectionName } = props;

  return {
    [LOANS_COLLECTION]: loanFilters,
    [BORROWERS_COLLECTION]: [],
    [USERS_COLLECTION]: userFilters,
    [PROPERTIES_COLLECTION]: [],
    [PROMOTIONS_COLLECTION]: [],
    [CONTACTS_COLLECTION]: [],
  }[collectionName];
};

export const defaultFilterOptions = {
  [LOANS_COLLECTION]: loanFilters.map(({ value }) => value),
  [BORROWERS_COLLECTION]: [],
  [USERS_COLLECTION]: userFilters.map(({ value }) => value),
  [PROPERTIES_COLLECTION]: [],
  [PROMOTIONS_COLLECTION]: [],
  [CONTACTS_COLLECTION]: [],
};

export default getFilterOptions;
