import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Button from 'core/components/Button';
import Dialog from 'core/components/Material/Dialog';

import T from 'core/components/Translation';

export default class ConfirmButton extends Component {
  constructor(props) {
    super(props);

    this.state = { open: false };
  }

  handleOpen = (e) => {
    e.stopPropagation();
    e.preventDefault();
    this.setState({ open: true });
  };

  handleClose = (e) => {
    // prevents onClick from triggering twice when using enter to validate..
    e.stopPropagation();
    e.preventDefault();
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
      buttonComponent,
    } = this.props;

    const buttonProps = {
      onClick: this.handleOpen,
      raised,
      label,
      primary,
      secondary,
      disabled,
      style,
    };

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
          handleClick(e);
          this.handleClose(e);
        }}
      />,
    ];

    return (
      <div>
        {buttonComponent ?
          React.cloneElement(buttonComponent, { ...buttonProps })
          :
          <Button {...buttonProps} />
        }
        <Dialog
          title={<T id="general.areYouSure" />}
          actions={actions}
          open={this.state.open}
          onClose={this.handleClose}
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
  buttonComponent: PropTypes.node,
};

ConfirmButton.defaultProps = {
  text: 'Veuillez continuer cette action',
  primary: false,
  secondary: false,
  disabled: false,
  flat: false,
  raised: false,
  buttonComponent: null,
};
