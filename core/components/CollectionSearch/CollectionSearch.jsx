//      
import React, { useRef } from 'react';

import Input from '../Material/Input';
import CollectionSearchContainer from './CollectionSearchContainer';
import CollectionSearchResults from './CollectionSearchResults';

                              
                      
                     
                               
                
                       
                       
                         
                        
                    
  

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
}                       ) => {
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
      <CollectionSearchResults
        type={type}
        showResults={showResults}
        inputEl={inputEl}
        hideResults={hideResults}
        isLoading={isLoading}
        isEmpty={isEmpty}
        results={results}
        renderItem={renderItem}
        onClickItem={onClickItem}
        disableItem={disableItem}
      />
    </div>
  );
};

export default CollectionSearchContainer(CollectionSearch);
