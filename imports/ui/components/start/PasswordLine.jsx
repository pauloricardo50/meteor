import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Accounts } from 'meteor/accounts-base';

import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

const styles = {
  textField: {
    width: 150,
    fontSize: 'inherit',
    marginLeft: 8,
    marginRight: 8,
  },
  button: {
    marginRight: 8,
    marginBottom: 8,
  },
  extra: {
    marginBottom: 16,
  },
};

export default class PasswordLine extends Component {
  constructor(props) {
    super(props);

    this.state = {
      error: '',
    };

    this.handleLogin = this.handleLogin.bind(this);
    this.handleCreate = this.handleCreate.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.props.setStateValue('password', event.target.value);
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
      }
    );
  }

  handleCreate() {
    Accounts.createUser(
      {
        email: this.props.email,
        password: this.props.password,
      },
      (error, result) => {
        if (error) {
          this.setState(error.message);
        } else {
          this.handleSuccess();
        }
      }
    );
  }

  handleSuccess() {
    // If the form is good, prepare path and route to it
    //if (this.props.isValid && this.props.isFinished) {
    if (true) {
      const p = this.props;
      const pathDef = '/new';
      const params = {};
      const queryParams = {
        twoBuyers: p.twoBuyers,
        age1: p.age1,
        age2: p.age2,
        genderRequired: p.genderRequired,
        gender1: p.gender1,
        gender2: p.gender2,
        purchaseType: p.purchaseType,
        propertyType: p.propertyType,
        salary: p.salary,
        bonusExists: p.bonusExists,
        bonus: p.bonus,
        propertyKnown: p.propertyKnown,
        propertyValue: p.propertyValue,
        maxCash: p.maxCash,
        maxDebt: p.maxDebt,
        fortune: p.fortune,
        insuranceFortune: p.insuranceFortune,
      };

      const path = FlowRouter.path(pathDef, params, queryParams);

      FlowRouter.go(path);
    }
  }

  render() {
    let content1 = null;
    let content2 = null;
    let button = null;
    const textfield = (
      <span className="value">
        <TextField
          style={styles.textField}
          name="email"
          value={this.props.password}
          onChange={this.handleChange}
          type="password"
          autoFocus
        />
      </span>
    );


    if (this.props.login) {
      content1 = 'et mon mot de passe est ';
      content2 = textfield;
      button = (
        <RaisedButton
          label="Connexion"
          primary
          onTouchTap={this.handleLogin}
        />
      );
    } else if (this.props.createAccount) {
      content1 = 'et mon nouveau mot de passe est ';
      content2 = textfield;
      button = (
        <RaisedButton
          label="Créer"
          primary
          onTouchTap={this.handleCreate}
        />
      );
    } else {
      content1 = (
        'et je recevrai un bel email instantanément'
      );
      button = (
        <RaisedButton
          label="Excellent!"
          primary
          href="/"
        />
      );
    }


    return (
      <article onTouchTap={this.props.setStep}>

        <h1 className={this.props.classes.text}>{content1}{content2}.</h1>

        <h4 className={this.props.classes.errorText}>{this.state.error}</h4>

        {this.props.step === this.props.index &&
          <div className={this.props.classes.extra} style={styles.extra}>
            {button}
          </div>
        }

      </article>
    );
  }
}

PasswordLine.propTypes = {
  step: PropTypes.number.isRequired,
  setStep: PropTypes.func.isRequired,
  setStateValue: PropTypes.func.isRequired,
  completeStep: PropTypes.func.isRequired,
  classes: PropTypes.objectOf(PropTypes.string).isRequired,
  index: PropTypes.number.isRequired,

  email: PropTypes.string.isRequired,
  password: PropTypes.string,
  login: PropTypes.bool.isRequired,
  createAccount: PropTypes.bool.isRequired,
};
