import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Dialog from 'core/components/Material/Dialog';
import Button from 'core/components/Button';
import TextField from 'core/components/Material/TextField';

export default class ConfirmMethod extends Component {
  state = {
    open: false,
    text: '',
  };

  handleOpen = () => this.setState({ open: true });

  handleClose = () => this.setState({ open: false });

  handleSubmit = (event) => {
    if (event) {
      event.preventDefault();
    }

    if (this.state.text === this.props.keyword) {
      this.props
        .method()
        .then(() => this.setState({ open: false }))
        .catch((error) => {
          console.log('ConfirmMethod error:', error);
        });
    }
  };

  handleChange = event => this.setState({ text: event.target.value });

  render() {
    const { label, style, disabled, keyword } = this.props;
    const { open, text } = this.state;
    const actions = [
      <Button
        label="Annuler"
        primary
        onClick={this.handleClose}
        key="cancel"
      />,
      <Button
        label="Okay"
        primary
        disabled={text !== keyword}
        onClick={this.handleSubmit}
        key="ok"
      />,
    ];

    return (
      <div>
        <Button
          raised
          label={label}
          onClick={this.handleOpen}
          style={style}
          disabled={disabled}
        />
        <Dialog title="Êtes-vous sûr?" actions={actions} important open={open}>
          Tapez le mot &quot;{keyword}&quot; pour valider cette action.
          <form onSubmit={this.handleSubmit}>
            <TextField value={text} autoFocus onChange={this.handleChange} />
          </form>
        </Dialog>
      </div>
    );
  }
}

ConfirmMethod.propTypes = {
  label: PropTypes.string.isRequired,
  keyword: PropTypes.string.isRequired,
  method: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  style: PropTypes.object,
};

ConfirmMethod.defaultProps = {
  disabled: false,
  style: {},
};
