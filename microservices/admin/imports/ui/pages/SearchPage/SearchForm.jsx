import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Icon from 'core/components/Icon';
import Button from 'core/components/Button';
import TextField from 'core/components/Material/TextField';
import { T } from 'core/components/Translation';

class SearchForm extends Component {
  constructor(props) {
    super(props);
    this.state = { text: '' };
  }

  handleSubmit = (event) => {
    event.preventDefault();
    const { text } = this.state;
    const { updateSearchPageQuery } = this.props;
    updateSearchPageQuery(text);
  };

  handleChange = ({ target: { value } }) => this.setState({ text: value });

  render() {
    const { text } = this.state;
    return (
      <div className="search-box">
        <form onSubmit={this.handleSubmit}>
          <TextField
            className="search-input pr20"
            autoFocus
            value={text}
            onChange={this.handleChange}
          />
          <Button raised className="search-button" type="submit">
            <Icon type="search" />
            <T id="general.search" />
          </Button>
        </form>
      </div>
    );
  }
}

SearchForm.propTypes = {
  updateSearchPageQuery: PropTypes.func.isRequired,
};

export default SearchForm;
