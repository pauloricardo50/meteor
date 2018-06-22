import React from 'react';
import PropTypes from 'prop-types';

import DetailSideNavHeader from './DetailSideNavHeader';
import DetailSideNavList from './DetailSideNavList';
import DetailSideNavContainer from './DetailSideNavContainer';

const DetailSideNav = (props) => {
  const { handleSorting, handleFiltering, filterOptions, sortOptions } = props;

  return (
    <div className="detail-side-nav">
      <DetailSideNavHeader
        {...props}
        onSort={handleSorting}
        sortOptions={sortOptions}
        onFilter={handleFiltering}
      />
      <DetailSideNavList
        {...props}
        filterOptions={filterOptions}
        sortOptions={sortOptions}
      />
    </div>
  );
};

DetailSideNav.propTypes = {
  handleSorting: PropTypes.func,
  handleFiltering: PropTypes.func,
  filterOptions: PropTypes.object,
  sortOptions: PropTypes.object,
};

DetailSideNav.defaultProps = {
  handleSorting: undefined,
  handleFiltering: undefined,
  filterOptions: {},
  sortOptions: {},
};

export default DetailSideNavContainer(DetailSideNav);
