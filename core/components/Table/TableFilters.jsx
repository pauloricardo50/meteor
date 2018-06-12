import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import uniqBy from 'lodash/uniqBy';

class TableFilters extends Component {
  constructor(props) {
    super(props);

    console.log('DATA=', props.data);

    this.state = {
      filters: this.props.filters,
    };
  }

  // 1. filters the data with the new filters
  // 2. sets the filtered data and the new filters in the state
  makeHandleFiltersChanged = column => (selectedColumnOptions) => {
    console.log('HandleFiltersChanged', column, selectedColumnOptions);

    const { filters } = this.state;

    const newFilters = {
      ...filters,
      [column]: selectedColumnOptions.map(option => option.value),
    };

    this.setState({ filters: newFilters });
  };

  filterData(filters, data) {
    // select only the filters wnich have values in them
    const filterColumns = Object.keys(filters).filter(column => filters[column].length > 0);

    // the comparison is made only by strings, to solve issues such as dates
    // of which values are in ms but are displayed as the same string (in the dates
    // case we basically select a range of them which is pretty convenient)
    const itemMatchesAllFilters = dataItem =>
      filterColumns.every((column) => {
        const dataItemValue = this.normalizeFieldValue(dataItem[column]);
        return filters[column].includes(dataItemValue);
      });

    return data.filter(itemMatchesAllFilters);
  }

  createSelectOptionsForColumn(column, data) {
    const options = data.map((item) => {
      const normalizedValue = this.normalizeFieldValue(item[column]);
      return this.getSelectOption(normalizedValue);
    });

    return uniqBy(options, option => option.value);
  }

  getSelectOption(value) {
    return {
      label: this.getSelectOptionLabel(value),
      value,
    };
  }

  normalizeFieldValue(value) {
    if (value && value.constructor === Date) {
      return value.toString();
    }

    return value;
  }

  // TODO: here, get the eventual translation of the value and of "None"
  getSelectOptionLabel(itemValue) {
    return itemValue || 'None';
  }

  render() {
    const { data } = this.props;
    const { filters } = this.state;
    const filteredData = this.filterData(filters, data);

    return (
      <React.Fragment>
        <div>
          {Object.keys(filters).map(column => (
            <div key={column}>
              <span>{column}:&nbsp;</span>
              <Select
                multi
                onChange={this.makeHandleFiltersChanged(column)}
                options={this.createSelectOptionsForColumn(column, data)}
                placeholder={`Filter by ${column}`}
                simpleValue={false}
                value={filters[column].map(this.getSelectOption, this)}
              />
            </div>
          ))}
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
