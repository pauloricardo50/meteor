// @flow
import React, { useRef } from 'react';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Popper from '@material-ui/core/Popper';
import MenuList from '@material-ui/core/MenuList';

import List, { ListItem } from '../List';

import Input from '../Material/Input';
import CollectionSearchContainer from './CollectionSearchContainer';
import Loading from '../Loading/Loading';

type CollectionSearchProps = {
  searchQuery: String,
  onSearch: Function,
  searchResults: Array<Object>,
  title: String,
  showResults: Boolean,
  renderItem: Function,
  onClickItem?: Function,
  hideResults: Function,
  onFocus: Function,
};

const renderItemsPopper = ({
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

const renderItemsList = ({
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

const renderResults = ({ type, ...props }) => {
  switch (type) {
    case 'popper':
      return renderItemsPopper(props);
    case 'list':
      return renderItemsList(props);
    default:
      return null;
  }
};

const CollectionSearch = ({
  searchQuery,
  onSearch,
  searchResults,
  title,
  showResults,
  renderItem,
  onClickItem,
  hideResults,
  onFocus,
  placeholder,
  description,
  disableItem,
  type = 'popper',
}: CollectionSearchProps) => {
  const inputEl = useRef(null);
  const results = searchResults[searchQuery];
  const isLoading = !results;
  const isEmpty = results && !results.length;

  return (
    <div className="collection-search-container" ref={inputEl}>
      <label htmlFor="collection-search">{title}</label>
      <input style={{ display: 'none' }} name="collection-search" />
      {description && <p className="description">{description}</p>}
      <Input
        name="collection-search"
        className="collection-search-input"
        type="text"
        value={searchQuery}
        onChange={onSearch}
        placeholder={placeholder || 'Rechercher...'}
        onFocus={onFocus}
        autoComplete="off"
      />
      {renderResults({
        type,
        showResults,
        inputEl,
        hideResults,
        isLoading,
        isEmpty,
        results,
        renderItem,
        onClickItem,
        disableItem,
      })}
    </div>
  );
};

export default CollectionSearchContainer(CollectionSearch);
