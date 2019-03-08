import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Icon from 'core/components/Icon';
import Button from 'core/components/Button';
import TextField from 'core/components/Material/TextField';
import T from 'core/components/Translation';

class SearchForm extends Component {
  constructor(props) {
    super(props);
    this.state = { searchText: '' };
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

  render() {
    const { searchText } = this.state;
    return (
      <form onSubmit={this.handleSubmit} className="search-field">
        <TextField
          className="search-input"
          autoFocus
          value={searchText}
          onChange={this.handleChange}
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
