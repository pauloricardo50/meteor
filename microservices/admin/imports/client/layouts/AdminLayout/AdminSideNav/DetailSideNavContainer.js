import { compose, withProps } from 'recompose';
import { connect } from 'react-redux';

import { appendFilters } from './DetailSideNavFilters/filterOptions';

const withFilterAndSortOptionsConnect = connect(({ sidenav: { filters, sortOption } }) => ({ filters, sortOption }));

export default compose(
  withFilterAndSortOptionsConnect,
  withProps(({ collectionName, filters, sortOption }) => ({
    filterOptions: appendFilters(filters[collectionName]),
    sortOption: sortOption[collectionName],
  })),
);
