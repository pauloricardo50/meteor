import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

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
  console.log(props.formState);
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
          this.handleSuccess();
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
    console.log('account was created!');
    // If the form is good, prepare path and route to it
    //if (this.props.isValid && this.props.isFinished) {
    if (true) {
      // const p = this.props;
      // const pathDef = '/new';
      // const params = {};
      // const queryParams = {
      //   twoBuyers: p.twoBuyers,
      //   age1: p.age1,
      //   age2: p.age2,
      //   genderRequired: p.genderRequired,
      //   gender1: p.gender1,
      //   gender2: p.gender2,
      //   purchaseType: p.purchaseType,
      //   propertyType: p.propertyType,
      //   salary: p.salary,
      //   bonusExists: p.bonusExists,
      //   bonus: p.bonus,
      //   propertyKnown: p.propertyKnown,
      //   propertyValue: p.propertyValue,
      //   maxCash: p.maxCash,
      //   maxDebt: p.maxDebt,
      //   fortune: p.fortune,
      //   insuranceFortune: p.insuranceFortune,
      // };
    }
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
