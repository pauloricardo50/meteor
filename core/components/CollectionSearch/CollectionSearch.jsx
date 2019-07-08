// @flow
import React from 'react';
import Input from '@material-ui/core/Input';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';

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
  onBlur: Function,
  onFocus: Function,
};

const renderResult = (renderItem, onClickItem = () => {}, onBlur) => (
  result,
  index,
) => (
  <MenuItem
    key={index}
    className="collection-search-results-item"
    onClick={() => onClickItem(result)}
  >
    {renderItem(result, onBlur)}
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
  onBlur,
  onFocus,
}: CollectionSearchProps) => {
  const results = searchResults[searchQuery];
  const isLoading = !results;
  const isEmpty = results && !results.length;
  return (
    <ClickAwayListener onClickAway={onBlur}>
      <div className="collection-search-container">
        <label htmlFor="collection-search">{title}</label>
        <Input
          id="collection-search"
          className="collection-search-input"
          type="text"
          value={searchQuery}
          onChange={onSearch}
          placeholder="Rechercher..."
          onFocus={onFocus}
        />
        {showResults && (
          <Paper className="collection-search-results">
            {isLoading ? (
              <Loading small />
            ) : isEmpty ? (
              <MenuItem className="collection-search-results-item">
                Aucun résultat
              </MenuItem>
            ) : (
              results.map(renderResult(renderItem, onClickItem, onBlur))
            )}
          </Paper>
        )}
      </div>
    </ClickAwayListener>
  );
};

export default CollectionSearchContainer(CollectionSearch);
