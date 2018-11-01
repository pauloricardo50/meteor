import React, { Component } from 'react';
import PropTypes from 'prop-types';

import message from '../utils/message';
import Dialog from './Material/Dialog';
import Button from './Button';
import TextField from './Material/TextField';
import T from './Translation';

export default class ConfirmMethod extends Component {
  state = {
    open: false,
    text: '',
  };

  shouldAllowSubmit = keyword => !keyword || this.state.text === keyword;

  handleOpen = () => this.setState({ open: true });

  handleClose = () => this.setState({ open: false });

  handleSubmit = (event) => {
    const { keyword, method } = this.props;
    if (event) {
      event.preventDefault();
    }

    if (this.shouldAllowSubmit(keyword)) {
      this.setState({ loading: true });
      method()
        .then(() => this.setState({ open: false, loading: false }))
        .then(() => message.success('Succès !', 2));
    }
  };

  handleChange = event => this.setState({ text: event.target.value });

  render() {
    const {
      label,
      style,
      disabled,
      keyword,
      buttonProps,
      children,
      dialogTitle,
    } = this.props;
    const { open, text, loading } = this.state;
    const actions = [
      <Button
        label={<T id="ConfirmMethod.buttonCancel" />}
        primary
        onClick={this.handleClose}
        key="cancel"
        disabled={loading}
      />,
      <Button
        label={<T id="ConfirmMethod.buttonConfirm" />}
        primary
        disabled={keyword && text !== keyword}
        onClick={this.handleSubmit}
        key="ok"
        loading={loading}
      />,
    ];

    return (
      <React.Fragment>
        <Button
          label={label}
          onClick={this.handleOpen}
          style={style}
          disabled={disabled}
          {...buttonProps}
        />
        <Dialog
          title={dialogTitle || <T id="ConfirmMethod.dialogTitle" />}
          actions={actions}
          important
          open={open}
        >
          {children}
          {keyword && (
            <div>
              <T id="ConfirmMethod.dialogMessage" values={{ keyword }} />
              <form onSubmit={this.handleSubmit}>
                <TextField
                  value={text}
                  autoFocus
                  onChange={this.handleChange}
                />
              </form>
            </div>
          )}
        </Dialog>
      </React.Fragment>
    );
  }
}

ConfirmMethod.propTypes = {
  disabled: PropTypes.bool,
  keyword: PropTypes.string,
  label: PropTypes.string.isRequired,
  method: PropTypes.func.isRequired,
  style: PropTypes.object,
};

ConfirmMethod.defaultProps = {
  disabled: false,
  style: {},
};
