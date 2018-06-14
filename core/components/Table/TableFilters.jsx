import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';

import uniqBy from 'lodash/uniqBy';
import get from 'lodash/get';
import set from 'lodash/set';

import { flattenObjectTree } from '../../utils/general';
import {
  filterArrayOfObjects,
  isEmptyFilterValue,
} from '../../utils/filteringFunctions';

class TableFilters extends Component {
  constructor(props) {
    super(props);

    console.log('DATA=', props.data);

    this.state = {
      filters: this.props.filters,
    };
  }

  getSelectOptions(filterValue) {
    return isEmptyFilterValue(filterValue)
      ? []
      : filterValue.map(this.getSelectOption, this);
  }

  getSelectOption(value) {
    return {
      label: this.getSelectOptionLabel(value),
      value,
    };
  }

  // TODO: here, get the translation of the value and of "None"
  getSelectOptionLabel(value) {
    return value || 'None';
  }

  createSelectOptionsForColumn(filterPath, data) {
    const options = data.map((item) => {
      const itemValue = get(item, filterPath);
      return this.getSelectOption(itemValue);
    });

    return uniqBy(options, option => option.value);
  }

  makeHandleFiltersChanged = filterPath => (newSelectOptions) => {
    console.log('HandleFiltersChanged', filterPath, newSelectOptions);

    const { filters } = this.state;
    const newFilterValues = newSelectOptions.map(option => option.value);

    const newFilters = set(filters, filterPath, newFilterValues);
    this.setState({ filters: newFilters });
  };

  render() {
    const { data } = this.props;
    const { filters } = this.state;
    const filteredData = filterArrayOfObjects(filters, data);

    return (
      <React.Fragment>
        <div>
          {flattenObjectTree(filters).map(({ path: filterPath, value }) => {
            const filterKey = filterPath.join('.');

            return (
              <div key={filterKey}>
                <span>{filterKey}:&nbsp;</span>
                <Select
                  multi
                  onChange={this.makeHandleFiltersChanged(filterPath)}
                  options={this.createSelectOptionsForColumn(filterPath, data)}
                  placeholder={`Filter by ${filterKey}`}
                  simpleValue={false}
                  value={this.getSelectOptions(value)}
                />
              </div>
            );
          })}
        </div>

        {this.props.children(filteredData)}
      </React.Fragment>
    );
  }
}

TableFilters.propTypes = {
  data: PropTypes.array.isRequired,
  children: PropTypes.func.isRequired,
  filters: PropTypes.object,
};

TableFilters.defaultProps = {
  filters: {},
};

export default TableFilters;
