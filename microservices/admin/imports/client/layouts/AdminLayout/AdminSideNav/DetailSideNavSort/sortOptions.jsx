import React from 'react';

import T from 'core/components/Translation';
import {
  BORROWERS_COLLECTION,
  LOANS_COLLECTION,
  USERS_COLLECTION,
} from 'core/api/constants';
import { ORDER } from 'core/utils/sortArrayOfObjects';

const createdAtSortOption = {
  label: <T id="TasksTable.createdAt" />,
  value: {
    field: 'createdAt',
    order: ORDER.DESC,
  },
};

const updateAtSortOption = {
  label: <T id="TasksTable.updatedAt" />,
  value: {
    field: 'updatedAt',
    order: ORDER.DESC,
  },
};

const loansSortOptions = [createdAtSortOption, updateAtSortOption];

const borrowersSortOptions = [createdAtSortOption, updateAtSortOption];

const usersSortOptions = [createdAtSortOption, updateAtSortOption];

const sortOptions = {
  [LOANS_COLLECTION]: loansSortOptions,
  [BORROWERS_COLLECTION]: borrowersSortOptions,
  [USERS_COLLECTION]: usersSortOptions,
};

export const defaultSortOption = {
  [LOANS_COLLECTION]: createdAtSortOption.value,
  [BORROWERS_COLLECTION]: createdAtSortOption.value,
  [USERS_COLLECTION]: createdAtSortOption.value,
};

export const getSortOptionFromField = (options, fieldName) =>
  options.find(({ value }) => value.field === fieldName);

export default sortOptions;
