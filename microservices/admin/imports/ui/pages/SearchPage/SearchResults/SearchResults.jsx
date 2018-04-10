import React from 'react';
import PropTypes from 'prop-types';
import List, { ListItem } from 'material-ui/List';

import Loading from 'core/components/Loading';
import { T } from 'core/components/Translation';
import LinkToCollection from '../../../components/LinkToCollection';
import SearchResultsContainer from './SearchResultsContainer';
import ResultsPerCollection from './ResultsPerCollection';

const SearchResults = ({ isLoading, error, data: searchResults }) => {
  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <div>Error: {error.reason}</div>;
  }

  const hasNoSearchResults = Object.values(searchResults).every(collection => collection.length === 0);

  if (hasNoSearchResults) {
    return (
      <div className="description">
        <p>
          <T id="SearchResults.none" />
        </p>
      </div>
    );
  }

  return (
    <List className="search-results">
      {Object.keys(searchResults).map((collection) => {
        const resultsFromThisCollection = searchResults[collection];

        if (resultsFromThisCollection.length === 0) {
          return null;
        }

        return (
          <ListItem key={collection} className="search-results-collection">
            <h3>
              <LinkToCollection collection={collection} />
            </h3>
            <ResultsPerCollection
              collection={collection}
              results={resultsFromThisCollection}
            />
          </ListItem>
        );
      })}
    </List>
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
