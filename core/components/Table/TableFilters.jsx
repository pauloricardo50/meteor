import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import uniqBy from 'lodash/uniqBy';
import get from 'lodash/get';
import set from 'lodash/set';

import T from '../Translation';
import { flattenObjectTree } from '../../utils/general';
import {
  filterArrayOfObjects,
  isEmptyFilterValue,
} from '../../utils/filteringFunctions';

class TableFilters extends Component {
  constructor(props) {
    super(props);

    this.state = {
      filters: this.props.filters,
    };
  }

  getSelectOptions = (filterValue, filterPath) =>
    (isEmptyFilterValue(filterValue)
      ? []
      : filterValue.map(value => this.getSelectOption(value, filterPath)));

  getSelectOption = (value, filterPath) => ({
    label: this.getSelectOptionLabel(value, filterPath),
    value,
  });

  // Translate the label when it should be translated
  getSelectOptionLabel = (value, filterPath) => {
    if (!value) {
      return <T id="TableFilters.none" />;
    }

    return this.getTranslationOfValueForPath(value, filterPath) || value;
  };

  getTranslationOfValueForPath = (value, filterPath) => {
    const lastKey = filterPath[filterPath.length - 1];
    const filterKey = this.getFilterKeyFromPath(filterPath);

    const translationId =
      filterKey === 'type' && `TasksStatusDropdown.${value}`;

    if (!translationId) {
      return null;
    }

    return <T id={translationId} />;
  };

  getFilterKeyFromPath = filterPath => filterPath.join('.');

  createSelectOptionsForColumn = (filterPath, data) => {
    const options = data.map((item) => {
      const itemValue = get(item, filterPath);
      return this.getSelectOption(itemValue, filterPath);
    });

    return uniqBy(options, option => option.value);
  };

  makeHandleFiltersChanged = filterPath => (newSelectOptions) => {
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
        <div className="table-filters">
          {flattenObjectTree(filters).map(({ path: filterPath, value }) => {
            const filterKey = this.getFilterKeyFromPath(filterPath);

            return (
              <div className="table-filter" key={filterKey}>
                <div className="table-filter-label">
                  <T id={`TableFilters.filterLabels.${filterKey}`} />
                </div>
                <Select
                  multi
                  onChange={this.makeHandleFiltersChanged(filterPath)}
                  options={this.createSelectOptionsForColumn(filterPath, data)}
                  placeholder={`Filter by ${filterKey}`}
                  simpleValue={false}
                  value={this.getSelectOptions(value, filterPath)}
                  inputProps={{ class: 'table-filter-input' }}
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
