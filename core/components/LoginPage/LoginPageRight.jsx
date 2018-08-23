// @flow
import { Meteor } from 'meteor/meteor';

import React from 'react';

import { sendVerificationLink } from 'core/api/methods';
import T from '../Translation';
import Accounts from './Accounts';

type LoginPageRightProps = {};

const LoginPageRight = ({ path, push }: LoginPageRightProps) => (
  <div className="right">
    <div className="content">
      <span className="no-account">
        <T
          id="LoginPage.noAccount"
          values={{
            contactUs: (
              <a href={`${Meteor.settings.public.subdomains.www}/contact`}>
                <T id="LoginPage.contactUs" />
              </a>
            ),
          }}
        />
      </span>
      <Accounts.ui.LoginForm
        onSignedInHook={() => push(path || '/')}
        onPostSignUpHook={() => {
          push(path || '/');
          sendVerificationLink.run({});
        }}
      />
    </div>
  </div>
);

export default LoginPageRight;
