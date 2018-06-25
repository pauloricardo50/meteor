import React from 'react';
import PropTypes from 'prop-types';

import DropdownSelect from 'core/components/DropdownSelect';
import T from 'core/components/Translation';

import DetailSideNavFiltersContainer from './DetailSideNavFiltersContainer';

const DetailSideNavFilters = ({ options, selected, handleChange }) => (
  <DropdownSelect
    selected={selected}
    options={options}
    onChange={handleChange}
    iconType="filter"
    tooltip={<T id="general.filterBy" />}
  />
);

DetailSideNavFilters.propTypes = {
  handleChange: PropTypes.func.isRequired,
  options: PropTypes.array.isRequired,
  selected: PropTypes.array,
};

DetailSideNavFilters.defaultProps = {
  selected: [],
};

export default DetailSideNavFiltersContainer(DetailSideNavFilters);
