import { Meteor } from 'meteor/meteor';

import React from 'react';

import { sendVerificationLink } from '../../api/users/methodDefinitions';
import Link from '../Link';
import T from '../Translation';
import Accounts from './Accounts';

const LoginPageRight = ({ path, push, onSignInSuccess }) => {
  const isApp = Meteor.microservice === 'app';
  return (
    <div className="right">
      <div className="content">
        <span className="no-account">
          {isApp ? (
            <T
              defaultMessage="Vous n'avez pas de compte? Commencez {link}"
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
              defaultMessage="Vous n'avez pas de compte? {contactUs}"
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
          onSignedInHook={() => {
            push(path || '/');
            if (onSignInSuccess) {
              onSignInSuccess();
            }
          }}
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
