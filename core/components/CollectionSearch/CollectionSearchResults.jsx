import React from 'react';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';

import Loading from '../Loading/Loading';
import List from '../Material/List';
import ListItem from '../Material/ListItem';

const ItemsPopper = ({
  showResults,
  inputEl,
  hideResults,
  isLoading,
  isEmpty,
  results,
  renderItem,
  onClickItem,
  disableItem = () => false,
}) => (
  <Popper
    open={showResults}
    placement="bottom-start"
    anchorEl={inputEl.current}
    style={{ zIndex: 1400 }} // Above modals
  >
    <ClickAwayListener
      mouseEvent="onMouseUp"
      onClickAway={() => {
        // When clicking back in the input, don't hide the results
        if (
          document.activeElement.getAttribute('name') !== 'collection-search'
        ) {
          hideResults();
        }
      }}
    >
      <Paper className="collection-search-results-container">
        {isLoading ? (
          <Loading small />
        ) : isEmpty ? (
          <div className="secondary font-size-3 text-center p-8">
            Aucun résultat
          </div>
        ) : (
          <List>
            {results.map(result => (
              <ListItem
                key={result._id}
                onClick={() => onClickItem?.(result)}
                disabled={disableItem(result)}
                button={!!onClickItem}
              >
                {typeof renderItem === 'function'
                  ? renderItem(result, hideResults)
                  : React.cloneElement(renderItem, { result, hideResults })}
              </ListItem>
            ))}
          </List>
        )}
      </Paper>
    </ClickAwayListener>
  </Popper>
);

const ItemsList = ({
  showResults,
  hideResults,
  isLoading,
  isEmpty,
  results,
  onClickItem,
  disableItem = () => false,
  renderItem,
}) => {
  if (!showResults) {
    return null;
  }

  if (isLoading) {
    return <Loading small />;
  }

  if (isEmpty) {
    return (
      <div className="secondary font-size-3 text-center p-8">
        Aucun résultat
      </div>
    );
  }

  return (
    <List className="collection-search-results">
      {results.map(result => (
        <ListItem
          key={result._id}
          onClick={() => onClickItem?.(result)}
          disabled={disableItem(result)}
          button={!!onClickItem}
        >
          {typeof renderItem === 'function'
            ? renderItem(result, hideResults)
            : React.cloneElement(renderItem, { result, hideResults })}
        </ListItem>
      ))}
    </List>
  );
};

const CollectionSearchResults = ({ type, ...props }) => {
  switch (type) {
    case 'popper':
      return <ItemsPopper {...props} />;
    case 'list':
      return <ItemsList {...props} />;
    default:
      return null;
  }
};

export default CollectionSearchResults;
