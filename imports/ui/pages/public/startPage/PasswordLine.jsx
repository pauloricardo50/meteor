import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

import { saveStartForm } from '/imports/js/helpers/startFunctions';

const styles = {
  textField: {
    fontSize: 'inherit',
  },
  button: {
    marginRight: 8,
    marginBottom: 8,
  },
};

const getUserObject = props => {
  return {
    email: props.email,
    password: props.password,
  };
};

export default class PasswordLine extends Component {
  constructor(props) {
    super(props);

    this.state = {
      error: '',
      passwordIsValid: true,
    };

    this.handleLogin = this.handleLogin.bind(this);
    this.handleCreate = this.handleCreate.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.props.setParentState('password', event.target.value);
  }

  handleLogin() {
    Meteor.loginWithPassword(
      this.props.email,
      this.props.password,
      (error, result) => {
        if (error) {
          this.setState(error.message);
        } else {
          // this.handleSuccess();
          // TODO
          console.log('handle login!');
        }
      },
    );
  }

  handleCreate() {
    const user = getUserObject(this.props);

    Accounts.createUser(user, (error, result) => {
      if (error) {
        this.setState(error.message);
      } else {
        this.handleSuccess();
      }
    });
  }

  handleSuccess() {
    saveStartForm(this.props.formState);
  }

  render() {
    let content = null;
    let button = null;
    const textfield = (
      <TextField
        style={styles.textField}
        name="email"
        value={this.props.password}
        onChange={this.handleChange}
        type="password"
        autoFocus
      />
    );

    if (this.props.login) {
      content = textfield;
      button = (
        <RaisedButton label="Connexion" primary onClick={this.handleLogin} />
      );
    } else if (this.props.signUp) {
      content = textfield;
      button = (
        <RaisedButton label="Créer" primary onClick={this.handleCreate} />
      );
    } else {
      button = <RaisedButton label="Excellent!" primary href="/" />;
    }

    return (
      <div>

        <h1>{content}</h1>

        <h4>{this.state.error}</h4>

        {this.state.passwordIsValid && button}

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
};

PasswordLine.defaultProps = {
  email: '',
  password: '',
  login: false,
  signUp: false,
};
