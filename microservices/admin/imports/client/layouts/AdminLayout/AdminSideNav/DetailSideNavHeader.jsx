import React from 'react';
import PropTypes from 'prop-types';

import { Link } from 'react-router-dom';

import T from 'core/components/Translation';
import DetailSideNavSort from './DetailSideNavSort';
import DetailSideNavFilters from './DetailSideNavFilters';

const DetailSideNavHeader = (props) => {
  const {
    collectionName,
    hideDetailNav,
    onSort,
    onFilter,
    sortOptions,
    selectedFilterOptions,
    handleFiltering,
  } = props;

  return (
    <div className="detail-side-nav-header">
      {/* <DetailSideNavSort onChange={onSort} sortOptions={sortOptions} /> */}

      <Link to={`/${collectionName}`} onClick={hideDetailNav}>
        <h3>
          <T id={`collections.${collectionName}`} noTooltips />
        </h3>
      </Link>

      <DetailSideNavFilters
        {...props}
        filters={selectedFilterOptions[collectionName]}
        onChange={handleFiltering}
      />
    </div>
  );
};

DetailSideNavHeader.propTypes = {
  collectionName: PropTypes.string.isRequired,
  selectedFilterOptions: PropTypes.array,
  hideDetailNav: PropTypes.func.isRequired,
  onSort: PropTypes.func,
  onFilter: PropTypes.func,
  sortOptions: PropTypes.object,
  filters: PropTypes.array,
};

DetailSideNavHeader.defaultProps = {
  selectedFilterOptions: [],
  onSort: undefined,
  onFilter: undefined,
  sortOptions: undefined,
  filters: [],
};

export default DetailSideNavHeader;
