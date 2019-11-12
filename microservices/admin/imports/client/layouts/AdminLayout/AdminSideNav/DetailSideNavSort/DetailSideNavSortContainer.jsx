import React from 'react';
import { withProps } from 'recompose';

import Icon from 'core/components/Icon';

import sortOptions, { getSortOptionFromField } from './sortOptions';

const renderOrderIcon = order => (
  <Icon type={order === 1 ? 'arrowUp' : 'arrowDown'} />
);

const mapOptions = (options, currentSortOption) =>
  options.map(({ label, value: { field } }) => ({
    id: field,
    label: (
      <span style={{ display: 'flex', alignItems: 'center' }}>
        {label}
        {currentSortOption && currentSortOption.field === field
          ? renderOrderIcon(currentSortOption.order)
          : null}
      </span>
    ),
  }));

const getReversedSortOrder = order => order * -1;

export default withProps(({ collectionName, sortOption, setSortOption }) => ({
  handleSort: newOption => {
    const selectedOption = getSortOptionFromField(
      sortOptions[collectionName],
      newOption.id,
    );
    const order =
      selectedOption.value.field === sortOption.field
        ? getReversedSortOrder(sortOption.order)
        : -1;

    setSortOption(collectionName, {
      ...selectedOption.value,
      order,
    });
  },
  options: mapOptions(sortOptions[collectionName], sortOption),
}));
