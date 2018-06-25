import React from 'react';
import { withProps } from 'recompose';

import Icon from 'core/components/Icon';
import { ORDER } from 'core/utils/sortArray';

import sortOptions, { getSortOptionFromField } from './sortOptions';

const renderOrderIcon = order => (
  <Icon type={order === ORDER.ASC ? 'up' : 'down'} />
);

const mapOptions = (options, currentSortOption) =>
  options.map(({ label, value }) => ({
    id: value.field,
    label: (
      <React.Fragment>
        {label}
        {currentSortOption.field === value.field
          ? renderOrderIcon(currentSortOption.order)
          : null}
      </React.Fragment>
    ),
  }));

const getReversedSortOrder = order =>
  (order === ORDER.ASC ? ORDER.DESC : ORDER.ASC);

export default withProps(({ collectionName, sortOption, setSortOption }) => ({
  handleSort: (newOption) => {
    const selectedOption = getSortOptionFromField(
      sortOptions[collectionName],
      newOption.id,
    );
    const order =
      selectedOption.value.field === sortOption.field
        ? getReversedSortOrder(sortOption.order)
        : ORDER.ASC;

    setSortOption(collectionName, {
      ...selectedOption.value,
      order,
    });
  },
  options: mapOptions(sortOptions[collectionName], sortOption),
}));
