import React, { Component } from 'react';
import { injectIntl } from 'react-intl';

import Loadable from '../../utils/loadable';
import TextInput from '../TextInput';

// import SearchResults from './SearchResults';
const SearchResults = Loadable({ loader: () => import('./SearchResults') });

const styles = {
  div: {
    display: 'flex',
    width: '100%',
    alignItems: 'center',
    flexDirection: 'column',
  },
  h2: {
    width: '100%',
    maxWidth: 400,
  },
  input: {
    width: '100%',
    fontSize: 'inherit',
    height: 64,
  },
};

class Search extends Component {
  constructor(props) {
    super(props);

    this.state = { search: '' };
  }

  handleChange = (_, value) => this.setState({ search: value });

  render() {
    const { search } = this.state;

    return (
      <div style={styles.div}>
        <h2 style={styles.h2}>
          <TextInput
            autoFocus
            placeholder="Search.placeholder"
            id="search"
            style={styles.input}
            value={search}
            onChange={this.handleChange}
          />
        </h2>
        <SearchResults search={search} />
      </div>
    );
  }
}

Search.propTypes = {};

export default injectIntl(Search);
