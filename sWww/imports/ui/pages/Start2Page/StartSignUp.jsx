import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';

import EmailLine from './EmailLine';
import PasswordLine from './PasswordLine';
import { T } from 'core/components/Translation';
import cleanMethod from 'core/api/cleanMethods';
import track, { addUserTracking } from 'core/utils/analytics';
import saveStartForm from 'core/utils/saveStartForm';

const styles = {
  section: {
    margin: '50px 0 150px 0',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  passwordDiv: {
    marginTop: 40,
  },
  button: {
    marginRight: 8,
    marginBottom: 8,
  },
};

export default class StartSignUp extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  setParentState = (key, value, callback) => {
    const object = {};
    object[key] = value;
    this.setState(object, () => {
      if (typeof callback === 'function') {
        callback();
      }
    });
  };

  handleNewEmail = () => {
    const { email } = this.state;
    const { formState, history } = this.props;

    cleanMethod('createUserAndRequest', { email, formState })
      .then(() => {
        // addUserTracking(Meteor.userId(), {
        //   email: Meteor.user().emails[0].address,
        //   id: Meteor.userId(),
        // });
        history.push('/checkYourMailbox');
      })
      .catch((error) => {
        console.log(error);
      });
    // Create account
    // Insert request
    // Send verification email
    // Route to email check page
  };

  handleOldEmail = (callback) => {
    const { email, password } = this.state;
    const { formState } = this.props;
    Meteor.loginWithPassword(email, password, (error) => {
      if (error) {
        this.setState({ error: error.message, loading: false });
        callback(error);
      } else {
        saveStartForm(formState)
          .then(() => {
            callback(undefined);
            track('Funnel - User logged in', {});
            window.location.href = Meteor.settings.public.subdomains.app;
          })
          .catch(callback);
      }
    });
  };

  render() {
    const { showPassword, login, signUp } = this.state;
    return (
      <div style={styles.section}>
        <h2>
          <T id="StartSignUp.email" />
        </h2>
        <EmailLine
          {...this.state}
          setEmail={this.setParentState}
          handleSuccess={this.handleSuccess}
        />

        {showPassword && (
          <div className="animated fadeIn" style={styles.passwordDiv}>
            <h3 className="fixed-size">
              {login && <T id="StartSignUp.signedUp" />}
              {signUp && <T id="StartSignUp.notSignedUp" />}
            </h3>
            <PasswordLine
              history={this.props.history}
              {...this.state}
              formState={this.props.formState}
              setPassword={this.setParentState}
              handleSubmit={this.handleOldEmail}
            />
          </div>
        )}
      </div>
    );
  }
}

StartSignUp.propTypes = {
  formState: PropTypes.objectOf(PropTypes.any).isRequired,
  history: PropTypes.objectOf(PropTypes.any).isRequired,
};
