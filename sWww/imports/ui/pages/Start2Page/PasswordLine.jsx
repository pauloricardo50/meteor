import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

import TextField from 'core/components/Material/TextField';

import track, { addUserTracking } from 'core/utils/analytics';
import Button from 'core/components/Button';
import Icon from 'core/components/Icon';
import { T } from 'core/components/Translation';
import saveStartForm from './saveStartForm';

const styles = {
  textField: {
    fontSize: 'inherit',
  },
  button: {
    marginRight: 8,
    marginBottom: 8,
  },
};

export default class PasswordLine extends Component {
  constructor(props) {
    super(props);

    this.state = {
      error: '',
      passwordIsValid: true,
      loading: false,
    };
  }

  handleChange = (event) => {
    this.props.setParentState('password', event.target.value);
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.setState({ loading: true });
    if (this.props.login) {
      this.handleLogin();
    } else {
      this.handleCreate();
    }
  };

  handleCreate = () => {
    const user = {
      email: this.props.email,
      password: this.props.password,
    };

    Accounts.createUser(user, (error) => {
      if (error) {
        this.setState({ error: error.message, loading: false });
      } else {
        this.handleSuccess();
        track('Funnel - User created account', {});
      }
    });
  };

  handleLogin = () => {
    Meteor.loginWithPassword(this.props.email, this.props.password, (error) => {
      if (error) {
        this.setState({ error: error.message, loading: false });
      } else {
        this.handleSuccess();
        track('Funnel - User logged in', {});
      }
    });
  };

  handleSuccess = () => {
    saveStartForm(this.props.formState, this.props.history);

    Meteor.call('sendVerificationLink', (error) => {
      if (error) {
        console.log(error);
      }
    });

    // Create user for analytics
    addUserTracking(Meteor.userId(), {
      email: Meteor.user().emails[0].address,
      id: Meteor.userId(),
    });
  };

  render() {
    const { password, login, signUp } = this.props;
    let content = null;
    let button = null;
    const textfield = (
      <TextField
        style={styles.textField}
        name="email"
        value={password}
        onChange={this.handleChange}
        type="password"
        autoFocus
      />
    );

    if (login || signUp) {
      content = textfield;
      button = (
        <Button
          raised
          label={
            login ? (
              <T id="PasswordLine.login" />
            ) : (
              <T id="PasswordLine.create" />
            )
          }
          primary
          type="submit"
          icon={this.state.loading && <Icon type="loop-spin" />}
          disabled={!password}
        />
      );
    } else {
      button = <Button raised label="Excellent!" primary href="/home" />;
    }

    return (
      <div>
        <form action="submit" onSubmit={this.handleSubmit}>
          <h1 className="fixed-size">{content}</h1>
          <h4 className="fixed-size error">{this.state.error}</h4>
          {this.state.passwordIsValid && button}
        </form>
      </div>
    );
  }
}

PasswordLine.propTypes = {
  formState: PropTypes.objectOf(PropTypes.any).isRequired,
  setParentState: PropTypes.func.isRequired,
  email: PropTypes.string,
  password: PropTypes.string,
  login: PropTypes.bool,
  signUp: PropTypes.bool,
  history: PropTypes.object.isRequired,
};

PasswordLine.defaultProps = {
  email: '',
  password: '',
  login: false,
  signUp: false,
};
