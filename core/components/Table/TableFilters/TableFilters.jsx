import React from 'react';
import PropTypes from 'prop-types';
import cloneDeep from 'lodash/cloneDeep';
import set from 'lodash/set';
import isEqual from 'lodash/isEqual';

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
class TableFilters extends React.Component {
  constructor(props) {
    super(props);

    const { filters, data } = this.props;
    this.state = { filters, data };
  }

  componentDidUpdate(prevProps) {
    const { filters: currentFiltersProp, data: currentDataProp } = this.props;
    const { filters: oldFiltersProp, data: oldDataProp } = prevProps;

    if (!isEqual(currentDataProp, oldDataProp)) {
      this.setState(() => ({ data: currentDataProp }));
    }

    if (!isEqual(currentFiltersProp, oldFiltersProp)) {
      this.setState(() => ({ filters: currentFiltersProp }));
    }
  }

  handleOnChange = (filterPath, selectedOptions) => {
    const newFilterValue = selectedOptions.map(option => option.value);
    const newFilters = set(
      cloneDeep(this.state.filters),
      filterPath,
      newFilterValue,
    );

    this.setState(() => ({ filters: newFilters }));
  };

  render() {
    const { children } = this.props;
    const { filters, data } = this.state;

    const renderFilters = filters && Object.keys(filters).length > 0;

    return (
      <React.Fragment>
        {renderFilters && (
          <div className="table-filters">
            {flattenObjectTreeToArrays(filters).map(filter => (
              <TableFilter
                key={getFilterKeyFromPath(filter.path)}
                data={data}
                filter={filter}
                onChange={selectedOptions =>
                  this.handleOnChange(filter.path, selectedOptions)
                }
              />
            ))}
          </div>
        )}

        {children(filterArrayOfObjects(filters, data))}
      </React.Fragment>
    );
  }
}

TableFilters.propTypes = {
  data: PropTypes.array.isRequired,
  filters: PropTypes.object,
  children: PropTypes.func.isRequired,
};

TableFilters.defaultProps = {
  filters: {},
};

export default TableFilters;
