import React from 'react';
import PropTypes from 'prop-types';
import Link from 'core/components/Link';

import T from 'core/components/Translation';
import DetailSideNavSort from './DetailSideNavSort';
import DetailSideNavFilters from './DetailSideNavFilters';
import CurrentFilters from './CurrentFilters';

const DetailSideNavHeader = props => {
  const { collectionName, hideDetailNav, filters } = props;
  const filterArray = filters[collectionName] || [];

  return (
    <>
      <div className="detail-side-nav-header">
        <DetailSideNavSort {...props} />

        <Link to={`/${collectionName}`} onClick={hideDetailNav}>
          <h3>
            <T id={`collections.${collectionName}`} noTooltips />
          </h3>
        </Link>

        <DetailSideNavFilters {...props} />
      </div>

      <CurrentFilters {...props} filterArray={filterArray} />
    </>
  );
};

DetailSideNavHeader.propTypes = {
  collectionName: PropTypes.string.isRequired,
  filters: PropTypes.object,
  hideDetailNav: PropTypes.func.isRequired,
  sortOption: PropTypes.object,
};

DetailSideNavHeader.defaultProps = {
  filters: {},
  sortOption: undefined,
};

export default DetailSideNavHeader;
