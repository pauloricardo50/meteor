import React, { Component } from 'react';
import PropTypes from 'prop-types';

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

  handleOpen = (event) => {
    event.preventDefault();
    event.stopPropagation();
    this.setState({ open: true });
  };

  handleClose = () => this.setState({ open: false });

  handleSubmit = (event) => {
    const { keyword, method } = this.props;
    if (event) {
      event.preventDefault();
    }

    if (this.shouldAllowSubmit(keyword)) {
      this.setState({ loading: true });
      method()
        .finally(() => this.setState({ loading: false }))
        .then(() => {
          this.setState({ open: false });
          return import('../utils/message').then(({ default: message }) => {
            message.success('Succès !', 2);
          });
        });
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
      title,
      description,
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
          title={title}
          actions={actions}
          important
          open={open}
          text={description}
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
  label: PropTypes.node.isRequired,
  method: PropTypes.func.isRequired,
  style: PropTypes.object,
  title: PropTypes.node,
};

ConfirmMethod.defaultProps = {
  title: <T id="ConfirmMethod.dialogTitle" />,
  disabled: false,
  keyword: undefined,
  style: {},
};
