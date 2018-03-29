import React from 'react';
import PropTypes from 'prop-types';
import { LoadingComponent } from 'core/components/Loading';
import { T } from 'core/components/Translation';
import SearchResultsContainer from './SearchResultsContainer';

const SearchResults = (props) => {
  const { isLoading, error, data } = props;
  if (isLoading) {
    return <LoadingComponent />;
  }
  if (error) {
    return <div>Error: {error.reason}</div>;
  }
  console.log(data);
  
  return (
    <div>Search Results</div>
  );
};

SearchResults.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  error: PropTypes.object,
  data: PropTypes.object.isRequired,
};

SearchResults.defaultProps = {
  error: undefined,
};

export default SearchResultsContainer(SearchResults);
