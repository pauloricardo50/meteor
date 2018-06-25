import React from 'react';
import PropTypes from 'prop-types';

import DropdownSelect from 'core/components/DropdownSelect';
import T from 'core/components/Translation';

import DetailSideNavFiltersContainer from './DetailSideNavFiltersContainer';

// TODO: put logic in container
const DetailSideNavFilters = ({ options, selectedOptions, handleChange }) => (
  <DropdownSelect
    selectedOptions={selectedOptions}
    options={options}
    onChange={handleChange}
    iconType="filter"
    tooltip={<T id="general.filterBy" />}
  />
);

DetailSideNavFilters.propTypes = {
  options: PropTypes.array.isRequired,
  handleChange: PropTypes.func.isRequired,
  selectedOptions: PropTypes.array,
};

DetailSideNavFilters.defaultProps = {
  selectedOptions: [],
};

export default DetailSideNavFiltersContainer(DetailSideNavFilters);
