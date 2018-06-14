import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';

import uniqBy from 'lodash/uniqBy';
import get from 'lodash/get';
import set from 'lodash/set';
import isArray from 'lodash/isArray';
import flatten from 'lodash/flatten';
import intersection from 'lodash/intersection';

import { flattenObject } from '../../utils/general';

class TableFilters extends Component {
  constructor(props) {
    super(props);

    console.log('DATA=', props.data);

    this.state = {
      filters: this.props.filters,
    };
  }

  filterData(filters, data) {
    // select only the filters have values in them
    const nonEmptyFilters = this.getNonEmptyFlattenedFilters(filters);

    // check a data item matches all filters
    const itemMatchesAllFilters = dataItem =>
      nonEmptyFilters.every(({ path, value }) => {
        const itemValue = get(dataItem, path);
        return value.includes(itemValue)
      });

    return data.filter(itemMatchesAllFilters);
  }

  createSelectOptionsForColumn(filterPath, data) {
    const options = data.map((item) => {
      const itemValue = get(item, filterPath);
      // const normalizedValue = this.normalizeFieldValue(itemValue);
      return this.getSelectOption(itemValue);
    });

    return uniqBy(options, option => option.value);
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

  getFlattenedFilters(filters) {
    console.log(flattenObject(filters));
    return flattenObject(filters)
  }

  getNonEmptyFlattenedFilters(filters) {
    return this.getFlattenedFilters(filters).filter(({ value }) => !this.isEmptyFilterValue(value))
  }
  
  isEmptyFilterValue(filterValue) {
    return !isArray(filterValue) || filterValue.length === 0;
  }

  makeHandleFiltersChanged = filterPath => (newSelectOptions) => {
    console.log('HandleFiltersChanged', filterPath, newSelectOptions);

    const { filters } = this.state;
    const newFilterValues = newSelectOptions.map(option => option.value);

    const newFilters = set(filters, filterPath, newFilterValues)
    this.setState({ filters: newFilters });
  };

  render() {
    const { data } = this.props;
    const { filters } = this.state;
    const filteredData = this.filterData(filters, data);

    return (
      <React.Fragment>
        <div>
          {this.getFlattenedFilters(filters).map(({ path: filterPath, value }) => {
            const filterKey = filterPath.join('.');
            const defaultSelectOptions =
              this.isEmptyFilterValue(value) ?
              [] :
              value.map(this.getSelectOption, this);

            return (
              <div key={filterKey}>
                <span>{filterKey}:&nbsp;</span>
                <Select
                  multi
                  onChange={this.makeHandleFiltersChanged(filterPath)}
                  options={this.createSelectOptionsForColumn(filterPath, data)}
                  placeholder={`Filter by ${filterKey}`}
                  simpleValue={false}
                  value={defaultSelectOptions}
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
