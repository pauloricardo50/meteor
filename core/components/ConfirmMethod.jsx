import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Dialog from 'core/components/Material/Dialog';
import Button from 'core/components/Button';
import TextField from 'core/components/Material/TextField';
import T from 'core/components/Translation';

export default class ConfirmMethod extends Component {
  state = {
    open: false,
    text: '',
  };

  shouldAllowSubmit = keyword => !keyword || this.state.text === keyword;

  handleOpen = () => this.setState({ open: true });

  handleClose = () => this.setState({ open: false });

  handleSubmit = (event) => {
    const { keyword } = this.props;
    if (event) {
      event.preventDefault();
    }

    if (this.shouldAllowSubmit(keyword)) {
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
        label={<T id="ConfirmMethod.buttonCancel" />}
        primary
        onClick={this.handleClose}
        key="cancel"
      />,
      <Button
        label={<T id="ConfirmMethod.buttonConfirm" />}
        primary
        disabled={keyword && text !== keyword}
        onClick={this.handleSubmit}
        key="ok"
      />,
    ];

    return (
      <React.Fragment>
        <Button
          primary
          label={label}
          onClick={this.handleOpen}
          style={style}
          disabled={disabled}
        />
        <Dialog
          title={<T id="ConfirmMethod.dialogTitle" />}
          actions={actions}
          important
          open={open}
        >
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
