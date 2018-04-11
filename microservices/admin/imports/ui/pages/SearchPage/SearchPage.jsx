import React, { Component } from 'react';

import SearchForm from './SearchForm';
import SearchResults from './SearchResults/SearchResults';

class SearchPage extends Component {
  constructor(props) {
    super(props);
    this.state = { searchQuery: '' };
  }

  handleSubmit = text => this.setState({ searchQuery: text });

  render() {
    const { searchQuery } = this.state;

    return (
      <div className="search-container">
        <h2 className="search-title">
          <SearchForm onSubmit={this.handleSubmit} className="search-field" />
        </h2>
        {searchQuery && <SearchResults searchQuery={searchQuery} />}
      </div>
    );
  }
}

export default SearchPage;
