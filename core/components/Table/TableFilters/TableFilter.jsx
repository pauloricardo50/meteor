import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';

import T from '../../Translation';
import TableFilterContainer from './TableFilterContainer';

const TableFilter = ({ filterKey, onChange, options, value }) => (
  <div className="table-filter">
    <div className="table-filter-label">
      <T id={`TableFilters.filterLabels.${filterKey}`} />
    </div>
    <Select
      multi
      onChange={onChange}
      options={options}
      placeholder={`Filter by ${filterKey}`}
      simpleValue={false}
      value={value}
    />
  </div>
);

TableFilter.propTypes = {
  filterKey: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.array.isRequired,
  value: PropTypes.array.isRequired,
};

export default TableFilterContainer(TableFilter);
