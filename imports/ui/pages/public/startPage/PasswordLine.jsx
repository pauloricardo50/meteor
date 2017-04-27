import PropTypes from 'prop-types';
import React, { Component } from 'react';
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
  }

  handleChange = event => {
    this.props.setParentState('password', event.target.value);
  };

  handleCreate = e => {
    e.preventDefault();

    const user = getUserObject(this.props);

    Accounts.createUser(user, (error, result) => {
      if (error) {
        this.setState(error.message);
      } else {
        this.handleSuccess();
      }
    });
  };

  handleLogin = e => {
    e.preventDefault();

    Meteor.loginWithPassword(this.props.email, this.props.password, (error, result) => {
      if (error) {
        this.setState(error.message);
      } else {
        // this.handleSuccess();
        // TODO
        console.log('handle login!');
      }
    });
  };

  handleSuccess = () => {
    saveStartForm(this.props.formState, this.props.history);
  };

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
      button = <RaisedButton label="Connexion" primary onClick={this.handleLogin} type="submit" />;
    } else if (this.props.signUp) {
      content = textfield;
      button = <RaisedButton label="Créer" primary onClick={this.handleCreate} type="submit" />;
    } else {
      button = <RaisedButton label="Excellent!" primary href="/home" />;
    }

    return (
      <div>
        <form action="submit">
          <h1
            className="fixed-size"
            onSubmit={e => (this.props.login ? this.handleLogin(e) : this.handleCreate(e))}
          >
            {content}
          </h1>

          <h4 className="fixed-size">{this.state.error}</h4>

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
};

PasswordLine.defaultProps = {
  email: '',
  password: '',
  login: false,
  signUp: false,
};
