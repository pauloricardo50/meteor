import React, { Component } from 'react';

import SearchForm from './SearchForm';
import SearchResults from './SearchResults/SearchResults';

class SearchPage extends Component {
  constructor(props) {
    super(props);
    this.state = { searchQuery: '' };
  }

  handleSubmit = searchQuery => this.setState({ searchQuery });

  render() {
    const { searchQuery } = this.state;

    return (
      <section className="search-page">
        <SearchForm onSubmit={this.handleSubmit} />
        {searchQuery && <SearchResults searchQuery={searchQuery} />}
      </section>
    );
  }
}

export default SearchPage;
