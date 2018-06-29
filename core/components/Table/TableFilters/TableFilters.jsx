import React from 'react';
import PropTypes from 'prop-types';

import TableFilter from './TableFilter';
import { flattenObjectTreeToArrays } from '../../../utils/general';
import filterArrayOfObjects from '../../../utils/filterArrayOfObjects';
import { getFilterKeyFromPath } from './TableFilterContainer';
import TableFiltersContainer from './TableFiltersContainer';

/*
 * Flters usage explanation:
 *   - If you use `withTableFilters`, pass the `tableFilters` prop to the
 *     initial component. If you use `<TableFilters />` directly, pass the
 *     `filters` prop to it.
 *   - If you pass `true` or `[]` to a filter, it renders the filter but doesn't
 *     filter the data by default. E.g.: filters={{ name: true }}
 *   - To filter the data by default, pass an array of values to the filter
 *     The data will be filtered by those
 *     values and the filters' UI will be prepopulated with those values. E.g.:
 *     filters={{ name: ["John", "Alex"] }}
 *   - You can filter by nested object and array values,
 *     similar to mongo queries:
 *     E.g.: filters={{ emails: [{address: ["my.email@gmail.com"]}] }} or
 *           filters={{ assignee: { name: true } }}
 */
const TableFilters = ({
  filters: { filters, options },
  data,
  children,
  handleOptionsSelect,
  pickOptionsForFilter,
  renderFilters,
}) => (
  <React.Fragment>
    {renderFilters && (
      <div className="table-filters">
        {flattenObjectTreeToArrays(filters).map(filter => (
          <TableFilter
            key={getFilterKeyFromPath(filter.path)}
            data={data}
            filter={filter}
            value={pickOptionsForFilter(options, filter)}
            onChange={selectedOptions =>
              handleOptionsSelect(filter.path, selectedOptions)
            }
          />
        ))}
      </div>
    )}

    {children(filterArrayOfObjects(filters, data))}
  </React.Fragment>
);

TableFilters.propTypes = {
  children: PropTypes.func.isRequired,
  data: PropTypes.array.isRequired,
  filters: PropTypes.object.isRequired,
  handleOptionsSelect: PropTypes.func.isRequired,
  pickOptionsForFilter: PropTypes.func.isRequired,
  renderFilters: PropTypes.bool.isRequired,
};

export default TableFiltersContainer(TableFilters);
