import React from 'react';
import PropTypes from 'prop-types';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import { GlobalHotKeys } from 'react-hotkeys';

import Loading from 'core/components/Loading';
import T from 'core/components/Translation';
import { compose, lifecycle } from 'recompose';
import LinkToCollection from '../../LinkToCollection';
import AdminSearchResultsContainer from './AdminSearchResultsContainer';
import ResultsPerCollection from './ResultsPerCollection';

let index = 0;

export const goDown = () => {
  const nodes = document.getElementsByClassName('focusable-result');
  const nodeCount = nodes.length;
  const shouldInitiateFocus = !document.activeElement.classList.contains('focusable-result');

  if (!shouldInitiateFocus && index < nodeCount - 1) {
    index += 1;
  }

  nodes[index].focus();
};

const goUp = () => {
  const nodes = document.getElementsByClassName('focusable-result');

  if (index > 0) {
    index -= 1;
  }

  nodes[index].focus();
};

const resetFocus = () => {
  index = 0;
};

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
    <>
      <GlobalHotKeys
        keyMap={{ down: 'down', up: 'up' }}
        handlers={{ down: goDown, up: goUp }}
      />
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
            >
              <h3>
                <LinkToCollection collection={collectionName} />
              </h3>
              <ResultsPerCollection
                collection={collectionName}
                results={resultsFromThisCollection}
                closeSearch={closeSearch}
              />
            </ListItem>
          );
        })}
      </List>
    </>
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

export default compose(
  AdminSearchResultsContainer,
  lifecycle({
    componentWillReceiveProps({ results: nextResults = [] }) {
      const { results = [] } = this.props;
      if (nextResults.length !== results.length) {
        resetFocus();
      }
    },
  }),
)(AdminSearchResults);
