import React from 'react';
import PropTypes from 'prop-types';

import DetailSideNavHeader from './DetailSideNavHeader';
import DetailSideNavList from './DetailSideNavList';

const DetailSideNav = props => (
  <div className="detail-side-nav">
    <DetailSideNavHeader {...props} />
    <DetailSideNavList {...props} />
  </div>
);

DetailSideNav.propTypes = {};

export default DetailSideNav;
