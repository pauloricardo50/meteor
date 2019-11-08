import React from 'react';
import PropTypes from 'prop-types';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';

import Loading from 'core/components/Loading';
import T from 'core/components/Translation';
import { titles } from 'core/components/IconLink/CollectionIconLinkPopup/CollectionIconLinkPopupComponents';
import { CollectionIconLink } from 'core/components/IconLink';
import LinkToCollection from '../../LinkToCollection';
import AdminSearchResultsContainer from './AdminSearchResultsContainer';

const AdminSearchResults = ({ isLoading, error, results, closeSearch }) => {
  if (isLoading || !results) {
    return <Loading />;
  }

  if (error) {
    return (
      <>
        Error:
        {error.reason}
      </>
    );
  }

  const hasNoSearchResults = Object.values(results).every((collection) => collection.length === 0);

  if (hasNoSearchResults) {
    return (
      <div className="flex center">
        <h2 className="secondary">
          <T id="SearchResults.none" />
        </h2>
      </div>
    );
  }

  return (
    <List className="search-results">
      {Object.keys(results).map((collectionName) => {
        const resultsFromThisCollection = results[collectionName];

        if (resultsFromThisCollection.length === 0) {
          return null;
        }

        return (
          <ListItem
            onClick={closeSearch}
            key={collectionName}
            className="search-results-collection"
            jooe
          >
            <h3>
              <LinkToCollection collection={collectionName} />
            </h3>

            <div className="flex-col">
              {resultsFromThisCollection.map((result) => (
                <CollectionIconLink
                  relatedDoc={{ ...result, collection: collectionName }}
                  key={result._id}
                  onClick={closeSearch}
                >
                  {titles[collectionName](result)}
                </CollectionIconLink>
              ))}
            </div>
          </ListItem>
        );
      })}
    </List>
  );
};

AdminSearchResults.propTypes = {
  closeSearch: PropTypes.func.isRequired,
  error: PropTypes.object,
  isLoading: PropTypes.bool.isRequired,
  results: PropTypes.any.isRequired,
};

AdminSearchResults.defaultProps = {
  error: undefined,
};

export default AdminSearchResultsContainer(AdminSearchResults);
