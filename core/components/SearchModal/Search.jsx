import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { compose, withState } from 'recompose';

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
        onChange={value => changeSearch(value)}
      />
    </h2>
    <SearchResults search={search} />
  </div>
);

Search.propTypes = {
  changeSearch: PropTypes.func.isRequired,
  search: PropTypes.string.isRequired,
};

export default compose(
  withState('search', 'changeSearch', ''),
  injectIntl,
)(Search);
