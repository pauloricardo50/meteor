import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Icon from 'core/components/Icon';
import Button from 'core/components/Button';
import TextField from 'core/components/Material/TextField';

class SearchForm extends Component {
  constructor(props) {
    super(props);
    this.state = { text: null };
  }

  updateSearchQuery = (onChange) => {
    const { text } = this.state;
    onChange(text);
  };

  handleChange = (event) => {
    this.setState({
      text: event.target.value,
    });
  };

  render() {
    const { onChange } = this.props;

    return (
      <div className="searchBox">
        <TextField
          className="searchInput"
          autoFocus
          onChange={this.handleChange}
        />
        <Button
          raised
          className="searchButton"
          onClick={() => this.updateSearchQuery(onChange)}
        >
          <Icon type="search" />
        </Button>
      </div>
    );
  }
}

SearchForm.propTypes = {
  onChange: PropTypes.func.isRequired,
};

export default SearchForm;
