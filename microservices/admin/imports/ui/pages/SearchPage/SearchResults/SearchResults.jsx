import React from 'react';
import PropTypes from 'prop-types';
import List from 'material-ui/List';

import Loading from 'core/components/Loading';
import { T } from 'core/components/Translation';
import SearchResultsContainer from './SearchResultsContainer';
import ResultsPerCollection from './ResultsPerCollection';

const SearchResults = (props) => {
  const { isLoading, error, data } = props;

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <div>Error: {error.reason}</div>;
  }

  const { borrowers, loans, properties, users } = data;
  const resultsLength =
    borrowers.length + loans.length + properties.length + users.length;

  if (resultsLength > 0) {
    return (
      <List className="list">
        {Object.keys(data).map((collection) => {
          const resultsFromThisCollection = data[collection];
          return (
            <ResultsPerCollection
              collection={collection}
              results={resultsFromThisCollection}
              key={collection}
            />
          );
        })}
      </List>
    );
  }

  return (
    <div className="description">
      <p>
        <T id="SearchResults.none" />
      </p>
    </div>
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
