import React from 'react';
import PropTypes from 'prop-types';

import TableFilter from './TableFilter';
import { flattenObjectTreeToArrays } from '../../../utils/general';
import filterArrayOfObjects from '../../../utils/filterArrayOfObjects';
import { getFilterKeyFromPath } from './TableFilterContainer';
import TableFiltersContainer from './TableFiltersContainer';

export const TableFilters = ({ data, filters, children, handleOnChange }) => {
  if (Object.keys(filters).length === 0) {
    return null;
  }

  const filteredData = filterArrayOfObjects(filters, data);

  return (
    <React.Fragment>
      <div className="table-filters">
        {flattenObjectTreeToArrays(filters).map(filter => (
          <TableFilter
            key={getFilterKeyFromPath(filter.path)}
            data={data}
            filter={filter}
            onChange={selectedOptions =>
              handleOnChange(filter.path, selectedOptions)
            }
          />
        ))}
      </div>

      {children(filteredData)}
    </React.Fragment>
  );
};

TableFilters.propTypes = {
  data: PropTypes.array.isRequired,
  filters: PropTypes.object,
  children: PropTypes.func.isRequired,
  handleOnChange: PropTypes.func.isRequired,
};

TableFilters.defaultProps = {
  filters: {},
};

export default TableFiltersContainer(TableFilters);
