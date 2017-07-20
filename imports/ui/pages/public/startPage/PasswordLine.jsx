import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { addUserTracking } from '/imports/js/helpers/analytics';

import Button from '/imports/ui/components/general/Button.jsx';
import TextField from 'material-ui/TextField';
import LoopIcon from 'material-ui/svg-icons/av/loop';
import { T } from '/imports/ui/components/general/Translation.jsx';
import track from '/imports/js/helpers/analytics';
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
        this.setState({ error: error.message, loading: false });
      } else {
        this.handleSuccess();
        track('Funnel - User created account', {});
      }
    });
  };

  handleLogin = e => {
    e.preventDefault();

    Meteor.loginWithPassword(this.props.email, this.props.password, (error, result) => {
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

    Meteor.call('sendVerificationLink', (error, response) => {
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

    const onSubmit = e => {
      this.setState({ loading: true });
      if (this.props.login) {
        this.handleLogin(e);
      } else {
        this.handleCreate(e);
      }
    };

    if (this.props.login || this.props.signUp) {
      content = textfield;
      button = (
        <Button raised
          label={this.props.login ? <T id="PasswordLine.login" /> : <T id="PasswordLine.create" />}
          primary
          onTouchTap={onSubmit}
          type="submit"
          icon={this.state.loading && <LoopIcon className="fa-spin" />}
          disabled={!this.props.password}
        />
      );
    } else {
      button = <Button raised label="Excellent!" primary href="/home" />;
    }

    return (
      <div>
        <form action="submit" onSubmit={onSubmit}>
          <h1 className="fixed-size">{content}</h1>
          {/* <h4 className="fixed-size error">{this.state.error}</h4> */}
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
