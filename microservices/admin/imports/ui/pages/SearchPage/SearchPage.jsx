import React, { Component } from 'react';
import SearchForm from './SearchForm';
import SearchResults from './SearchResults/SearchResults';

class SearchPage extends Component {
  constructor(props) {
    super(props);
    this.state = { query: '' };
  }

  setQuery = text => this.setState({ query: text });

  render() {
    const { query } = this.state;

    return (
      <div className="search-container">
        <h2 className="search-title">
          <SearchForm
            updateSearchPageQuery={this.setQuery}
            className="search-field"
          />
        </h2>
        {query && <SearchResults searchQuery={query} />}
      </div>
    );
  }
}

export default SearchPage;
