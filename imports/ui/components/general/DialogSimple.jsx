import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';

export default class DialogSimple extends Component {
  state = {
    open: false,
  };

  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
    const actions = this.props.actions || [
      <FlatButton label="Ok" onTouchTap={this.handleClose} autoFocus={this.props.autoFocus} />,
    ];

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
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose}
        >
          {this.props.children}
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
};

DialogSimple.defaultProps = {
  actions: undefined,
  primary: false,
  secondary: false,
  rootStyle: {},
  buttonStyle: {},
  autoFocus: false,
};
