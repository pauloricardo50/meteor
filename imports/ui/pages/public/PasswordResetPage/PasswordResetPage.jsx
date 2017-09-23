import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Accounts } from 'meteor/accounts-base';

import TextField from '/imports/ui/components/general/Material/TextField';
import Button from '/imports/ui/components/general/Button';

import { T } from '/imports/ui/components/general/Translation';

const styles = {
  div: {
    height: '100%',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    marginTop: 40,
  },
};

export default class PasswordResetPage extends Component {
  state = {
    newPassword: '',
    newPassword2: '',
    isValid: false,
  };

  handleChange = (event, key) => {
    this.setState({ [key]: event.target.value }, () => {
      if (
        !!this.state.newPassword &&
        this.state.newPassword === this.state.newPassword2
      ) {
        this.setState({ isValid: true });
      } else {
        this.setState({ isValid: false });
      }
    });
  };

  handleSubmit = () => {
    const token = this.props.match.params.token;
    Accounts.resetPassword(token, this.state.newPassword, (err) => {
      if (err) {
        console.log(err);
        // TODO
      } else {
        this.props.history.push('/app');
      }
    });
  };

  render() {
    const { isValid, newPassword, newPassword2 } = this.state;
    return (
      <div style={styles.div}>
        <h1>
          <T id="PasswordResetPage.title" />
        </h1>
        <TextField
          floatingLabelText={<T id="PasswordResetPage.password" />}
          floatingLabelFixed
          type="password"
          value={newPassword}
          onChange={e => this.handleChange(e, 'newPassword')}
        />
        <TextField
          floatingLabelText={<T id="PasswordResetPage.confirmPassword" />}
          floatingLabelFixed
          type="password"
          value={newPassword2}
          onChange={e => this.handleChange(e, 'newPassword2')}
        />

        <div style={styles.button}>
          <Button
            raised
            label={<T id="PasswordResetPage.CTA" />}
            disabled={!isValid}
            onClick={this.handleSubmit}
            primary
          />
        </div>
      </div>
    );
  }
}

PasswordResetPage.propTypes = {};
