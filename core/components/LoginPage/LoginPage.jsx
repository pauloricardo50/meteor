import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import React from 'react';
import queryString from 'query-string';

import { sendVerificationLink } from 'core/api/methods';

import { addUserTracking } from '../../utils/analytics';
import { T } from '../Translation';
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
          sendVerificationLink.run({});

          // Create user for analytics
          addUserTracking(Meteor.userId(), {
            email: Meteor.user().emails[0].address,
            id: Meteor.userId(),
          });
        }}
      />
    </section>
  );
};

LoginPage.propTypes = {
  history: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default LoginPage;
