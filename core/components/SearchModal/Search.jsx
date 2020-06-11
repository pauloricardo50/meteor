import React, { useState } from 'react';

import TextInput from '../TextInput';
import SearchResults from './SearchResults';

export const Search = () => {
  const [search, changeSearch] = useState('');

  return (
    <div className="search">
      <h2>
        <TextInput
          className="search-input"
          autoFocus
          placeholder="Search.placeholder"
          id="search"
          value={search}
          onChange={value => changeSearch(value)}
        />
      </h2>
      <SearchResults search={search} />
    </div>
  );
};

export default Search;
