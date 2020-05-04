import React from 'react';

import { LOANS_COLLECTION } from 'core/api/loans/loanConstants';
import { PROMOTIONS_COLLECTION } from 'core/api/promotions/promotionConstants';
import { USERS_COLLECTION } from 'core/api/users/userConstants';
import T from 'core/components/Translation';

const createdAtSortOption = {
  label: <T id="TasksTable.createdAt" />,
  value: { field: 'createdAt', order: -1 },
};

const updateAtSortOption = {
  label: <T id="TasksTable.updatedAt" />,
  value: { field: 'updatedAt', order: -1 },
};

const loanSortOptions = [createdAtSortOption, updateAtSortOption];

const userSortOptions = [createdAtSortOption, updateAtSortOption];

const promotionSortOptions = [createdAtSortOption, updateAtSortOption];

const sortOptions = {
  [LOANS_COLLECTION]: loanSortOptions,
  [USERS_COLLECTION]: userSortOptions,
  [PROMOTIONS_COLLECTION]: promotionSortOptions,
};

export const defaultSortOption = {
  [LOANS_COLLECTION]: createdAtSortOption.value,
  [USERS_COLLECTION]: createdAtSortOption.value,
  [PROMOTIONS_COLLECTION]: createdAtSortOption.value,
};

export const getSortOptionFromField = (options, fieldName) =>
  options.find(({ value }) => value.field === fieldName);

export default sortOptions;
