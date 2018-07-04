import React from 'react';
import PropTypes from 'prop-types';

import TableFilter from './TableFilter';
import { flattenObjectTreeToArrays } from '../../../utils/general';
import filterArrayOfObjects from '../../../utils/filterArrayOfObjects';
import { getFilterKeyFromPath } from './TableFilterContainer';
import TableFiltersContainer from './TableFiltersContainer';

/*
 * Flters usage explanation:
 *   - If you use `withTableFilters` HoC, pass the `tableFilters` prop to the
 *     initial component and the HoC will wrap the initial component with those filters. =
 *   - If you use `<TableFilters />` directly, pass the
 *     `filters` prop to it.
 *   - If you pass `true` or `[]` to a filter, it renders the filter but doesn't
 *     filter the data by default. E.g.: filters={filters: { name: true }}
 *   - To filter the data by default, pass an array of values to the filter
 *     The data will be filtered by those values and the filters' UI will be
 *     prepopulated with those values. E.g.: filters={filters: { name: ["John", "Alex"] }}
 *   - You can filter by nested object and array values,
 *     similar to mongo queries:
 *     E.g.: filters={filters: { emails: [{address: ["my.email@gmail.com"]}] }} or
 *           filters={filters: { assignee: { name: true } }}
 *   - The dropdown options of the filter component are passed in the `options`
 *     of the filter: filters={filters: {name: ['John']}, options: ['John', 'James', 'Alex']}
 *   - Pass an `undefined` option if you want to filter by undefined data values also:
 *     filters={
 *       filters: {name: ['John']},
 *       options: ['John', 'James', 'Alex', undefined]
 *     }
 *     This will make a 'None' option appear which allows the user to filter the
 *     data items where the filtered field is undefined.
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
