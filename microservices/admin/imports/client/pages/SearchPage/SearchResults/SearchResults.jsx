import React from 'react';
import PropTypes from 'prop-types';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';

import Loading from 'core/components/Loading';
import T from 'core/components/Translation';
import LinkToCollection from '../../../components/LinkToCollection';
import SearchResultsContainer from './SearchResultsContainer';
import ResultsPerCollection from './ResultsPerCollection';

const SearchResults = ({ isLoading, error, data: searchResults }) => {
  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <React.Fragment>Error: {error.reason}</React.Fragment>;
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
      {searchResults.map((collection) => {
        const collectionName = Object.keys(collection)[0];
        const resultsFromThisCollection = collection[collectionName];

        if (resultsFromThisCollection.length === 0) {
          return null;
        }

        return (
          <ListItem key={collectionName} className="search-results-collection">
            <h3>
              <LinkToCollection collection={collectionName} />
            </h3>
            <ResultsPerCollection
              collection={collectionName}
              results={resultsFromThisCollection}
            />
          </ListItem>
        );
      })}
    </List>
  );
};

SearchResults.propTypes = {
  data: PropTypes.any.isRequired,
  error: PropTypes.object,
  isLoading: PropTypes.bool.isRequired,
};

SearchResults.defaultProps = {
  error: undefined,
};

export default SearchResultsContainer(SearchResults);
