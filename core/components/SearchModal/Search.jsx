import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { withState, compose } from 'recompose';

import TextInput from '../TextInput';
import SearchResults from './SearchResults';

export const Search = ({ search, changeSearch }) => (
  <div className="search">
    <h2>
      <TextInput
        className="search-input"
        autoFocus
        placeholder="Search.placeholder"
        id="search"
        value={search}
        onChange={(_, value) => changeSearch(value)}
      />
    </h2>
    <SearchResults search={search} />
  </div>
);

Search.propTypes = {
  search: PropTypes.string.isRequired,
  changeSearch: PropTypes.func.isRequired,
};

export default compose(withState('search', 'changeSearch', ''), injectIntl)(Search);
