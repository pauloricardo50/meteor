import React from 'react';
import PropTypes from 'prop-types';

import { Link } from 'react-router-dom';

import T from 'core/components/Translation';

const DetailSideNavHeader = ({ collectionName, hideDetailNav }) => (
  <div className="detail-side-nav-header">
    <Link to={`/${collectionName}`} onClick={hideDetailNav}>
      <h3>
        <T id={`collections.${collectionName}`} noTooltips />
      </h3>
    </Link>
  </div>
);

DetailSideNavHeader.propTypes = {
  collectionName: PropTypes.string.isRequired,
  hideDetailNav: PropTypes.func.isRequired,
};

export default DetailSideNavHeader;
