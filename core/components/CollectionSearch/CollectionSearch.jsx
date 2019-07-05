// @flow
import React from 'react';
import Input from '@material-ui/core/Input';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import CollectionSearchContainer from './CollectionSearchContainer';

type CollectionSearchProps = {
  searchQuery: String,
  onSearch: Function,
  searchResults: Array<Object>,
  title: String,
  showResults: Boolean,
  renderItem: Function,
  onBlur: Function,
  onFocus: Function,
  setEnableBlur: Boolean,
};

const renderResult = renderItem => (result, index) => (
  <MenuItem key={index}>{renderItem(result)}</MenuItem>
);

const CollectionSearch = ({
  searchQuery,
  onSearch,
  searchResults,
  title,
  showResults,
  renderItem,
  onBlur,
  onFocus,
  setEnableBlur,
}: CollectionSearchProps) => (
  <div className="collection-search-container">
    <h4>{title}</h4>
    <Input
      className="collection-search-input"
      type="text"
      value={searchQuery}
      onChange={onSearch}
      placeholder="Rechercher..."
      onBlur={onBlur}
      onFocus={onFocus}
    />
    {showResults && (
      <Paper
        square
        onMouseEnter={() => setEnableBlur(false)}
        onMouseLeave={() => setEnableBlur(true)}
        onBlur={onBlur}
        onClick={onBlur}
        className="collection-search-results"
      >
        {searchResults.map(renderResult(renderItem))}
      </Paper>
    )}
  </div>
);

export default CollectionSearchContainer(CollectionSearch);
