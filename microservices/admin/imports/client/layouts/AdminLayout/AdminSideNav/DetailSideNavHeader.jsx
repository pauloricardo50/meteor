import React from 'react';
import PropTypes from 'prop-types';

import { Link } from 'react-router-dom';

import T from 'core/components/Translation';
import DetailSideNavSort from './DetailSideNavSort';
import DetailSideNavFilters from './DetailSideNavFilters';
import getFilterOptions, {
  getFilterOptionFromValue,
} from './DetailSideNavFilters/filterOptions';
import sortOptions, {
  getSortOptionFromField,
} from './DetailSideNavSort/sortOptions';

const DetailSideNavHeader = (props) => {
  const { collectionName, hideDetailNav, sortOption, filters } = props;

  const filterArray = filters[collectionName] || [];
  const currentSortOption =
    sortOption.field &&
    getSortOptionFromField(sortOptions[collectionName], sortOption.field);

  return (
    <div>
      <div className="detail-side-nav-header">
        <DetailSideNavSort {...props} />

        <Link to={`/${collectionName}`} onClick={hideDetailNav}>
          <h3>
            <T id={`collections.${collectionName}`} noTooltips />
          </h3>
        </Link>

        <DetailSideNavFilters {...props} />
      </div>

      {filterArray.length > 0 && (
        <div>
          <T id="DetailSideNavHeader.filters" />:{' '}
          {filterArray
            .map(filter =>
              getFilterOptionFromValue(getFilterOptions(props), filter).label)
            .reduce((prev, curr) => [prev, ', ', curr])}
        </div>
      )}

      {currentSortOption && (
        <div>
          <T id="DetailSideNavHeader.sort" />: {currentSortOption.label}
          <T id={`DetailSideNavHeader.sortOrder.${sortOption.order}`} />
        </div>
      )}
    </div>
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
