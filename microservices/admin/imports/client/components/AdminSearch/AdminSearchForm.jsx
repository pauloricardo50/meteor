import React, { Component } from 'react';
import PropTypes from 'prop-types';

import TextInput from 'core/components/TextInput';

class AdminSearchForm extends Component {
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

  handleChange = (value) => {
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
        <TextInput
          className="search-input"
          autoFocus
          value={searchText}
          onChange={this.handleChange}
          ref={this.ref}
          placeholder="Chercher..."
          info="Appuie sur TAB, puis ENTER!"
        />
      </form>
    );
  }
}

AdminSearchForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

export default AdminSearchForm;
