import React, { Component } from 'react';

import IconButton from 'core/components/IconButton';
import Dialog from 'core/components/Material/Dialog';
import SearchResults from './SearchResults/SearchResults';
import SearchForm from './SearchForm';

class SearchPage extends Component {
  constructor(props) {
    super(props);
    this.state = { searchQuery: '' };
  }

  handleSubmit = searchQuery => this.setState({ searchQuery });

  render() {
    const { searchQuery } = this.state;
    const { setOpenSearch, openSearch } = this.props;

    return (
      <>
        <IconButton type="search" onClick={() => setOpenSearch(true)} />
        <Dialog
          open={openSearch}
          onClose={() => setOpenSearch(false)}
          className="admin-search"
        >
          <SearchForm onSubmit={this.handleSubmit} />
          {searchQuery && (
            <SearchResults
              searchQuery={searchQuery}
              closeSearch={() => setOpenSearch(false)}
            />
          )}
        </Dialog>
      </>
    );
  }
}

export default SearchPage;
