import React, { Component } from 'react';
import PropTypes from 'prop-types';

import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';

export default class ConfirmButton extends Component {
  constructor(props) {
    super(props);

    this.state = { open: false };
  }

  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
    const Button = this.props.flat ? FlatButton : RaisedButton;

    const actions = [
      <FlatButton label="Annuler" primary onTouchTap={this.handleClose} />,
      <FlatButton
        label="Oui"
        primary
        keyboardFocused
        onTouchTap={() => {
          this.props.handleClick();
          this.handleClose();
        }}
      />,
    ];

    return (
      <div>
        <Button
          label={this.props.label}
          onTouchTap={this.handleOpen}
          primary={this.props.primary}
          secondary={this.props.secondary}
          disabled={this.props.disabled}
        />
        <Dialog
          title="Êtes-vous sûr ?"
          actions={actions}
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose}
        >
          {this.props.text}
        </Dialog>
      </div>
    );
  }
}

ConfirmButton.propTypes = {
  label: PropTypes.string.isRequired,
  handleClick: PropTypes.func.isRequired,
  text: PropTypes.string,
  primary: PropTypes.bool,
  secondary: PropTypes.bool,
  disabled: PropTypes.bool,
  flat: PropTypes.bool,
};

ConfirmButton.defaultProps = {
  text: 'Veuillez continuer cette action',
  primary: false,
  secondary: false,
  disabled: false,
  flat: false,
};
