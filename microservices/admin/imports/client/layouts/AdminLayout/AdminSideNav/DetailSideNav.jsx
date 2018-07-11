import React from 'react';
import PropTypes from 'prop-types';

import DetailSideNavHeader from './DetailSideNavHeader';
import DetailSideNavList from './DetailSideNavList';
import DetailSideNavContainer from './DetailSideNavContainer';

const DetailSideNav = (props) => {
  const { filterOptions, sortOption } = props;

  return (
    <div className="detail-side-nav">
      <DetailSideNavHeader {...props} />
      <DetailSideNavList
        {...props}
        filterOptions={filterOptions}
        sortOption={sortOption}
      />
    </div>
  );
};

DetailSideNav.propTypes = {
  filterOptions: PropTypes.object,
  sortOption: PropTypes.object,
};

DetailSideNav.defaultProps = {
  filterOptions: {},
  sortOption: {},
};

export default DetailSideNavContainer(DetailSideNav);
