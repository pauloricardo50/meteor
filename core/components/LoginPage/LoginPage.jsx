import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import React from 'react';
import queryString from 'query-string';

import { sendVerificationLink } from 'core/api/methods';

import { addUserTracking } from '../../utils/analytics';
import { T } from '../Translation';
import Accounts from './Accounts';

const LoginPage = ({ location: { search }, history: { push } }) => {
  const { path } = queryString.parse(search);

  return (
    <section className="login-page">
      <div>
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
      </div>
    </section>
  );
};

LoginPage.propTypes = {
  history: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default LoginPage;
