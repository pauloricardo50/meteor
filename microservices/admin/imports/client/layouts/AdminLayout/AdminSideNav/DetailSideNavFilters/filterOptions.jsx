import React from 'react';
import isEqual from 'lodash/isEqual';

import T from 'core/components/Translation';
import {
  BORROWERS_COLLECTION,
  LOANS_COLLECTION,
  USERS_COLLECTION,
} from 'core/api/constants';

const getAssignedToMeFilter = ({
  currentUser: {
    emails: [{ address: currentUserEmail }],
  },
}) => ({
  label: <T id="DetailSideNavFilters.showAssignedToMe" />,
  value: {
    $or: [
      {
        'user.assignedEmployee.emails': {
          $elemMatch: { address: currentUserEmail },
        },
      },

      {
        'assignedEmployee.emails': {
          $elemMatch: { address: currentUserEmail },
        },
      },
    ],
  },
});

export const appendFilters = filterArray =>
  (filterArray ? { $and: filterArray } : {});

const filterIncludedInFilters = (filter, filterArray) =>
  filterArray.find(filterValue => isEqual(filterValue, filter));

export const filterFilterOptionsByValues = (filterOptions, filterArray = []) =>
  filterOptions.filter(({ value }) =>
    filterIncludedInFilters(value, filterArray));

export const getFilterOptionFromValue = (options, filterValue) =>
  options.find(({ value }) => isEqual(value, filterValue));

const getFilterOptions = (props) => {
  const { collectionName } = props;

  const loanFilters = [getAssignedToMeFilter(props)];

  const borrowerFilters = [getAssignedToMeFilter(props)];

  const userFilters = [getAssignedToMeFilter(props)];

  return {
    [LOANS_COLLECTION]: loanFilters,
    [BORROWERS_COLLECTION]: borrowerFilters,
    [USERS_COLLECTION]: userFilters,
  }[collectionName];
};

export default getFilterOptions;
