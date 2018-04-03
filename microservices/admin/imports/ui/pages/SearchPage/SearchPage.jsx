import React, { Component } from 'react';
import SearchForm from './SearchForm';
import SearchResults from './SearchResults/SearchResults';

class SearchPage extends Component {
  constructor(props) {
    super(props);
    this.state = { query: null };
  }

  setQuery = (text) => {
    this.setState({ query: text });
  };

  render() {
    const { query } = this.state;

    return (
      <div className="searchContainer">
        <h2 className="searchTitle">
          <SearchForm onChange={this.setQuery} className="searchField" />
        </h2>
        {query && <SearchResults searchQuery={query} />}
      </div>
    );
  }
}

export default SearchPage;
