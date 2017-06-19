import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';

import { T } from '/imports/ui/components/general/Translation.jsx';

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

  handleOpen = () => this.setState({ open: true });

  handleClose = isSubmit => this.setState({ open: false, isCancel: !isSubmit });

  disableClose = () => this.setState({ disabled: true });

  enableClose = () => this.setState({ disabled: false });

  render() {
    const actions = this.props.actions || [
      <FlatButton primary label={<T id="general.cancel" />} onTouchTap={this.handleClose} />,
      <FlatButton
        primary
        label="Ok"
        onTouchTap={() => this.handleClose(true)}
        autoFocus={this.props.autoFocus} // TODO doesn't work with tooltips
        disabled={this.state.disabled}
      />,
    ];

    const childProps = {
      disableClose: this.disableClose,
      enableClose: this.enableClose,
      isCancel: this.state.isCancel,
    };

    return (
      <span style={this.props.rootStyle}>
        <RaisedButton
          label={this.props.label}
          onTouchTap={this.handleOpen}
          primary={this.props.primary}
          secondary={this.props.secondary}
          style={this.props.buttonStyle}
        />
        <Dialog
          title={<h3>{this.props.title}</h3>}
          actions={actions}
          modal={this.props.modal}
          open={this.state.open}
          onRequestClose={this.handleClose}
        >
          {this.props.children && React.cloneElement(this.props.children, { ...childProps })}
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
};
