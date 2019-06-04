import React from 'react';

import T from 'core/components/Translation';
import {
  BORROWERS_COLLECTION,
  LOANS_COLLECTION,
  USERS_COLLECTION,
  PROPERTIES_COLLECTION,
  PROMOTIONS_COLLECTION,
} from 'core/api/constants';
import { CONTACTS_COLLECTION } from 'imports/core/api/constants';

const createdAtSortOption = {
  label: <T id="TasksTable.createdAt" />,
  value: {
    field: 'createdAt',
    order: -1,
  },
};

const updateAtSortOption = {
  label: <T id="TasksTable.updatedAt" />,
  value: {
    field: 'updatedAt',
    order: -1,
  },
};

const loanSortOptions = [createdAtSortOption, updateAtSortOption];

const borrowerSortOptions = [createdAtSortOption, updateAtSortOption];

const userSortOptions = [createdAtSortOption, updateAtSortOption];

const propertySortOptions = [createdAtSortOption, updateAtSortOption];

const promotionSortOptions = [createdAtSortOption, updateAtSortOption];

const contactsSortOptions = [createdAtSortOption, updateAtSortOption];

const sortOptions = {
  [LOANS_COLLECTION]: loanSortOptions,
  [BORROWERS_COLLECTION]: borrowerSortOptions,
  [USERS_COLLECTION]: userSortOptions,
  [PROPERTIES_COLLECTION]: propertySortOptions,
  [PROMOTIONS_COLLECTION]: promotionSortOptions,
  [CONTACTS_COLLECTION]: contactsSortOptions,
};

export const defaultSortOption = {
  [LOANS_COLLECTION]: createdAtSortOption.value,
  [BORROWERS_COLLECTION]: createdAtSortOption.value,
  [USERS_COLLECTION]: createdAtSortOption.value,
  [PROPERTIES_COLLECTION]: createdAtSortOption.value,
  [PROMOTIONS_COLLECTION]: createdAtSortOption.value,
  [CONTACTS_COLLECTION]: createdAtSortOption.value,
};

export const getSortOptionFromField = (options, fieldName) =>
  options.find(({ value }) => value.field === fieldName);

export default sortOptions;
