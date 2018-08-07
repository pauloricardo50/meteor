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
      autoScroll,
      bodyStyle,
      buttonProps,
      buttonStyle,
      cancelOnly,
      children,
      contentStyle,
      important,
      label,
      onOpen,
      passProps,
      primary,
      raised=true,
      rootStyle,
      secondary,
      style,
      title,
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
          raised={raised}
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
  autoFocus: PropTypes.bool,
  autoScroll: PropTypes.bool,
  buttonStyle: PropTypes.objectOf(PropTypes.any),
  cancelOnly: PropTypes.bool,
  close: PropTypes.bool,
  important: PropTypes.bool,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  onOpen: PropTypes.func,
  passProps: PropTypes.bool,
  primary: PropTypes.bool,
  rootStyle: PropTypes.objectOf(PropTypes.any),
  secondary: PropTypes.bool,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
};

DialogSimple.defaultProps = {
  actions: undefined,
  autoFocus: false,
  autoScroll: false,
  buttonStyle: {},
  cancelOnly: false,
  close: undefined,
  important: false,
  onOpen: () => {},
  passProps: false,
  primary: false,
  rootStyle: {},
  secondary: false,
  title: null,
};
