import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-password';

import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import MaskedInput from 'react-text-mask';
import emailMask from 'text-mask-addons/dist/emailMask';


import { emailValidation } from '/imports/js/validation';

const styles = {
  textField: {
    width: 250,
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

var timer;

export default class EmailLine extends Component {
  constructor(props) {
    super(props);

    this.state = {
      emailExists: false,
      content: '',
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    const p = this.props;
    const n = nextProps;

    return (
      this.state !== nextState ||
      p.classes !== n.classes ||
      p.twoBuyers !== n.twoBuyers ||
      p.email !== n.email
    );
  }


  handleChange(event, noTimeout) {
    const email = event.target.value;
    Meteor.clearTimeout(timer);
    this.setState({ content: '' });
    this.props.setStateValue('email', email);
    // Reset next step if this value changes
    this.props.setStateValue('maxStep', this.props.index);


    if (emailValidation(email)[0]) {
      timer = Meteor.setTimeout(() => {
        // Check if the email exists in the database
        Meteor.call('doesUserExist', email, (error, result) => {
          if (result) {
            // If it exists
            this.setState({
              emailExists: true,
              content: ' existe déjà',
            });
          } else {
            // If it doesnt
            this.setState({
              emailExists: false,
              content: ' est superbe',
            });
          }
        });
      }, noTimeout ? 0 : 400);
    }
  }

  handleClick(e, login, create) {
    this.props.setStateValue('login', login);
    this.props.setStateValue('createAccount', create);
    this.props.completeStep(e, true, true);
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
        <span>
          <RaisedButton
            label="Créer un compte"
            style={styles.button}
            primary
            onClick={e => this.handleClick(e, false, true)}
          />
          <RaisedButton
            label="M'envoyer un Récapitulatif"
            style={styles.button}
            onClick={e => this.handleClick(e, false, false)}
          />
        </span>
      );
    }


    return (
      <article onClick={this.props.setStep}>
        <h1 className={this.props.classes.text}>
          Mon adresse e-mail
          {!this.state.content &&
            ' est'
          }
          &nbsp;
          <span className="value">
            <TextField
              style={styles.textField}
              name="email"
              value={this.props.email}
              onChange={e => this.handleChange(e, false)}
              onBlur={e => this.handleChange(e, true)}
            >
              <MaskedInput
                mask={emailMask}
                guide
                autoFocus
              />
            </TextField>
          </span>

          {this.state.content}
        </h1>

        {(this.props.step === this.props.index && this.state.content) &&
          <div className={this.props.classes.extra} style={styles.extra}>
            {buttons}
          </div>
        }
      </article>
    );
  }
}

EmailLine.propTypes = {
  step: PropTypes.number.isRequired,
  setStep: PropTypes.func.isRequired,
  setStateValue: PropTypes.func.isRequired,
  completeStep: PropTypes.func.isRequired,
  classes: PropTypes.objectOf(PropTypes.string).isRequired,

  email: PropTypes.string.isRequired,
};
