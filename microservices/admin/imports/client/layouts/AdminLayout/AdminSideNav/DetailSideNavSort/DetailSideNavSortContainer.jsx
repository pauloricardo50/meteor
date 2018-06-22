import React from 'react';

import { compose, withStateHandlers, withProps } from 'recompose';
import set from 'lodash/set';
import cloneDeep from 'lodash/cloneDeep';
import merge from 'lodash/merge';

import T from 'core/components/Translation';
import Icon from 'core/components/Icon';

const initialSortingOptions = [
  {
    label: <T id="TasksTable.createdAt" />,
    value: {
      field: 'createdAt',
    },
  },

  {
    label: <T id="TasksTable.updatedAt" />,
    value: {
      field: 'updatedAt',
    },
  },

  {
    label: 'Name',
    value: {
      field: 'name',
    },
  },
];

const renderOrderIcon = order => (
  <Icon type={order === 'asc' ? 'up' : 'down'} />
);

const mapOptions = sortingOptions =>
  sortingOptions.map(({ label, value: { field, order }, selected }) => ({
    id: field,
    label: (
      <React.Fragment>
        {label}
        {selected ? renderOrderIcon(order) : null}
      </React.Fragment>
    ),
  }));

const toggleSortOrder = (sortingOptions, optionIndex) => {
  const optionPath = [optionIndex, 'value', 'order'];
  const currentOrder = sortingOptions[optionIndex].value.order;
  const newOrder = currentOrder === 'asc' ? 'desc' : 'asc';

  return set(cloneDeep(sortingOptions), optionPath, newOrder);
};

const selectOption = (sortOptions, selectedIndex) =>
  sortOptions.map((option, optionIndex) => {
    const selected = optionIndex === selectedIndex;
    // every time we select an option we reset
    // the sort order of the other options
    const newSortOrder = selected
      ? option.value.order
      : initialSortingOptions[optionIndex].value.order;

    return merge({}, option, {
      value: {
        order: newSortOrder,
      },
      selected,
    });
  });

const toggleOption = (sortingOptions, optionIndex) => {
  const newOptions = selectOption(sortingOptions, optionIndex);
  return toggleSortOrder(newOptions, optionIndex);
};

const withState = withStateHandlers(
  ({ sortOptions }) => {
    const defaultOptionIndex = initialSortingOptions.findIndex(({ value: { field } }) => field === sortOptions.field);

    console.log('>>>', defaultOptionIndex, sortOptions);

    let initialOptions = initialSortingOptions;

    if (defaultOptionIndex !== -1) {
      initialOptions = cloneDeep(initialSortingOptions);
      // merge the predefined option and then select it
      initialOptions[defaultOptionIndex] = merge(
        {},
        initialOptions[defaultOptionIndex],
        {
          value: sortOptions,
        },
      );
      initialOptions = selectOption(initialOptions, defaultOptionIndex);
    }

    return { sortingOptions: initialOptions };
  },

  {
    updateSortOptions: () => newOptions => ({
      sortingOptions: newOptions,
    }),
  },
);

export default compose(
  withState,
  withProps(({ sortingOptions, onChange, updateSortOptions }) => ({
    handleSort: (optionIndex) => {
      const newOptions = toggleOption(sortingOptions, optionIndex);
      onChange(newOptions[optionIndex].value);
      updateSortOptions(newOptions);
    },
    options: mapOptions(sortingOptions),
  })),
);
