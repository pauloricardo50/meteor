//
import { Meteor } from 'meteor/meteor';

import React from 'react';

import { sendVerificationLink } from 'core/api/methods';
import Accounts from './Accounts';
import Link from '../Link';
import T from '../Translation';

const LoginPageRight = ({ path, push }) => {
  const isApp = Meteor.microservice === 'app';
  return (
    <div className="right">
      <div className="content">
        <span className="no-account">
          {isApp ? (
            <T
              id="LoginPage.noAccountApp"
              values={{
                link: (
                  <Link to="/" className="color">
                    <T id="general.here" />
                  </Link>
                ),
              }}
            />
          ) : (
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
          )}
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
};

export default LoginPageRight;
