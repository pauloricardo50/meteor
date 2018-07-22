import React from 'react';
import PropTypes from 'prop-types';

import DropdownMenu from 'core/components/DropdownMenu';
import T from 'core/components/Translation';

import DetailSideNavSortContainer from './DetailSideNavSortContainer';

const DetailSideNavSort = ({ options, handleSort }) => (
  <DropdownMenu
    iconType="sort"
    options={options.map(option => ({
      ...option,
      onClick: () => {
        handleSort(option);
      },
    }))}
    tooltip={<T id="general.sortBy" />}
  />
);

DetailSideNavSort.propTypes = {
  handleSort: PropTypes.func.isRequired,
  options: PropTypes.array.isRequired,
};

export default DetailSideNavSortContainer(DetailSideNavSort);
