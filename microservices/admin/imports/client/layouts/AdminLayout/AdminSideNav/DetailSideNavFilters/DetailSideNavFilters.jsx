import React from 'react';
import PropTypes from 'prop-types';

import DropdownSelect from 'core/components/DropdownSelect';
import T from 'core/components/Translation';

import DetailSideNavFiltersContainer from './DetailSideNavFiltersContainer';

const DetailSideNavFilters = ({ options = [], selected, handleChange }) =>
  (options.length ? (
    <DropdownSelect
      selected={selected}
      options={options}
      onChange={handleChange}
      iconType="filter"
      tooltip={<T id="general.filterBy" />}
    />
  ) : (
    <span style={{ width: 48, height: 48 }} />
  ));

DetailSideNavFilters.propTypes = {
  handleChange: PropTypes.func.isRequired,
  options: PropTypes.array.isRequired,
  selected: PropTypes.array,
};

DetailSideNavFilters.defaultProps = {
  selected: [],
};

export default DetailSideNavFiltersContainer(DetailSideNavFilters);
