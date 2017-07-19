import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Button from '/imports/ui/components/general/Button.jsx';
import Dialog from 'material-ui/Dialog';

import { T } from '/imports/ui/components/general/Translation.jsx';

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
      <Button
        label={<T id="general.cancel" />}
        primary
        onTouchTap={this.handleClose}
      />,
      <Button
        label={<T id="general.yes" />}
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
          title={
            <h3>
              <T id="general.areYouSure" />
            </h3>
          }
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
  label: PropTypes.oneOfType([PropTypes.object, PropTypes.string]).isRequired,
  handleClick: PropTypes.func.isRequired,
  text: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
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
