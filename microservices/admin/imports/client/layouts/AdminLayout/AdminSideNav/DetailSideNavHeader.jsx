import React from 'react';
import PropTypes from 'prop-types';

import { Link } from 'react-router-dom';

import T from 'core/components/Translation';
import DetailSideNavSort from './DetailSideNavSort';
import DetailSideNavFilters from './DetailSideNavFilters';

const DetailSideNavHeader = ({
  collectionName,
  hideDetailNav,
  onSort,
  onFilter,
  sortOptions,
}) => (
  <div className="detail-side-nav-header">
    <DetailSideNavSort onChange={onSort} sortOptions={sortOptions} />

    <Link to={`/${collectionName}`} onClick={hideDetailNav}>
      <h3>
        <T id={`collections.${collectionName}`} noTooltips />
      </h3>
    </Link>

    <DetailSideNavFilters onChange={onFilter} />
  </div>
);

DetailSideNavHeader.propTypes = {
  collectionName: PropTypes.string.isRequired,
  hideDetailNav: PropTypes.func.isRequired,
  onSort: PropTypes.func,
  onFilter: PropTypes.func,
  sortOptions: PropTypes.object,
};

DetailSideNavHeader.defaultProps = {
  onSort: undefined,
  onFilter: undefined,
  sortOptions: undefined,
};

export default DetailSideNavHeader;
