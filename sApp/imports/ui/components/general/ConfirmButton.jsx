import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Button from '/imports/ui/components/general/Button';
import Dialog from 'core/components/Material/Dialog';

import { T } from 'core/components/Translation';

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
    const {
      handleClick,
      label,
      primary,
      secondary,
      disabled,
      text,
      style,
      raised,
    } = this.props;

    const actions = [
      <Button
        key={1}
        label={<T id="general.cancel" />}
        primary
        onClick={this.handleClose}
      />,
      <Button
        key={2}
        label={<T id="general.yes" />}
        primary
        autoFocus
        onClick={(e) => {
          // prevents onClick from triggering twice when using enter to validate...
          e.preventDefault();
          handleClick();
          this.handleClose();
        }}
      />,
    ];

    return (
      <div>
        <Button
          raised={raised}
          label={label}
          onClick={this.handleOpen}
          primary={primary}
          secondary={secondary}
          disabled={disabled}
          style={style}
        />
        <Dialog
          title={<T id="general.areYouSure" />}
          actions={actions}
          open={this.state.open}
          onRequestClose={this.handleClose}
        >
          {text}
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
  raised: PropTypes.bool,
};

ConfirmButton.defaultProps = {
  text: 'Veuillez continuer cette action',
  primary: false,
  secondary: false,
  disabled: false,
  flat: false,
  raised: false,
};
