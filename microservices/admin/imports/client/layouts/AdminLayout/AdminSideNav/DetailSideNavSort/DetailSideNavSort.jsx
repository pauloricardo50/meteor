import React from 'react';
import PropTypes from 'prop-types';

import DropdownMenu from 'core/components/DropdownMenu';
import T from 'core/components/Translation';

import DetailSideNavSortContainer from './DetailSideNavSortContainer';

const DetailSideNavSort = ({ options, handleSort }) => (
  <DropdownMenu
    iconType="sort"
    options={options.map((option, index) => ({
      ...option,
      onClick: () => {
        handleSort(index);
      },
    }))}
    tooltip={<T id="general.sortBy" />}
  />
);

DetailSideNavSort.propTypes = {
  options: PropTypes.array.isRequired,
  handleSort: PropTypes.func.isRequired,
};

export default DetailSideNavSortContainer(DetailSideNavSort);
