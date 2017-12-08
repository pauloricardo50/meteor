import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Accounts } from 'meteor/accounts-base';

import TextField from '/imports/ui/components/general/Material/TextField';
import Button from '/imports/ui/components/general/Button';

import { T } from '/imports/ui/components/general/Translation';
import DialogSimple from '/imports/ui/components/general/DialogSimple';

const styles = {
  div: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
};

export default class PasswordChange extends Component {
  state = {
    oldPassword: '',
    newPassword: '',
    newPassword2: '',
    close: false,
    isValid: false,
  };

  handleChange = (event, key) => {
    this.setState({ [key]: event.target.value }, () => {
      if (
        !!this.state.oldPassword &&
        !!this.state.newPassword &&
        this.state.newPassword === this.state.newPassword2
      ) {
        this.setState({ isValid: true });
      } else {
        this.setState({ isValid: false });
      }
    });
  };

  handleClose = () => {
    this.setState({ close: true }, () => {
      this.setState({ close: false });
    });
  };

  handleSubmit = () => {
    Accounts.changePassword(this.state.oldPassword, this.state.newPassword, err => {
      if (err) {
        console.log(err);
        // TODO
      } else {
        this.handleClose();
      }
    });
  };

  render() {
    const { oldPassword, newPassword, newPassword2, close, isValid } = this.state;

    return (
      <DialogSimple
        title={<T id="PasswordChange.dialogTitle" />}
        label={<T id="PasswordChange.change" />}
        actions={[
          <Button label={<T id="general.cancel" />} onClick={this.handleClose} />,
          <Button
            label={<T id="general.ok" />}
            primary
            disabled={!isValid}
            onClick={this.handleSubmit}
          />,
        ]}
        close={close}
      >
        <div style={styles.div}>
          <TextField
            label={<T id="PasswordChange.oldPassword" />}
            floatingLabelFixed
            type="password"
            value={oldPassword}
            onChange={e => this.handleChange(e, 'oldPassword')}
          />
          <TextField
            label={<T id="PasswordChange.password" />}
            floatingLabelFixed
            type="password"
            value={newPassword}
            onChange={e => this.handleChange(e, 'newPassword')}
          />
          <TextField
            label={<T id="PasswordChange.passwordRepeat" />}
            floatingLabelFixed
            type="password"
            value={newPassword2}
            onChange={e => this.handleChange(e, 'newPassword2')}
          />
        </div>
      </DialogSimple>
    );
  }
}

PasswordChange.propTypes = {};
