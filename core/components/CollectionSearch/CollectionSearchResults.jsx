// @flow
import React from 'react';

import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Popper from '@material-ui/core/Popper';
import MenuList from '@material-ui/core/MenuList';
import List, { ListItem } from '../List';
import Loading from '../Loading/Loading';

type CollectionSearchResultsProps = {
  type: String,
  showResults: Boolean,
  inputEl: React.Element,
  hideResults: Boolean,
  isLoading: Boolean,
  isEmpty: Boolean,
  results: Array,
  renderItem: Function,
  onClickItem: Function,
  disableitem: Function,
};

const ItemsPopper = ({
  showResults,
  inputEl,
  hideResults,
  isLoading,
  isEmpty,
  results,
  renderItem,
  onClickItem = () => {},
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
      <Paper>
        {isLoading ? (
          <Loading small />
        ) : isEmpty ? (
          <MenuItem>Aucun résultat</MenuItem>
        ) : (
          <MenuList>
            {results.map((result, index) => (
              <MenuItem
                key={index}
                onClick={() => onClickItem(result)}
                disabled={disableItem(result)}
              >
                {renderItem(result, hideResults)}
              </MenuItem>
            ))}
          </MenuList>
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
  onClickItem = () => {},
  disableItem = () => false,
  renderItem,
}) =>
  showResults ? (
    <List className="flex-col">
      {isLoading ? (
        <Loading small />
      ) : isEmpty ? (
        <ListItem>Aucun résultat</ListItem>
      ) : (
        results.map((result, index) => (
          <ListItem
            key={index}
            onClick={() => onClickItem(result)}
            button
            disabled={disableItem(result)}
          >
            {renderItem(result, hideResults)}
          </ListItem>
        ))
      )}
    </List>
  ) : null;

const CollectionSearchResults = ({
  type,
  ...props
}: CollectionSearchResultsProps) => {
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
