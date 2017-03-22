import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-password';

import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import MaskedInput from 'react-text-mask';
import emailMask from 'text-mask-addons/dist/emailMask.js';

import { emailValidation } from '/imports/js/helpers/validation.js';

const styles = {
  textField: {
    fontSize: 'inherit',
  },
  button: {
    marginRight: 8,
    marginBottom: 8,
  },
};

export default class EmailLine extends Component {
  constructor(props) {
    super(props);

    this.state = {};
    this.timer = null;

    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  handleChange(event) {
    const email = event.target.value;
    Meteor.clearTimeout(this.timer);
    this.props.setParentState('email', email);

    if (emailValidation(email)[0]) {
      console.log('email is valid');
      this.timer = Meteor.setTimeout(
        () => {
          // Check if the email exists in the database
          Meteor.call('doesUserExist', email, (error, result) => {
            console.log('doesUserExist', result);
            if (result) {
              // If it exists
              this.setState({
                emailExists: true,
              });
            } else {
              // If it doesnt
              this.setState({
                emailExists: false,
              });
            }
            this.props.setParentState('showPassword', true);
          });
        },
        400,
      );
    } else {
      this.props.setParentState('showPassword', false);
    }
  }

  handleClick(e, login, signup) {
    this.props.setParentState('login', login);
    this.props.setParentState('signUp', signup);
  }

  render() {
    let buttons = null;
    if (this.state.emailExists) {
      buttons = (
        <RaisedButton
          label="Se Connecter"
          style={styles.button}
          primary
          onClick={e => this.handleClick(e, true, false)}
        />
      );
    } else {
      buttons = (
        <RaisedButton
          label="Créer un compte"
          style={styles.button}
          primary
          onClick={e => this.handleClick(e, false, true)}
        />
      );
    }

    return (
      <div>
        <h1>
          <TextField
            style={styles.textField}
            name="email"
            value={this.props.email}
            onChange={this.handleChange}
          >
            <MaskedInput mask={emailMask} guide autoFocus />
          </TextField>
        </h1>

        {this.state.emailExists !== undefined && buttons}
      </div>
    );
  }
}

EmailLine.propTypes = {
  setParentState: PropTypes.func.isRequired,
  email: PropTypes.string,
};

EmailLine.defaultProps = {
  email: '',
};
