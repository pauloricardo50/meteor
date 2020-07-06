import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Button from '../Button';
import Dialog from '../Material/Dialog';
import T from '../Translation';

export default class DialogSimple extends Component {
  constructor(props) {
    super(props);
    this.state = { open: !!props.openOnMount, disabled: false, isCancel: true };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (!this.props.close && nextProps.close) {
      this.setState({ open: false });
    }
  }

  handleOpen = event =>
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
      children,
      closeOnly,
      contentStyle,
      important,
      label,
      onClose = () => null,
      onOpen,
      passProps,
      primary,
      raised = true,
      renderProps,
      renderTrigger,
      rootStyle,
      secondary,
      style,
      title,
      ...otherProps
    } = this.props;

    const finalActions =
      (actions && actions(this.handleClose)) ||
      (closeOnly
        ? [
            <Button
              primary
              label={<T id="general.close" />}
              onClick={args => {
                onClose();
                this.handleClose(args);
              }}
              key="close"
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
      <>
        {renderTrigger ? (
          renderTrigger({ handleOpen: this.handleOpen })
        ) : (
          <Button
            raised={raised}
            label={label}
            onClick={this.handleOpen}
            primary={primary}
            secondary={secondary}
            {...buttonProps}
          />
        )}
        <Dialog
          {...otherProps}
          title={title}
          actions={finalActions}
          important={important}
          open={open}
          onClose={this.handleClose}
          style={style}
          contentStyle={contentStyle}
        >
          {!!children && passProps
            ? React.cloneElement(children, { ...childProps })
            : renderProps
            ? children(childProps)
            : children}
        </Dialog>
      </>
    );
  }
}

DialogSimple.propTypes = {
  actions: PropTypes.func,
  autoFocus: PropTypes.bool,
  autoScroll: PropTypes.bool,
  close: PropTypes.bool,
  closeOnly: PropTypes.bool,
  important: PropTypes.bool,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
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
  closeOnly: false,
  close: undefined,
  important: false,
  label: null,
  onOpen: () => {},
  passProps: false,
  primary: false,
  rootStyle: {},
  secondary: false,
  title: null,
};
