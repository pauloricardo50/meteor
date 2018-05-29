import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Accounts } from 'meteor/accounts-base';

import TextField from 'core/components/Material/TextField';
import Button from 'core/components/Button';

import T from 'core/components/Translation';

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
  input: {
    width: 300,
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
        this.props.history.push('/');
      }
    });
  };

  render() {
    const { isValid, newPassword, newPassword2 } = this.state;
    return (
      <section id="password-reset-page" style={styles.div}>
        <h1>
          <T id="PasswordResetPage.title" />
        </h1>
        <TextField
          label={<T id="PasswordResetPage.password" />}
          floatingLabelFixed
          type="password"
          value={newPassword}
          onChange={e => this.handleChange(e, 'newPassword')}
          style={styles.input}
        />
        <TextField
          label={<T id="PasswordResetPage.confirmPassword" />}
          floatingLabelFixed
          type="password"
          value={newPassword2}
          onChange={e => this.handleChange(e, 'newPassword2')}
          style={styles.input}
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
      </section>
    );
  }
}

PasswordResetPage.propTypes = {};
