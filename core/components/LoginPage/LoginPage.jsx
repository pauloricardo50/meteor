import PropTypes from 'prop-types';
import React from 'react';
import { Meteor } from 'meteor/meteor';

import { addUserTracking } from '../../utils/analytics';
import { T } from '../Translation';
import Accounts from './Accounts';
import queryString from 'query-string';
import { callMutation, mutations } from 'core/api';

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

const LoginPage = ({ location: { search }, history: { push } }) => {
  const { path } = queryString.parse(search);

  return (
    <section style={styles.section}>
      <h1>
        <T id="LoginPage.title" />
      </h1>
      <Accounts.ui.LoginForm
        onSignedInHook={() => push(path || '/')}
        onPostSignUpHook={() => {
          push(path || '/');
          callMutation(mutations.SEND_VERIFICATION_LINK);

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
};

LoginPage.propTypes = {
  history: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default LoginPage;
