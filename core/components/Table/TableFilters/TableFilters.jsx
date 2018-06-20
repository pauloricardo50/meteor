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

class TableFilters extends React.Component {
  constructor(props) {
    super(props);

    const { filters, data } = this.props;
    this.state = { filters, data };
  }

  // this is called on every render with the prevState being my current state!
  // WHY with current state??
  // of course they're different!
  // static getDerivedStateFromProps(nextProps, prevState) {
  //   if (
  //     !isEqual(nextProps.filters, prevState.filters) ||
  //     !isEqual(nextProps.data, prevState.data)
  //   ) {
  //     console.log(
  //       'getDSFP updates state',
  //       nextProps.filters,
  //       prevState.filters,
  //     );
  //     return { filters: nextProps.filters, data: nextProps.data };
  //   }

  //   return null;
  // }

  componentDidUpdate(prevProps) {
    const { filters: currentFiltersProp, data: currentDataProp } = this.props;
    const { filters: oldFiltersProp, data: oldDataProp } = prevProps;

    if (!isEqual(currentDataProp, oldDataProp)) {
      this.setState({ data: currentDataProp });
    }

    if (!isEqual(currentFiltersProp, oldFiltersProp)) {
      this.setState({ filters: currentFiltersProp });
    }
  }

  handleOnChange = (filterPath, selectedOptions) => {
    const newFilterValue = selectedOptions.map(option => option.value);
    const newFilters = set(
      cloneDeep(this.state.filters),
      filterPath,
      newFilterValue,
    );

    this.setState({ filters: newFilters });
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
