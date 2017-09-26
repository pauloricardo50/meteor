import React, { Component } from 'react';
import { injectIntl } from 'react-intl';

import Loadable from '/imports/js/helpers/loadable';
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
    const { intl } = this.props;
    const { search } = this.state;
    const placeholder = intl.formatMessage({ id: 'Search.placeholder' });

    return (
      <div style={styles.div}>
        <h2 style={styles.h2}>
          <TextInput
            autoFocus
            placeholder={placeholder}
            id="search"
            style={styles.input}
            currentValue={search}
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
