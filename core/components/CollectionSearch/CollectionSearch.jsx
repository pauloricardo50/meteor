// @flow
import React, { useRef } from 'react';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Popper from '@material-ui/core/Popper';
import MenuList from '@material-ui/core/MenuList';

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

const renderResult = (renderItem, onClickItem = () => {}, hideResults) => (
  result,
  index,
) => (
  <MenuItem key={index} onClick={() => onClickItem(result)}>
    {renderItem(result, hideResults)}
  </MenuItem>
);

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
}: CollectionSearchProps) => {
  const inputEl = useRef(null);
  const results = searchResults[searchQuery];
  const isLoading = !results;
  const isEmpty = results && !results.length;

  return (
    <div className="collection-search-container" ref={inputEl}>
      <label htmlFor="collection-search">{title}</label>
      <input style={{ display: 'none' }} name="collection-search" />
      <Input
        name="collection-search"
        className="collection-search-input"
        type="text"
        value={searchQuery}
        onChange={onSearch}
        placeholder="Rechercher..."
        onFocus={onFocus}
      />
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
              document.activeElement.getAttribute('name')
              !== 'collection-search'
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
                {results.map(renderResult(renderItem, onClickItem, hideResults))}
              </MenuList>
            )}
          </Paper>
        </ClickAwayListener>
      </Popper>
    </div>
  );
};

export default CollectionSearchContainer(CollectionSearch);
