import React from 'react';
import PropTypes from 'prop-types';

import DetailSideNavHeader from './DetailSideNavHeader';
import DetailSideNavList from './DetailSideNavList';
import DetailSideNavContainer from './DetailSideNavContainer';

const DetailSideNav = (props) => {
  const { selectedSortOptions, filterOptions } = props;

  return (
    <div className="detail-side-nav">
      <DetailSideNavHeader {...props} />
      <DetailSideNavList
        {...props}
        filterOptions={filterOptions}
        sortOptions={selectedSortOptions}
      />
    </div>
  );
};

DetailSideNav.propTypes = {
  selectedSortOptions: PropTypes.object,
  filterOptions: PropTypes.object,
};

DetailSideNav.defaultProps = {
  selectedSortOptions: {},
  filterOptions: {},
};

export default DetailSideNavContainer(DetailSideNav);
