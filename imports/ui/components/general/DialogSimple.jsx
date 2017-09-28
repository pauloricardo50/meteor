import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Dialog from '/imports/ui/components/general/Material/Dialog';
import Button from '/imports/ui/components/general/Button';

import { T } from '/imports/ui/components/general/Translation';

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

  handleOpen = () => this.setState({ open: true }, () => this.props.onOpen());

  handleClose = isSubmit => this.setState({ open: false, isCancel: !isSubmit });

  disableClose = () => this.setState({ disabled: true });

  enableClose = () => this.setState({ disabled: false });

  render() {
    const { actions } = this.props;
    const {
      autoFocus,
      rootStyle,
      label,
      primary,
      secondary,
      buttonStyle,
      title,
      modal,
      children,
      passProps,
      bodyStyle,
      contentStyle,
      style,
      autoScroll,
      cancelOnly,
    } = this.props;

    const finalActions =
      actions || cancelOnly
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
            disabled={this.state.disabled}
            key="submit"
          />,
        ];

    const childProps = {
      disableClose: this.disableClose,
      enableClose: this.enableClose,
      isCancel: this.state.isCancel,
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
        />
        <Dialog
          title={title}
          actions={finalActions}
          modal={modal}
          open={this.state.open}
          onRequestClose={this.handleClose}
          bodyStyle={bodyStyle}
          contentStyle={contentStyle}
          style={style}
          autoScrollBodyContent={autoScroll}
          repositionOnUpdate
          autoDetectWindowHeight
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
  actions: PropTypes.arrayOf(PropTypes.object),
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  primary: PropTypes.bool,
  secondary: PropTypes.bool,
  rootStyle: PropTypes.objectOf(PropTypes.any),
  buttonStyle: PropTypes.objectOf(PropTypes.any),
  autoFocus: PropTypes.bool,
  close: PropTypes.bool,
  modal: PropTypes.bool,
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
  close: false,
  modal: false,
  passProps: false,
  onOpen: () => {},
  autoScroll: false,
  cancelOnly: false,
};
