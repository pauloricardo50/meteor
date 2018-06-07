import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Dialog from 'core/components/Material/Dialog';
import Button from 'core/components/Button';
import T from 'core/components/Translation';

export default class DialogSimple extends Component {
  constructor(props) {
    super(props);
    this.state = { open: false, disabled: false, isCancel: true };
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.close && nextProps.close) {
      this.setState({ open: false });
    }
  }

  handleOpen = () =>
    this.setState(
      { open: true },
      () => this.props.onOpen && this.props.onOpen(),
    );

  handleClose = isSubmit => this.setState({ open: false, isCancel: !isSubmit });

  disableClose = () => this.setState({ disabled: true });

  enableClose = () => this.setState({ disabled: false });

  render() {
    const { open, disabled, isCancel } = this.state;
    const {
      actions,
      autoFocus,
      rootStyle,
      label,
      primary,
      secondary,
      buttonStyle,
      title,
      important,
      children,
      passProps,
      bodyStyle,
      contentStyle,
      style,
      autoScroll,
      cancelOnly,
      buttonProps,
      onOpen,
      ...otherProps
    } = this.props;

    const finalActions =
      (actions && actions(this.handleClose)) ||
      (cancelOnly
        ? [
          <Button
            primary
            label={<T id="general.cancel" />}
            onClick={this.handleClose}
            key="cancel"
          />,
        ]
        : [
          <Button
            primary
            label={<T id="general.cancel" />}
            onClick={this.handleClose}
            key="cancel"
          />,
          <Button
            primary
            label="Ok"
            onClick={() => this.handleClose(true)}
            autoFocus={autoFocus} // TODO doesn't work with tooltips
            disabled={disabled}
            key="submit"
          />,
        ]);

    const childProps = {
      disableClose: this.disableClose,
      enableClose: this.enableClose,
      isCancel,
      handleClose: this.handleClose,
    };

    return (
      <span style={rootStyle}>
        <Button
          raised
          label={label}
          onClick={this.handleOpen}
          primary={primary}
          secondary={secondary}
          style={buttonStyle}
          {...buttonProps}
        />
        <Dialog
          {...otherProps}
          title={title}
          actions={finalActions}
          important={important}
          open={open}
          onClose={this.handleClose}
          style={style}
        >
          {!!children && passProps
            ? React.cloneElement(children, { ...childProps })
            : children}
        </Dialog>
      </span>
    );
  }
}

DialogSimple.propTypes = {
  actions: PropTypes.func,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  primary: PropTypes.bool,
  secondary: PropTypes.bool,
  rootStyle: PropTypes.objectOf(PropTypes.any),
  buttonStyle: PropTypes.objectOf(PropTypes.any),
  autoFocus: PropTypes.bool,
  close: PropTypes.bool,
  important: PropTypes.bool,
  passProps: PropTypes.bool,
  onOpen: PropTypes.func,
  autoScroll: PropTypes.bool,
  cancelOnly: PropTypes.bool,
};

DialogSimple.defaultProps = {
  actions: undefined,
  primary: false,
  secondary: false,
  rootStyle: {},
  buttonStyle: {},
  autoFocus: false,
  close: undefined,
  important: false,
  passProps: false,
  onOpen: () => {},
  autoScroll: false,
  cancelOnly: false,
};
