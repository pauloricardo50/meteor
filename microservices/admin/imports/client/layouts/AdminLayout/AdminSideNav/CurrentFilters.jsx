// @flow
import React from 'react';
import Chip from '@material-ui/core/Chip';

import T from 'core/components/Translation';
import getFilterOptions, {
  getFilterOptionFromValue,
} from './DetailSideNavFilters/filterOptions';

type CurrentFiltersProps = {};

const CurrentFilters = ({
  filterArray,
  setFilters,
  filters,
  ...props
}: CurrentFiltersProps) => {
  console.log('hey');
  if (filterArray.length > 0) {
    return (
      <div className="filter-value">
        <T id="general.filterBy" />
        {': '}
        {filterArray
          .map(filter => ({
            filter,
            label: getFilterOptionFromValue(getFilterOptions(props), filter)
              .label,
          }))
          .map(({ filter, label }) => (
            <Chip key={label} label={label} className="filter-value-chip" />
          ))}
      </div>
    );
  }

  return null;
};

export default CurrentFilters;
