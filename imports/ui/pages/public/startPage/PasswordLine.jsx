import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { analytics } from 'meteor/okgrow:analytics';

import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import LoopIcon from 'material-ui/svg-icons/av/loop';

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
      loading: false,
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
        // TODO this should only be possible if the current logged in user doesn't have borrowers set up
        // Or simply add new borrowers to the account no matter what
        console.log('handle login!');
      }
    });
  };

  handleSuccess = () => {
    saveStartForm(this.props.formState, this.props.history);

    // Create user for analytics
    analytics.identify(Meteor.userId(), {
      email: Meteor.user().emails[0].address,
      id: Meteor.userId(),
    });
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

    if (this.props.login || this.props.signUp) {
      content = textfield;
      button = (
        <RaisedButton
          label={this.props.login ? 'Connexion' : 'Créer'}
          primary
          onTouchTap={() => {
            this.setState({ loading: true });
            if (this.props.login) {
              this.handleLogin();
            } else {
              this.handleCreate();
            }
          }}
          type="submit"
          icon={this.state.loading && <LoopIcon className="fa-spin" />}
        />
      );
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
