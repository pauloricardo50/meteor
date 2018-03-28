import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';

import { T } from 'core/components/Translation';
import { addUserTracking } from 'core/utils/analytics';
import saveStartForm from 'core/utils/saveStartForm';
import { emailValidation } from 'core/utils/validation';
import { createUserAndLoan, doesUserExist } from 'core/api';

import EmailLine from './EmailLine';

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

    this.state = { loading: false, errorText: '' };
  }

  setParentState = (key, value, callback) =>
    this.setState({ [key]: value }, () => {
      if (typeof callback === 'function') {
        callback();
      }
    });

  handleNewEmail = (event) => {
    event.preventDefault();
    const { email } = this.state;
    const { formState, history } = this.props;

    if (emailValidation(email)) {
      this.setState({ loading: true });

      return doesUserExist
        .run({ email })
        .then((emailExists) => {
          if (emailExists) {
            throw 'Cette adresse existe déjà';
          }
        })
        .then(() =>
          createUserAndLoan.run(
            { email, formState },
            { title: "C'est dans la boite!", message: '' },
          ))
        .then((userId) => {
          this.setState({ loading: false, errorText: '' });
          addUserTracking(userId, { email, id: userId });
          history.push(`/checkYourMailbox/${email}`);
        })
        .then(() => this.setState({ loading: false }))
        .catch(error => this.setState({ loading: false, errorText: error }));
    }
    this.setState({ errorText: 'Email is invalid', loading: false });
  };

  handleExistingAccount = () => {
    const { formState } = this.props;
    this.setState({ loading: true });

    // userId should remain undefined, and the user will add it to his account
    // once logged in, this is to avoid other people adding loans to your
    // account
    saveStartForm(formState, null)
      .then((loanId) => {
        // Keep loading true, to prevent double insert
        this.setState({ errorText: '' });
        const appUrl = `${
          Meteor.settings.public.subdomains.app
        }/add-loan/${loanId}`;

        window.location.replace(appUrl);
        return false;
      })
      .catch(error => this.setState({ loading: false, errorText: error }));
  };

  render() {
    const { loading, errorText } = this.state;
    return (
      <div style={styles.section}>
        <h2>
          <T id="StartSignUp.email" />
        </h2>
        <EmailLine
          {...this.state}
          setParentState={this.setParentState}
          handleNewEmail={this.handleNewEmail}
          handleExistingAccount={this.handleExistingAccount}
          loading={loading}
          errorText={errorText}
        />
      </div>
    );
  }
}

StartSignUp.propTypes = {
  formState: PropTypes.objectOf(PropTypes.any).isRequired,
  history: PropTypes.objectOf(PropTypes.any).isRequired,
};
