import React from 'react';
import PropTypes from 'prop-types';

import T from '../../Translation';
import TableFilterContainer from './TableFilterContainer';

const TableFilter = ({
  filterKey,
  onChange,
  options,
  loadOptions,
  value,
  SelectComponent,
}) => (
  <div className="table-filter">
    <label htmlFor="filterKey" className="table-filter-label">
      <T id={`TableFilters.filterLabels.${filterKey}`} />
    </label>
    <SelectComponent
      id={filterKey}
      multi
      onChange={onChange}
      options={options}
      loadOptions={loadOptions}
      placeholder={(
        <span>
          Filtrer par <T id={`TableFilters.filterLabels.${filterKey}`} />
        </span>
      )}
      simpleValue={false}
      value={value}
      noResultsText={null}
    />
  </div>
);

TableFilter.propTypes = {
  filterKey: PropTypes.string.isRequired,
  loadOptions: PropTypes.func,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.array.isRequired,
  SelectComponent: PropTypes.any.isRequired,
  value: PropTypes.array.isRequired,
};

export default TableFilterContainer(TableFilter);
