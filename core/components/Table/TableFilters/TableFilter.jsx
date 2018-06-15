import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';

import T from '../../Translation';

const TableFilter = ({ filterKey, data, onChange, options, value }) => (
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
      inputProps={{ class: 'table-filter-input' }}
    />
  </div>
);

TableFilter.propTypes = {
  data: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.array.isRequired,
  value: PropTypes.array.isRequired,
  filterKey: PropTypes.string.isRequired,
};

export default TableFilter;
