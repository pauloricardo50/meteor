import PropTypes from 'prop-types';
import React from 'react';
import { Meteor } from 'meteor/meteor';

import { addUserTracking } from '/imports/js/helpers/analytics';
import { T } from 'core/components/Translation';
import Accounts from './Accounts';

const styles = {
  section: {
    width: '100%',
    minHeight: 'calc(100% - 64px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    overflowY: 'scroll',
    padding: '0 16px',
  },
};

const handlePasswordReset = () => {
  console.log('resetting password (not)');
};

const LoginPage = props => (
  <section style={styles.section}>
    <h1>
      <T id="LoginPage.title" />
    </h1>
    <Accounts.ui.LoginForm
      onSignedInHook={() => props.history.push('/app')}
      onPostSignUpHook={() => {
        props.history.push('/app');
        Meteor.call('sendVerificationLink', (error, response) => {
          if (error) {
            console.log(error);
          }
          console.log(response);
        });
        // Create user for analytics
        addUserTracking(Meteor.userId(), {
          email: Meteor.user().emails[0].address,
          id: Meteor.userId(),
        });
      }}
      onResetPasswordHook={handlePasswordReset}
    />
  </section>
);

LoginPage.propTypes = {
  history: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default LoginPage;
