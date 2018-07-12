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
    <div className="table-filter-label">
      <T id={`TableFilters.filterLabels.${filterKey}`} />
    </div>
    <SelectComponent
      multi
      onChange={onChange}
      options={options}
      loadOptions={loadOptions}
      placeholder={`Filter by ${filterKey}`}
      simpleValue={false}
      value={value}
      noResultsText={null}
    />
  </div>
);

TableFilter.propTypes = {
  filterKey: PropTypes.string.isRequired,
  loadOptions: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.array.isRequired,
  SelectComponent: PropTypes.instanceOf(React.Component).isRequired,
  value: PropTypes.array.isRequired,
};

export default TableFilterContainer(TableFilter);
