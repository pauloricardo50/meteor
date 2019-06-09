import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Icon from 'core/components/Icon';
import Button from 'core/components/Button';
import TextField from 'core/components/Material/TextField';
import T from 'core/components/Translation';
import { goDown } from './SearchResults/SearchResults';

const DOWN_ARROW = 40;

class SearchForm extends Component {
  constructor(props) {
    super(props);
    this.state = { searchText: '' };
    this.ref = React.createRef();
  }

  handleSubmit = (event) => {
    event.preventDefault();
    const { searchText } = this.state;
    const { onSubmit } = this.props;
    onSubmit(searchText);
  };

  handleChange = ({ target: { value } }) => {
    this.setState({ searchText: value }, () => {
      if (value.length > 0) {
        const { onSubmit } = this.props;
        onSubmit(value);
      }
    });
  };

  handleKeyDown = (event) => {
    // Blur input to start going into manual focus mode
    if (event.keyCode === DOWN_ARROW) {
      event.target.blur();
      goDown();
    }
  };

  render() {
    const { searchText } = this.state;
    return (
      <form onSubmit={this.handleSubmit} className="search-field">
        <TextField
          className="search-input"
          autoFocus
          value={searchText}
          onChange={this.handleChange}
          onKeyDown={this.handleKeyDown}
          ref={this.ref}
        />

        <Button raised className="search-button" type="submit">
          <Icon type="search" />
          <T id="general.search" />
        </Button>
      </form>
    );
  }
}

SearchForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

export default SearchForm;
